from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class DriveBase(BaseModel):
    company_name: str
    role_description: str
    min_cgpa: float = 0.0
    batch: int
    salary_package: Optional[str] = None
    deadline: Optional[datetime] = None
    status: str = "active"

class DriveCreate(DriveBase):
    pass

class DriveRead(DriveBase):
    id: UUID
    created_by: UUID

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    student_id: UUID
    drive_id: UUID
    status: str = "pending"

class ApplicationRead(ApplicationBase):
    id: UUID
    applied_at: datetime

    class Config:
        from_attributes = True
