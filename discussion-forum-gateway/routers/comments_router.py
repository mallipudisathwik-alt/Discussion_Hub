from fastapi import APIRouter, Request
from middleware.auth_middleware import validate_token
import httpx

router = APIRouter(prefix="/api/comments", tags=["comments"])
NODE_URL = "http://localhost:3000/api/comments"

@router.get("/{post_id}")
async def get_comments(post_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{NODE_URL}/{post_id}")
        return resp.json()

@router.post("/{post_id}")
async def add_comment(post_id: int, request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{NODE_URL}/{post_id}", json=body, headers={"Authorization": auth_header})
        return resp.json()

@router.put("/{comment_id}")
async def edit_comment(comment_id: str, request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.put(f"{NODE_URL}/{comment_id}", json=body, headers={"Authorization": auth_header})
        return resp.json()

@router.delete("/{comment_id}")
async def delete_comment(comment_id: str, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.delete(f"{NODE_URL}/{comment_id}", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{comment_id}/reply")
async def reply_to_comment(comment_id: str, request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{NODE_URL}/{comment_id}/reply", json=body, headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{comment_id}/upvote")
async def upvote_comment(comment_id: str, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{NODE_URL}/{comment_id}/upvote", headers={"Authorization": auth_header})
        return resp.json()
