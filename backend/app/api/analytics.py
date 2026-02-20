from fastapi import APIRouter
from app.core.database import supabase

router = APIRouter()

@router.get("/stats")
async def get_stats():
    # Simple aggregation stats
    students_count = supabase.table("students").select("id", count="exact").execute().count
    drives_count = supabase.table("drives").select("id", count="exact").execute().count
    apps_count = supabase.table("applications").select("id", count="exact").execute().count
    
    return {
        "total_students": students_count,
        "active_drives": drives_count,
        "total_applications": apps_count,
        "placement_rate": 75.5 # Mock data for now
    }
