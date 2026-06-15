from fastapi import APIRouter, Request, HTTPException
from middleware.auth_middleware import validate_token
import httpx

router = APIRouter(prefix="/api/categories", tags=["categories"])
SPRING_BOOT_URL = "http://localhost:8080/api/categories"

@router.get("")
async def get_categories():
    async with httpx.AsyncClient() as client:
        resp = await client.get(SPRING_BOOT_URL)
        return resp.json()

@router.get("/pending")
async def get_pending_categories(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/pending", headers={"Authorization": auth_header})
        return resp.json()

@router.get("/all")
async def get_all_categories(request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/all", headers={"Authorization": auth_header})
        return resp.json()

@router.post("")
async def create_category(request: Request):
    await validate_token(request)
    body = await request.json()
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(SPRING_BOOT_URL, json=body, headers={"Authorization": auth_header})
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()

@router.post("/{category_id}/approve")
async def approve_category(category_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{category_id}/approve", headers={"Authorization": auth_header})
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()

@router.post("/{category_id}/reject")
async def reject_category(category_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{SPRING_BOOT_URL}/{category_id}/reject", headers={"Authorization": auth_header})
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()

@router.delete("/{category_id}")
async def delete_category(category_id: int, request: Request):
    await validate_token(request)
    auth_header = request.headers.get("Authorization")
    async with httpx.AsyncClient() as client:
        resp = await client.delete(f"{SPRING_BOOT_URL}/{category_id}", headers={"Authorization": auth_header})
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()

@router.get("/{slug}/posts")
async def get_category_posts(slug: str, request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{SPRING_BOOT_URL}/{slug}/posts", params=request.query_params)
        return resp.json()
