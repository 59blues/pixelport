from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.session import Base, engine
from app.api import photos


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creates missing tables on startup. Swap for Alembic migrations once the schema settles.
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="Pixelport Media Service", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(photos.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
