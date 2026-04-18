from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    theme = Column(String, default="dark-purple")
    created_at = Column(DateTime, default=datetime.utcnow)
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    businesses = relationship("Business", back_populates="owner", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    color = Column(String, default="#6366f1")
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    owner = relationship("User", back_populates="tasks")
    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan")

    @property
    def completion_percentage(self):
        if not self.subtasks:
            return 0
        done = sum(1 for s in self.subtasks if s.completed)
        return round((done / len(self.subtasks)) * 100)

class Subtask(Base):
    __tablename__ = "subtasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    task = relationship("Task", back_populates="subtasks")

class Business(Base):
    __tablename__ = "businesses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    industry = Column(String, default="")
    color = Column(String, default="#10b981")
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="businesses")
    goals = relationship("BusinessGoal", back_populates="business", cascade="all, delete-orphan")

    @property
    def completion_percentage(self):
        if not self.goals:
            return 0
        done = sum(1 for g in self.goals if g.completed)
        return round((done / len(self.goals)) * 100)

class BusinessGoal(Base):
    __tablename__ = "business_goals"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    completed = Column(Boolean, default=False)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    business = relationship("Business", back_populates="goals")
