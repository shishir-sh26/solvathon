from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class Message(BaseModel):
    role: str # 'ai' or 'student'
    content: str
    timestamp: datetime = datetime.now()

class InterviewSession(BaseModel):
    student_id: str
    mode: str # 'aptitude' or 'interview'
    job_role: str
    difficulty: str
    company_name: Optional[str] = "Mock Company"
    history: List[Message] = []
    current_question: Optional[str] = None
    is_active: bool = True
    start_time: datetime = datetime.now()
    score: Optional[int] = None
    feedback: Optional[str] = None

class InterviewStart(BaseModel):
    student_id: str
    mode: str # 'aptitude' or 'interview'
    job_role: str
    difficulty: str
    company_name: Optional[str] = None

class InterviewResponse(BaseModel):
    student_id: str
    answer: str
