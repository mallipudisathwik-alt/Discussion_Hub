from fastapi import Request, HTTPException
from jose import jwt, JWTError
import os

JWT_SECRET = os.getenv("JWT_SECRET", "your_jwt_secret_key_minimum_32_characters")
JWT_ALGORITHM = "HS256"

async def validate_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        request.state.user = payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
