from fastapi import APIRouter, Request
from middleware.auth_middleware import validate_token
import httpx

router = APIRouter(prefix="/api/posts", tags=["posts"])
SPRING_BOOT_URL = "http://localhost:8080/api/posts"

@router.get("")
async def get_posts(request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.get(SPRING_BOOT_URL, params=request.query_params)
        return resp.json()

@router.post("")
async def create_post(request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(SPRING_BOOT_URL, json=body, headers={"Authorization": auth_header})
        return resp.json()

@router.get("/pending")
async def get_pending_posts(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/pending", headers={"Authorization": auth_header})
        return resp.json()

@router.get("/search")
async def search_posts(request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/search", params=request.query_params)
        return resp.json()

@router.get("/{post_id}")
async def get_post(post_id: int, request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/{post_id}")
        return resp.json()

@router.put("/{post_id}")
async def update_post(post_id: int, request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.put(f"{SPRING_BOOT_URL}/{post_id}", json=body, headers={"Authorization": auth_header})
        return resp.json()

@router.delete("/{post_id}")
async def delete_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.delete(f"{SPRING_BOOT_URL}/{post_id}", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{post_id}/upvote")
async def upvote_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{post_id}/upvote", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{post_id}/downvote")
async def downvote_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{post_id}/downvote", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{post_id}/pin")
async def pin_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{post_id}/pin", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{post_id}/close")
async def close_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{post_id}/close", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{post_id}/approve")
async def approve_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{post_id}/approve", headers={"Authorization": auth_header})
        return resp.json()

@router.post("/{post_id}/reject")
async def reject_post(post_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{post_id}/reject", json=await request.json(), headers={"Authorization": auth_header})
        return resp.json()
