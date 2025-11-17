from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import items
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="DnF Cash Item Efficiency API",
    description="던파 캐시 아이템 효율 계산 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(items.router)


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "DnF Cash Item Efficiency API",
        "docs": "/docs",
        "health": "/api/items/health"
    }
