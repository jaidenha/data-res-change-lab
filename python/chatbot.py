import os
import time
import wave
import subprocess
import requests
import pyaudio
from dotenv import load_dotenv
from openai import OpenAI

# Load env vars

load_dotenv()

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not ELEVEN_API_KEY:
    raise RuntimeError("ELEVEN_API_KEY not set in .env")
if not DEEPGRAM_API_KEY:
    raise RuntimeError("DEEPGRAM_API_KEY not set in .env")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

# Voice IDs from ElevenLabs account
VOICE_PLAYER = "Xb7hH8MSUJpSbSDYk0k2"    # Alice
CHATBOT_VOICE_ID = VOICE_PLAYER

# Settings
RECORD_SECONDS = 10                # speaking time per turn (was 5)
COUNTDOWN_SECONDS = 3              # countdown before recording
TOKEN_LIMIT_PER_REPLY = 256        # max tokens per OpenAI reply
MAX_HISTORY_MESSAGES = 12          # keep system + last N-1 messages
TOTAL_CONVERSATION_TOKEN_LIMIT = 3000  # hard cap on total tokens used

os.makedirs("audio_out", exist_ok=True)


# Mic recording with countdown

def record_with_countdown(output_filename="audio_out/mic_input.wav",
                          record_seconds=RECORD_SECONDS,
                          rate=16000):
    chunk = 1024
    fmt = pyaudio.paInt16
    channels = 1

    print("\n[Mic] Recording will start in:")
    for i in range(COUNTDOWN_SECONDS, 0, -1):
        print(f"  {i}...")
        time.sleep(1)

    print(f"[Mic] Recording now for {record_seconds} seconds. Speak!")
    p = pyaudio.PyAudio()

    stream = p.open(
        format=fmt,
        channels=channels,
        rate=rate,
        input=True,
        frames_per_buffer=chunk,
    )

    frames = []
    for _ in range(0, int(rate / chunk * record_seconds)):
        data = stream.read(chunk)
        frames.append(data)

    print("[Mic] Done recording.\n")

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(output_filename, "wb")
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(fmt))
    wf.setframerate(rate)
    wf.writeframes(b"".join(frames))
    wf.close()

    return output_filename


# Deepgram STT

def transcribe_with_deepgram(audio_path: str) -> str:
    if audio_path.lower().endswith(".wav"):
        content_type = "audio/wav"
    else:
        content_type = "audio/mp3"

    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": content_type,
    }

    params = {
        "model": "nova-2",
        "smart_format": "true",
        "punctuate": "true",
        "keywords": "aquarium:2,donation:2,pledge:2,campaign:2,donor:2",
    }

    with open(audio_path, "rb") as f:
        audio_bytes = f.read()

    print("[STT] Sending audio to Deepgram...")
    resp = requests.post(
        "https://api.deepgram.com/v1/listen",
        headers=headers,
        params=params,
        data=audio_bytes,
    )

    print(f"[STT] Status: {resp.status_code}")
    if resp.status_code != 200:
        print("[STT] Error body:", resp.text)
        return ""

    try:
        data = resp.json()
        transcript = data["results"]["channels"][0]["alternatives"][0]["transcript"]
    except (KeyError, IndexError) as e:
        print("[STT] Unexpected response structure:", e)
        return ""

    print("[STT] Transcript:", transcript)
    return transcript.strip()


# ElevenLabs TTS

def synthesize_with_elevenlabs(text: str,
                               output_path="audio_out/bot_reply.mp3") -> str:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{CHATBOT_VOICE_ID}"
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.6,
            "similarity_boost": 0.85,
        },
    }

    print("[TTS] Requesting audio from ElevenLabs...")
    resp = requests.post(url, headers=headers, json=payload)
    print(f"[TTS] Status: {resp.status_code}")

    if resp.status_code != 200:
        print("[TTS] Error body:", resp.text)
        return ""

    with open(output_path, "wb") as f:
        f.write(resp.content)

    print(f"[TTS] Saved reply audio to {output_path}")
    return output_path


# OpenAI Chatbot + token budgeting

def trim_history(conversation):
    """Keep system message + last N messages for context."""
    if len(conversation) <= MAX_HISTORY_MESSAGES:
        return conversation
    system_msg = conversation[0]
    recent = conversation[-(MAX_HISTORY_MESSAGES - 1):]
    return [system_msg] + recent


