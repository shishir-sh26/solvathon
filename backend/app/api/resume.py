from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser import parse_resume
from app.core.database import supabase
import os

router = APIRouter()

@router.post("/parse")
async def upload_resume(file: UploadFile = File(...)):
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        parsed_data = await parse_resume(temp_path)
        # Update supabase if user_id is provided in context (simplified for now)
        return parsed_data
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("/matching/{drive_id}")
async def get_match(drive_id: str, student_id: str):
    # Fetch job description and student skills
    drive = supabase.table("drives").select("role_description").eq("id", drive_id).single().execute()
    student = supabase.table("students").select("skills").eq("id", student_id).single().execute()
    
    if not drive.data or not student.data:
        raise HTTPException(status_code=404, detail="Drive or Student not found")
    
    from app.services.matching_engine import calculate_match
    match_result = await calculate_match(student.data["skills"], drive.data["role_description"])
    return match_result

@router.get("/generate/{student_id}")
async def generate_resume_pdf(student_id: str):
    # Fetch comprehensive student data
    result = supabase.table("students").select("*, users(full_name, email)").eq("id", student_id).single().execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Flatten data
    student_info = result.data
    student_info['full_name'] = student_info['users']['full_name']
    student_info['email'] = student_info['users']['email']
    
    from app.services.resume_generator import generate_ats_resume
    from fastapi.responses import StreamingResponse
    
    pdf_buffer = generate_ats_resume(student_info)
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Resume_{student_info['full_name'].replace(' ', '_')}.pdf"}
    )
