from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth_router, tasks_router, business_router, ai_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GoalFlow API",
    description="AI-powered productivity and business goal tracking",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(tasks_router.router)
app.include_router(business_router.router)
app.include_router(ai_router.router)

@app.get("/")
def root():
    return {"message": "GoalFlow API is running 🚀", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
