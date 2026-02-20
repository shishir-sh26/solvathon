from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.models.interview import InterviewSession, Message
from app.core.database import supabase
import os
import json
from dotenv import load_dotenv

load_dotenv()

class InterviewService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.7
        )

    async def get_initial_question(self, student_id: str, job_role: str, difficulty: str, mode: str) -> str:
        # Fetch student skills to customize the first question
        try:
            student_data = supabase.table("students").select("skills").eq("id", student_id).single().execute()
            skills = student_data.data.get("skills", []) if student_data.data else []
        except Exception:
            skills = []
        
        if mode == 'aptitude':
            return "Aptitude test session initialized. Generating questions..."

        system_prompt = f"""
        You are a professional hiring manager for a company. 
        You are interviewing a student for the role of {job_role}.
        Difficulty Level: {difficulty} (Easy, Medium, Hard).
        The student's skills are: {", ".join(skills) if isinstance(skills, list) else skills}.
        
        Your task is to conduct a realistic, technical, and situational interview.
        You must MOVE THE INTERVIEW FORWARD by asking structured questions.
        Start by introducing yourself and asking the first interview question.
        Ensure complexity matches {difficulty} level.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content="Hello, I am ready for the interview.")
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content

    async def get_next_question(self, history: list, student_answer: str, job_role: str, difficulty: str) -> str:
        system_prompt = f"""
        You are an AI Interviewer for the role of {job_role}. 
        Difficulty Level: {difficulty}.
        
        Maintain a professional tone. 
        Analyze the student's previous answer but DO NOT give full feedback yet.
        If the answer was good, ask the next question in the sequence.
        If the answer was brief/incomplete, ask a follow-up for more depth.
        PROACTIVE QUESTIONING is key: Always end your response with a clear, focused question for the student.
        """
        
        langchain_history = [SystemMessage(content=system_prompt)]
        for msg in history:
            if msg['role'] == 'ai':
                langchain_history.append(AIMessage(content=msg['content']))
            else:
                langchain_history.append(HumanMessage(content=msg['content']))
        
        langchain_history.append(HumanMessage(content=student_answer))
        
        response = await self.llm.ainvoke(langchain_history)
        return response.content

    async def generate_feedback(self, history: list, job_role: str) -> dict:
        conversation = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in history])
        
        prompt = f"""
        You are an expert career coach. Based on the following interview transcript for a {job_role} position:
        
        {conversation}
        
        Provide a detailed evaluation in JSON format:
        1. "score": (Integer out of 100)
        2. "strengths": (List of strings)
        3. "weaknesses": (List of strings)
        4. "overall_critique": (A short summary paragraph)
        
        Return ONLY valid JSON.
        """
        
        response = await self.llm.ainvoke(prompt)
        response_text = response.content
        
        try:
            # Clean up response if Gemini adds markdown backticks
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()
            return json.loads(json_str)
        except Exception as e:
            return {
                "score": 0,
                "strengths": [],
                "weaknesses": ["Error parsing feedback"],
                "overall_critique": "Could not generate structured feedback."
            }

interview_service = InterviewService()