def estimate_tokens_from_text(text: str) -> int:
    """Crude fallback estimate if usage is missing."""
    # Very rough: assume ~1 token per word * 1.3
    words = len(text.split())
    return int(words * 1.3)


def get_chatbot_reply(conversation, user_text: str,
                      tokens_used_so_far: int):
    """
    Append user message, call OpenAI with per-reply limit, and
    return (reply, tokens_for_this_call, new_total_tokens).
    """
    conversation.append({"role": "user", "content": user_text})
    conversation[:] = trim_history(conversation)

    print("[OpenAI] Generating chatbot reply...")
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation,
        max_tokens=TOKEN_LIMIT_PER_REPLY,
    )

    reply = completion.choices[0].message.content
    conversation.append({"role": "assistant", "content": reply})

    # Try to read actual usage from API
    tokens_this_call = 0
    usage = getattr(completion, "usage", None)
    if usage and hasattr(usage, "total_tokens"):
        tokens_this_call = usage.total_tokens
        print(f"[OpenAI] Tokens this call - prompt: {usage.prompt_tokens}, "
              f"completion: {usage.completion_tokens}, total: {usage.total_tokens}")
    else:
        # Fallback estimate
        tokens_this_call = estimate_tokens_from_text(user_text) + estimate_tokens_from_text(reply)
        print(f"[OpenAI] Approximated tokens this call: {tokens_this_call}")

    new_total = tokens_used_so_far + tokens_this_call
    print(f"[OpenAI] Total tokens used so far (approx): {new_total}")

    print("[OpenAI] Reply:", reply)
    return reply, tokens_this_call, new_total


# Main auto-loop with total token budget

def main():
    conversation = [
        {
            "role": "system",
            "content": (
                "You are a friendly, concise fundraising practice partner for an aquarium. "
                "You help the user rehearse donor calls and meetings. "
                f"Keep responses short (2-3 sentences), warm, and professional."
            ),
        }
    ]

    tokens_used_so_far = 0

    print("=== Auto-Loop Voice Fundraising Chatbot ===")
    print("Flow each round:")
    print(f"  - Countdown, then record ~{RECORD_SECONDS} seconds")
    print("  - Transcribe with Deepgram")
    print("  - Get reply from OpenAI (with per-reply token limit)")
    print("  - Speak reply with ElevenLabs")
    print(f"Total conversation token budget: ~{TOTAL_CONVERSATION_TOKEN_LIMIT}")
    print("Say 'quit' / 'exit' / 'stop' in your audio to end.\n")
    print("Ctrl+C in the terminal will also stop it manually.\n")

    round_num = 1
    while True:
        # Stop if token budget exhausted
        if tokens_used_so_far >= TOTAL_CONVERSATION_TOKEN_LIMIT:
            print("\n[Main] Total token budget reached. Ending conversation.")
            break

        print(f"\n=== Round {round_num} ===")

        # 1) Record
        audio_in = record_with_countdown()

        # 2) STT
        user_text = transcribe_with_deepgram(audio_in)
        if not user_text:
            print("[Main] No transcript, skipping this round.")
            round_num += 1
            continue

        print(f"\n[You]: {user_text}\n")

        # Spoken quit
        lower = user_text.lower()
        if any(word in lower for word in ["quit", "exit", "stop"]):
            print("[Main] Heard quit command. Exiting chatbot.")
            break

        # 3) OpenAI reply (update token usage)
        bot_reply, tokens_this_call, tokens_used_so_far = get_chatbot_reply(
            conversation, user_text, tokens_used_so_far
        )

        # If we blew past budget with this call, tell user and stop after TTS
        budget_exceeded = tokens_used_so_far >= TOTAL_CONVERSATION_TOKEN_LIMIT

        # 4) TTS
        bot_audio = synthesize_with_elevenlabs(bot_reply)
        if bot_audio:
            print("[Audio] Playing reply...")
            try:
                subprocess.run(["afplay", bot_audio])
            except FileNotFoundError:
                print("[Audio] 'afplay' not found. On macOS it should be available by default.")

        if budget_exceeded:
            print("\n[Main] Token budget reached after this reply. Ending conversation.")
            break

        round_num += 1


if __name__ == "__main__":
    main()