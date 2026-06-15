# Discussion Forum - API Gateway (FastAPI)

## Overview
Central API gateway that routes all frontend requests to the appropriate backend services. All frontend traffic goes through this gateway.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

Runs on http://localhost:8000

## Routes

| Prefix | Target |
|--------|--------|
| /api/auth/** | Spring Boot (8080) |
| /api/users/** | Spring Boot (8080) |
| /api/posts/** | Spring Boot (8080) |
| /api/categories/** | Spring Boot (8080) |
| /api/comments/** | Node.js (3000) |
| /api/activity/** | Node.js (3000) |
| /api/search/** | Node.js (3000) |

## Dependencies
- fastapi, uvicorn, httpx, python-jose, slowapi, python-multipart
