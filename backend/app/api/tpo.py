from fastapi import APIRouter, HTTPException, Depends
from app.core.database import supabase
from app.models.job import DriveCreate, DriveRead
from typing import List

router = APIRouter()

@router.post("/drives", response_model=DriveRead)
async def create_drive(drive: DriveCreate, tpo_id: str):
    drive_data = drive.dict()
    drive_data["created_by"] = tpo_id
    result = supabase.table("drives").insert(drive_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create drive")
    return result.data[0]

@router.get("/drives", response_model=List[DriveRead])
async def get_drives():
    result = supabase.table("drives").select("*").execute()
    return result.data

@router.get("/students")
async def get_eligible_students(min_cgpa: float = 0.0):
    result = supabase.table("students").select("*, users(full_name, email)").gte("cgpa", min_cgpa).execute()
    return result.data
