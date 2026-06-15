from fastapi import APIRouter, Request
from middleware.auth_middleware import validate_token
import httpx

router = APIRouter(prefix="/api/users", tags=["users"])
SPRING_BOOT_URL = "http://localhost:8080/api/users"

@router.get("")
async def get_all_users(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(SPRING_BOOT_URL, headers={"Authorization": auth_header})
        return resp.json()

@router.get("/{user_id}")
async def get_user(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/{user_id}")
        return resp.json()

@router.put("/{user_id}")
async def update_user(user_id: int, request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.put(f"{SPRING_BOOT_URL}/{user_id}", json=body, headers={"Authorization": auth_header})
        return resp.json()

@router.delete("/{user_id}")
async def delete_user(user_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.delete(f"{SPRING_BOOT_URL}/{user_id}", headers={"Authorization": auth_header})
        return resp.json()

@router.get("/{user_id}/posts")
async def get_user_posts(user_id: int, request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/{user_id}/posts", params=request.query_params)
        return resp.json()
