from fastapi import APIRouter
from app.services.sql_agent import query_jarvis
from pydantic import BaseModel

router = APIRouter()

class BotQuery(BaseModel):
    query: str

@router.post("/query")
async def jarvis_query(data: BotQuery):
    response = await query_jarvis(data.query)
    return {"response": response}
