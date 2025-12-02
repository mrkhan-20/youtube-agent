from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.ingest import router as ingest_router
from api.routers.chat import router as chat_router


app = FastAPI(title="YouTube Twin Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_router, prefix="/ingest", tags=["ingest"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
