from pydantic import BaseModel
from typing import Optional, List, Union
from uuid import UUID

class StudentBase(BaseModel):
    roll_number: str
    cgpa: Optional[float] = None
    skills: Union[List[str], str] = []
    resume_url: Optional[str] = None
    ats_score: int = 0
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    sslc_percentage: Optional[float] = None
    puc_percentage: Optional[float] = None
    backlogs: int = 0
    certifications: Optional[str] = None

class StudentUpdate(BaseModel):
    roll_number: Optional[str] = None
    cgpa: Optional[float] = None
    skills: Optional[Union[List[str], str]] = None
    resume_url: Optional[str] = None
    ats_score: Optional[int] = None
    branch: Optional[str] = None
    graduation_year: Optional[int] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    sslc_percentage: Optional[float] = None
    puc_percentage: Optional[float] = None
    backlogs: Optional[int] = None
    certifications: Optional[str] = None

class StudentRead(StudentBase):
    id: UUID

    class Config:
        from_attributes = True
