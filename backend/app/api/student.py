from fastapi import APIRouter, HTTPException
from app.core.database import supabase
from app.models.job import ApplicationBase, ApplicationRead
from app.models.student import StudentUpdate
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

@router.get("/profile/{student_id}")
async def get_profile(student_id: str):
    result = supabase.table("students").select("*").eq("id", student_id).execute()
    if not result.data:
        # If no profile exists yet, return empty but don't fail
        return {"data": None}
    return {"data": result.data[0]}

@router.put("/profile/{student_id}")
async def update_profile(student_id: str, profile_data: StudentUpdate):
    # Convert Pydantic model to dict, excluding None values
    update_data = profile_data.dict(exclude_unset=True)
    
    # Ensure ID is included for upsert logic
    update_data["id"] = student_id
    
    # Handle skills if it's a comma-separated string coming from frontend
    if "skills" in update_data and isinstance(update_data["skills"], str):
        update_data["skills"] = [s.strip() for s in update_data["skills"].split(",") if s.strip()]

    # Use upsert to create if missing, update if exists
    result = supabase.table("students").upsert(update_data).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save profile")
    
    return {"message": "Profile saved successfully", "data": result.data[0]}
