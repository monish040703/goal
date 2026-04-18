from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    theme: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Subtasks
class SubtaskCreate(BaseModel):
    title: str

class SubtaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class SubtaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    task_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    color: Optional[str] = "#6366f1"
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    color: str
    owner_id: int
    created_at: datetime
    due_date: Optional[datetime]
    subtasks: List[SubtaskOut] = []
    completion_percentage: int
    class Config:
        from_attributes = True

# Business Goals
class BusinessGoalCreate(BaseModel):
    title: str
    description: Optional[str] = ""

class BusinessGoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class BusinessGoalOut(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    business_id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Business
class BusinessCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    industry: Optional[str] = ""
    color: Optional[str] = "#10b981"

class BusinessUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    color: Optional[str] = None

class BusinessOut(BaseModel):
    id: int
    title: str
    description: str
    industry: str
    color: str
    owner_id: int
    created_at: datetime
    goals: List[BusinessGoalOut] = []
    completion_percentage: int
    class Config:
        from_attributes = True

# AI
class AIRequest(BaseModel):
    message: str

class ThemeRequest(BaseModel):
    preference: str

class ThemeResponse(BaseModel):
    theme: str
    primary: str
    secondary: str
    accent: str
    background: str
    message: str

class WeeklySummaryResponse(BaseModel):
    summary: str
    insights: List[str]
    recommendations: List[str]
