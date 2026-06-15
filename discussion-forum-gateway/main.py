from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from middleware.logger import log_request
from middleware.rate_limiter import limiter
from routers import auth_router, posts_router, categories_router, users_router, comments_router, activity_router, search_router, notification_router

app = FastAPI(title="Discussion Forum API Gateway")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(log_request)

app.include_router(auth_router.router)
app.include_router(posts_router.router)
app.include_router(categories_router.router)
app.include_router(users_router.router)
app.include_router(comments_router.router)
app.include_router(activity_router.router)
app.include_router(search_router.router)
app.include_router(notification_router.router)

@app.get("/")
def root():
    return {"message": "Discussion Forum API Gateway is running"}
