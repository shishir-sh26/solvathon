from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class StudentBase(BaseModel):
    roll_number: str
    cgpa: Optional[float] = None
    skills: List[str] = []
    resume_url: Optional[str] = None
    ats_score: int = 0
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None

class StudentUpdate(BaseModel):
    cgpa: Optional[float] = None
    skills: Optional[List[str]] = None
    resume_url: Optional[str] = None
    ats_score: Optional[int] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None

class StudentRead(StudentBase):
    id: UUID

    class Config:
        from_attributes = True
