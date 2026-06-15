from fastapi import APIRouter, Request
from middleware.auth_middleware import validate_token
import httpx

router = APIRouter(prefix="/api/notifications", tags=["notifications"])
SPRING_BOOT_URL = "http://localhost:8080/api/notifications"

@router.get("")
async def get_notifications(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(SPRING_BOOT_URL, headers={"Authorization": auth_header})
        return resp.json()

@router.get("/unread-count")
async def get_unread_count(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/unread-count", headers={"Authorization": auth_header})
        return resp.json()

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.put(f"{SPRING_BOOT_URL}/{notification_id}/read", headers={"Authorization": auth_header})
        return resp.json()

@router.put("/read-all")
async def mark_all_as_read(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.put(f"{SPRING_BOOT_URL}/read-all", headers={"Authorization": auth_header})
        return resp.json()
