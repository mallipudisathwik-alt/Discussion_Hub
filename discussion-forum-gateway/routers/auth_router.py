from fastapi import APIRouter, Request
import httpx

router = APIRouter(prefix="/api/auth", tags=["auth"])
SPRING_BOOT_URL = "http://localhost:8080/api/auth"

@router.post("/register")
async def register(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/register", json=body)
        return resp.json()

@router.post("/login")
async def login(request: Request):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/login", json=body)
        return resp.json()

@router.get("/me")
async def get_me(request: Request):
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/me", headers={"Authorization": auth_header})
        return resp.json()
