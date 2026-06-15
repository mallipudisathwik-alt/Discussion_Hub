from fastapi import APIRouter, Request
import httpx

router = APIRouter(prefix="/api/search", tags=["search"])
SPRING_BOOT_URL = "http://localhost:8080/api/posts/search"
CATEGORIES_URL = "http://localhost:8080/api/categories"

@router.get("")
async def search(request: Request):
    q = request.query_params.get("q", "")
    async with httpx.AsyncClient() as client:
        posts_resp = await client.get(SPRING_BOOT_URL, params={"q": q})
        posts = posts_resp.json()

        cats_resp = await client.get(CATEGORIES_URL)
        cats = {c["id"]: c["name"] for c in cats_resp.json()}

    results = []
    for p in posts:
        results.append({
            "post_id": p["id"],
            "category": cats.get(p.get("categoryId"), str(p.get("categoryId", ""))),
            "score": 1.0,
            "title": p["title"],
            "content_snippet": p["content"][:300] if p.get("content") else "",
            "tags": p.get("tags") or [],
        })
    return results
