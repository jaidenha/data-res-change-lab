# Database Setup Guide

## Prerequisites

1. **MySQL Workbench** installed and running
2. **Python virtual environment** activated (already done ✓)
3. **Dependencies** installed (already done ✓)

## Setup Steps

### 1. Create MySQL Connection in MySQL Workbench

1. Open **MySQL Workbench**
2. Click the **+** button next to "MySQL Connections"
3. Configure the new connection:
   - **Connection Name**: `Pitch Simulator (3306)`
   - **Hostname**: `localhost`
   - **Port**: `3306`
   - **Username**: `root`
   - **Password**: Click "Store in Vault..." and enter your MySQL password
4. Click **Test Connection** to verify
5. Click **OK** to save

### 2. Create Database

1. In MySQL Workbench, click on your new connection to open it
2. In the query editor, run:

```sql
CREATE DATABASE pitch_simulator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Click the lightning bolt icon (⚡) or press `Cmd+Enter` to execute
4. You should see "1 row(s) affected" in the output

### 3. Configure Database Connection in Your App

1. In VS Code, open the `.env` file in the project root
2. Update the `DATABASE_URL` with your MySQL password:

```bash
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/pitch_simulator
```

Replace `YOUR_PASSWORD` with your actual MySQL root password.

### 4. Add Your Models

In VS Code, edit `models.py` to add your database tables. Example:

```python
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 5. Create Migration

1. In VS Code, open the integrated terminal (`Ctrl+` ` or View > Terminal)
2. Activate the virtual environment and create an initial migration:

```bash
source .venv/bin/activate
alembic revision --autogenerate -m "Initial migration"
```

3. You should see output indicating a new migration file was created in `alembic/versions/`

### 6. Apply Migration to Create Tables

In the terminal, run:

```bash
alembic upgrade head
```

This will create all your tables in MySQL.

### 7. Verify in MySQL Workbench

1. Go back to MySQL Workbench
2. In the query editor, run:

```sql
USE pitch_simulator;
SHOW TABLES;
```

3. You should see your newly created tables listed!

## Common Commands

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback last migration
```bash
alembic downgrade -1
```

### Check current migration version
```bash
alembic current
```

### View migration history
```bash
alembic history
```

## File Structure

```
├── models.py           # Your SQLAlchemy models (define tables here)
├── database.py         # Database connection setup
├── alembic.ini         # Alembic configuration
├── alembic/
│   ├── env.py         # Alembic environment (already configured)
│   └── versions/      # Migration files (auto-generated)
├── .env               # Database credentials (not committed to git)
└── .env.example       # Example environment variables
```

## Tech Stack Integration

- **Node.js/Express**: API routes (keep using `server.js`)
- **Python/Flask**: Optional Python API routes (if needed)
- **MySQL**: Database via MySQL Workbench
- **SQLAlchemy**: ORM for Python
- **Alembic**: Database migrations
- **React**: Frontend (to be added)
- **Tailwind CSS**: Styling (to be added)
- **Gemini API**: AI features (to be integrated)
- **ElevenLabs**: Text-to-speech/speech-to-text (to be integrated)

## Next Steps

1. Set your MySQL password in `.env`
2. Create the database in MySQL Workbench
3. Add your models to `models.py`
4. Run your first migration
5. Verify tables in MySQL Workbench
