from pydantic import BaseModel
from typing import List

class IngestRequest(BaseModel):
    youtube_url: str

class IngestResponse(BaseModel):
    video_id: str
    chunks: int

class ChatRequest(BaseModel):
    video_id: str
    message: str
    history: List[dict] = []

class ChatResponse(BaseModel):
    answer: str
