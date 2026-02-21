from fastapi import APIRouter, HTTPException
from app.models.interview import InterviewStart, InterviewResponse, InterviewSession, Message
from app.services.interview_service import interview_service
from app.services.aptitude_service import aptitude_service
from typing import Dict, List
from datetime import datetime

router = APIRouter()

# In-memory storage for active sessions
active_sessions: Dict[str, InterviewSession] = {}

@router.post("/start")
async def start_interview(data: InterviewStart):
    print(f"DEBUG: Starting session for {data.student_id} in {data.mode} mode")
    try:
        # Get initial content from Gemini based on Mode, Domain and Difficulty
        first_question = await interview_service.get_initial_question(data.student_id, data.job_role, data.difficulty, data.mode)
        
        session = InterviewSession(
            student_id=data.student_id,
            mode=data.mode,
            job_role=data.job_role,
            difficulty=data.difficulty,
            company_name=data.company_name or "Mock Company",
            current_question=first_question,
            history=[Message(role="ai", content=first_question)]
        )
        
        active_sessions[data.student_id] = session
        return {"session_id": data.student_id, "question": first_question}
    except Exception as e:
        print(f"ERROR in /start: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/aptitude/questions/{student_id}")
async def get_aptitude_questions(student_id: str):
    if student_id not in active_sessions or active_sessions[student_id].mode != 'aptitude':
        raise HTTPException(status_code=400, detail="No active aptitude session found")
    
    session = active_sessions[student_id]
    questions = await aptitude_service.generate_test(session.job_role, session.difficulty)
    return {"questions": questions}

@router.post("/aptitude/submit/{student_id}")
async def submit_aptitude_test(student_id: str, data: dict):
    if student_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # In a real app, you'd store the questions in the session
    # For now, we'll re-calculate or assume the client sends the mapping
    # Simplified: client sends { "answers": {...}, "questions": [...] }
    result = aptitude_service.calculate_score(data['questions'], data['answers'])
    
    # Cleanup session
    del active_sessions[student_id]
    return result

@router.post("/respond")
async def respond_to_question(data: InterviewResponse):
    if data.student_id not in active_sessions:
        raise HTTPException(status_code=404, detail="No active interview session found")
    
    session = active_sessions[data.student_id]
    
    # Add student answer to history
    session.history.append(Message(role="student", content=data.answer))
    
    # Logic for a ~10 minute interview (approx 8-10 exchanges total)
    if len(session.history) >= 16: # 8 AI questions + 8 Student answers
        return {"status": "completed", "message": "Interview completed. Please fetch feedback."}

    # Get next question from Gemini
    next_q = await interview_service.get_next_question(
        [m.dict() for m in session.history], 
        data.answer, 
        session.job_role,
        session.difficulty
    )
    
    session.current_question = next_q
    session.history.append(Message(role="ai", content=next_q))
    
    return {"question": next_q}

@router.get("/feedback/{student_id}")
async def get_interview_feedback(student_id: str):
    if student_id not in active_sessions:
        raise HTTPException(status_code=404, detail="No session found")
    
    session = active_sessions[student_id]
    
    # Generate final feedback using Gemini
    feedback_data = await interview_service.generate_feedback(
        [m.dict() for m in session.history], 
        session.job_role
    )
    
    # Optional: Save to Supabase for persistence
    # results = supabase.table("interviews").insert({...}).execute()
    
    # Cleanup session
    del active_sessions[student_id]
    
    return feedback_data
