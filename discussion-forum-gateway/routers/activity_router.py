from fastapi import APIRouter, Request
from middleware.auth_middleware import validate_token
import httpx

router = APIRouter(prefix="/api/activity", tags=["activity"])
NODE_URL = "http://localhost:3000/api/activity"

@router.get("")
async def get_activity(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(NODE_URL, headers={"Authorization": auth_header})
        return resp.json()

@router.post("")
async def log_activity(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(NODE_URL, json=body)
        return resp.json()
