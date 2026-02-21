from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.models.interview import InterviewSession, Message
from app.core.database import supabase
import os
import json
import random
from dotenv import load_dotenv

load_dotenv()

# Fallback questions used when the AI API is unavailable
FALLBACK_QUESTIONS = {
    "Software Engineering": [
        "Hello! I'm your interviewer today. Let's start with the basics — can you walk me through your experience with software development and your strongest programming languages?",
        "Great! Can you describe a challenging technical problem you've solved? Walk me through your thought process.",
        "How do you approach writing clean, maintainable code? Do you follow any particular design patterns?",
        "Tell me about your experience with databases — both SQL and NoSQL. When would you choose one over the other?",
        "How do you handle version control? Describe your typical Git workflow.",
        "Explain the concept of RESTful APIs. Have you built any? What were some challenges you faced?",
        "How do you approach debugging a complex issue in production? Walk me through your process.",
        "What's your experience with testing? Do you practice TDD or write tests after implementation?",
    ],
    "Data Science": [
        "Hello! Let's begin — can you describe your experience with data analysis and the tools you most commonly use?",
        "Walk me through a data science project from start to finish. How did you handle data cleaning?",
        "Explain the difference between supervised and unsupervised learning with examples.",
        "How do you handle class imbalance in classification problems?",
        "Describe your experience with Python libraries like Pandas, NumPy, and Scikit-learn.",
        "How do you validate a machine learning model? What metrics do you use?",
        "What is feature engineering and why is it important?",
        "Describe a situation where you had to communicate complex data insights to a non-technical audience.",
    ],
    "default": [
        "Hello! Welcome to your interview. Can you start by introducing yourself and your background?",
        "What are your key strengths and how do they align with this role?",
        "Describe a challenging project you worked on. What was your contribution?",
        "How do you prioritize tasks when working on multiple projects simultaneously?",
        "Tell me about a time you had to learn a new skill quickly. How did you approach it?",
        "How do you handle constructive criticism or feedback from peers?",
        "Where do you see yourself in the next 3-5 years professionally?",
        "Do you have any questions for us about this role or the organization?",
    ]
}


class InterviewService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.7
            )
            self.ai_available = True
        except Exception as e:
            print(f"WARNING: Could not initialize Gemini LLM: {e}. Using fallback mode.")
            self.llm = None
            self.ai_available = False

    def _get_fallback_question(self, job_role: str, question_index: int = 0) -> str:
        questions = FALLBACK_QUESTIONS.get(job_role, FALLBACK_QUESTIONS["default"])
        idx = question_index % len(questions)
        return questions[idx]

    async def get_initial_question(self, student_id: str, job_role: str, difficulty: str, mode: str) -> str:
        if mode == 'aptitude':
            return "Aptitude test session initialized. Generating questions..."

        # Try to fetch student skills
        skills = []
        try:
            student_data = supabase.table("students").select("skills").eq("id", student_id).single().execute()
            skills = student_data.data.get("skills", []) if student_data.data else []
        except Exception:
            pass

        if not self.ai_available:
            return self._get_fallback_question(job_role, 0)

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

        try:
            response = await self.llm.ainvoke(messages)
            return response.content
        except Exception as e:
            print(f"Gemini API Error: {e}. Using fallback question.")
            return self._get_fallback_question(job_role, 0)

    async def get_next_question(self, history: list, student_answer: str, job_role: str, difficulty: str) -> str:
        if not self.ai_available:
            q_idx = len([m for m in history if m.get('role') == 'ai'])
            return self._get_fallback_question(job_role, q_idx)

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

        try:
            response = await self.llm.ainvoke(langchain_history)
            return response.content
        except Exception as e:
            print(f"Gemini API Error: {e}. Using fallback question.")
            q_idx = len([m for m in history if m.get('role') == 'ai'])
            return self._get_fallback_question(job_role, q_idx)

    async def generate_feedback(self, history: list, job_role: str) -> dict:
        if not self.ai_available:
            return self._generate_fallback_feedback(history)

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

        try:
            response = await self.llm.ainvoke(prompt)
            response_text = response.content

            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text.strip()
            return json.loads(json_str)
        except Exception as e:
            print(f"Gemini API Error: {e}. Using fallback feedback.")
            return self._generate_fallback_feedback(history)

    def _generate_fallback_feedback(self, history: list) -> dict:
        """Generate a meaningful feedback report based on response length/count when AI is unavailable."""
        student_responses = [m for m in history if m.get('role') == 'student']
        num_responses = len(student_responses)
        avg_length = sum(len(r.get('content', '')) for r in student_responses) / max(num_responses, 1)

        # Score based on participation and response length
        base_score = min(95, 50 + (num_responses * 5) + min(30, int(avg_length / 10)))

        return {
            "score": base_score,
            "strengths": [
                "Demonstrated willingness to participate in the interview process",
                "Showed structured communication skills",
                f"Completed {num_responses} question(s) in the session"
            ],
            "weaknesses": [
                "Detailed AI analysis unavailable — please update the GEMINI_API_KEY in .env for full evaluation",
                "Consider elaborating on technical answers with concrete examples"
            ],
            "overall_critique": f"You completed a {num_responses}-exchange interview session. This is a preliminary score based on your participation. For a full AI-powered evaluation with detailed feedback on your actual answers, please ensure a valid GEMINI_API_KEY is configured in the backend."
        }


interview_service = InterviewService()
