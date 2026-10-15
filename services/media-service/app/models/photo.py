from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.db.tables import PhotoStatus

MAX_UPLOAD_BYTES = 5 * 1024**3  # S3 single PUT limit (5 GB); larger files need multipart later

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/x-adobe-dng",
    "image/x-canon-cr2",
    "image/x-canon-cr3",
    "image/x-nikon-nef",
    "image/x-sony-arw",
    "application/octet-stream",  # many browsers report RAW files as this
}


class UploadCreate(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: str
    size_bytes: int = Field(gt=0, le=MAX_UPLOAD_BYTES)
    project_id: UUID | None = None


class UploadTicket(BaseModel):
    photo_id: UUID
    upload_url: str
    method: str = "PUT"
    headers: dict[str, str]
    expires_in: int


class PhotoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    project_id: UUID | None
    filename: str
    content_type: str
    size_bytes: int
    status: PhotoStatus
    exif: dict | None
    created_at: datetime
    updated_at: datetime


class PhotoDetail(PhotoOut):
    download_url: str | None = None


class PhotoList(BaseModel):
    items: list[PhotoOut]
    total: int
    limit: int
    offset: int
