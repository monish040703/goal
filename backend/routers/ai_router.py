from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_user
from agents import summary_graph, theme_graph, THEMES

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/weekly-summary", response_model=schemas.WeeklySummaryResponse)
async def weekly_summary(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = [
        {
            "title": t.title,
            "completion_percentage": t.completion_percentage,
            "subtasks": [{"title": s.title, "completed": s.completed} for s in t.subtasks]
        }
        for t in current_user.tasks
    ]
    businesses = [
        {
            "title": b.title,
            "industry": b.industry,
            "completion_percentage": b.completion_percentage
        }
        for b in current_user.businesses
    ]
    
    result = summary_graph.invoke({
        "tasks": tasks,
        "businesses": businesses,
        "raw_summary": "",
        "insights": [],
        "recommendations": [],
        "done": False
    })
    
    return schemas.WeeklySummaryResponse(
        summary=result["raw_summary"],
        insights=result["insights"],
        recommendations=result["recommendations"]
    )

@router.post("/theme", response_model=schemas.ThemeResponse)
async def change_theme(request: schemas.ThemeRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = theme_graph.invoke({
        "preference": request.preference,
        "theme_name": "",
        "colors": {},
        "message": "",
        "done": False
    })
    
    # Save theme to user profile
    current_user.theme = result["theme_name"]
    db.commit()
    
    colors = result["colors"]
    return schemas.ThemeResponse(
        theme=result["theme_name"],
        primary=colors.get("primary", "#6366f1"),
        secondary=colors.get("secondary", "#8b5cf6"),
        accent=colors.get("accent", "#a78bfa"),
        background=colors.get("background", "#0f0a1e"),
        message=result["message"]
    )

@router.get("/themes")
def get_themes():
    return THEMES
