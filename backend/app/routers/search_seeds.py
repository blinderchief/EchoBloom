from fastapi import APIRouter
from qdrant_client import QdrantClient

router = APIRouter()

client = QdrantClient("http://localhost:6333")

@router.get("/search-seeds")
async def search_seeds(query: str):
    # Vector search in Qdrant
    results = client.search("seeds", query_vector=[0.1]*384, limit=10)  # Placeholder
    return results