"""
Database configuration and session management for MySQL
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql+pymysql://root:password@localhost:3306/pitch_simulator')

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,  # Verify connections before using them
    pool_recycle=3600,  # Recycle connections after 1 hour
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session.
    Usage:
        db = next(get_db())
        try:
            # Use db here
        finally:
            db.close()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database - create all tables
    """
    from models import Base
    Base.metadata.create_all(bind=engine)
