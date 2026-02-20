from fastapi import APIRouter, HTTPException
from app.core.database import supabase
from app.models.job import ApplicationBase, ApplicationRead
from typing import List

router = APIRouter()

@router.post("/apply", response_model=ApplicationRead)
async def apply_to_drive(application: ApplicationBase):
    result = supabase.table("applications").insert(application.dict()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to submit application")
    return result.data[0]

@router.get("/my-applications/{student_id}")
async def get_my_applications(student_id: str):
    result = supabase.table("applications").select("*, drives(company_name, salary_package, status)").eq("student_id", student_id).execute()
    return result.data

@router.get("/drives")
async def get_available_drives(batch: int):
    result = supabase.table("drives").select("*").eq("batch", batch).eq("status", "active").execute()
    return result.data
