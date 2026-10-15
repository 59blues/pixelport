import enum
import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class PhotoStatus(str, enum.Enum):
    pending = "pending"        # record created, waiting for the browser to upload to S3
    uploaded = "uploaded"      # file confirmed in S3, waiting for the worker
    processing = "processing"  # worker is generating resolutions / reading EXIF
    ready = "ready"
    failed = "failed"


class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True)
    project_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), index=True)

    filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(BigInteger)
    s3_key: Mapped[str] = mapped_column(String(512), unique=True)

    status: Mapped[PhotoStatus] = mapped_column(
        Enum(PhotoStatus, name="photo_status"), default=PhotoStatus.pending
    )
    # Filled in by the media worker later (ISO, aperture, shutter speed, GPS...)
    exif: Mapped[dict | None] = mapped_column(JSONB)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
