from fastapi import APIRouter, HTTPException
from api.schemas import IngestRequest, IngestResponse
from api.db import index
from api.utils.transcript import  fetch_transcript
from api.utils.chunk import chunk_text
from api.utils.embeddings import embed_texts

router = APIRouter()

@router.post("", response_model=IngestResponse)
def ingest(req: IngestRequest):
    #should also work if only id is provided in the same input format as the url
    try:
        if req.youtube_url.startswith("https://www.youtube.com/watch?v="):
            video_id = req.youtube_url.split("?v=")[1]
        else:
            video_id = req.youtube_url

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    transcript = fetch_transcript(video_id)
    chunks = chunk_text(transcript, max_tokens=300)
    embeddings = embed_texts(chunks)

    vectors = [{
        "id": f"{video_id}-{i}",
        "values": emb,
        "metadata": {"text": chunk},
    } for i, (emb, chunk) in enumerate(zip(embeddings, chunks))]

    namespaces = index.list_namespaces()
    if video_id in namespaces:
        index.delete(namespace=video_id, delete_all=True)
    index.upsert(vectors=vectors, namespace=video_id)

    return IngestResponse(video_id=video_id, chunks=len(chunks))
