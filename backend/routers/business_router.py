from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/business", tags=["business"])

@router.get("/", response_model=List[schemas.BusinessOut])
def get_businesses(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user.businesses

@router.post("/", response_model=schemas.BusinessOut)
def create_business(biz_data: schemas.BusinessCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    biz = models.Business(**biz_data.model_dump(), owner_id=current_user.id)
    db.add(biz)
    db.commit()
    db.refresh(biz)
    return biz

@router.get("/{biz_id}", response_model=schemas.BusinessOut)
def get_business(biz_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    biz = db.query(models.Business).filter(models.Business.id == biz_id, models.Business.owner_id == current_user.id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return biz

@router.put("/{biz_id}", response_model=schemas.BusinessOut)
def update_business(biz_id: int, biz_data: schemas.BusinessUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    biz = db.query(models.Business).filter(models.Business.id == biz_id, models.Business.owner_id == current_user.id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    for field, value in biz_data.model_dump(exclude_unset=True).items():
        setattr(biz, field, value)
    db.commit()
    db.refresh(biz)
    return biz

@router.delete("/{biz_id}")
def delete_business(biz_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    biz = db.query(models.Business).filter(models.Business.id == biz_id, models.Business.owner_id == current_user.id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    db.delete(biz)
    db.commit()
    return {"ok": True}

# Business Goals
@router.post("/{biz_id}/goals", response_model=schemas.BusinessGoalOut)
def add_goal(biz_id: int, goal_data: schemas.BusinessGoalCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    biz = db.query(models.Business).filter(models.Business.id == biz_id, models.Business.owner_id == current_user.id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    goal = models.BusinessGoal(**goal_data.model_dump(), business_id=biz_id)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.put("/{biz_id}/goals/{goal_id}", response_model=schemas.BusinessGoalOut)
def update_goal(biz_id: int, goal_id: int, goal_data: schemas.BusinessGoalUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(models.BusinessGoal).filter(models.BusinessGoal.id == goal_id, models.BusinessGoal.business_id == biz_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for field, value in goal_data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/{biz_id}/goals/{goal_id}")
def delete_goal(biz_id: int, goal_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.query(models.BusinessGoal).filter(models.BusinessGoal.id == goal_id, models.BusinessGoal.business_id == biz_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"ok": True}
