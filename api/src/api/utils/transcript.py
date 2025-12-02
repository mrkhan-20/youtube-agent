import re
from youtube_transcript_api import YouTubeTranscriptApi

def fetch_transcript(video_id: str) -> str:
    ytt_api = YouTubeTranscriptApi()
    fetched_transcript = ytt_api.fetch(video_id)
    return " ".join([t.text for t in fetched_transcript])
