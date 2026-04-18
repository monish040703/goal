from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user.tasks

@router.post("/", response_model=schemas.TaskOut)
def create_task(task_data: schemas.TaskCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = models.Task(**task_data.model_dump(), owner_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task_data: schemas.TaskUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"ok": True}

# Subtasks
@router.post("/{task_id}/subtasks", response_model=schemas.SubtaskOut)
def add_subtask(task_id: int, subtask_data: schemas.SubtaskCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    subtask = models.Subtask(**subtask_data.model_dump(), task_id=task_id)
    db.add(subtask)
    db.commit()
    db.refresh(subtask)
    return subtask

@router.put("/{task_id}/subtasks/{subtask_id}", response_model=schemas.SubtaskOut)
def update_subtask(task_id: int, subtask_id: int, subtask_data: schemas.SubtaskUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id, models.Subtask.task_id == task_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    for field, value in subtask_data.model_dump(exclude_unset=True).items():
        setattr(subtask, field, value)
    db.commit()
    db.refresh(subtask)
    return subtask

@router.delete("/{task_id}/subtasks/{subtask_id}")
def delete_subtask(task_id: int, subtask_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id, models.Subtask.task_id == task_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    db.delete(subtask)
    db.commit()
    return {"ok": True}
