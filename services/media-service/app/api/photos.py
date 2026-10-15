import uuid
from pathlib import PurePath
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.services import storage
from app.core.auth import CurrentUser, get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.db.tables import Photo, PhotoStatus
from app.models.photo import (
    ALLOWED_CONTENT_TYPES,
    PhotoDetail,
    PhotoList,
    PhotoOut,
    UploadCreate,
    UploadTicket,
)

router = APIRouter(prefix="/photos", tags=["photos"])


def _get_owned_photo(db: Session, photo_id: UUID, user: CurrentUser) -> Photo:
    photo = db.get(Photo, photo_id)
    # 404 (not 403) so other users can't probe which IDs exist
    if photo is None or photo.owner_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Photo not found")
    return photo


@router.post("/uploads", response_model=UploadTicket, status_code=status.HTTP_201_CREATED)
def create_upload(
    body: UploadCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Step 1: create a pending photo and return a presigned S3 PUT URL."""
    if body.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, "Unsupported file type")

    photo_id = uuid.uuid4()
    ext = PurePath(body.filename).suffix.lower()
    key = f"originals/{user.id}/{photo_id}{ext}"

    photo = Photo(
        id=photo_id,
        owner_id=user.id,
        project_id=body.project_id,
        filename=body.filename,
        content_type=body.content_type,
        size_bytes=body.size_bytes,
        s3_key=key,
        status=PhotoStatus.pending,
    )
    db.add(photo)
    db.commit()

    return UploadTicket(
        photo_id=photo_id,
        upload_url=storage.presigned_upload_url(key, body.content_type),
        headers={"Content-Type": body.content_type},
        expires_in=get_settings().upload_url_expires,
    )


@router.post("/{photo_id}/complete", response_model=PhotoOut)
def complete_upload(
    photo_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    """Step 3: confirm the browser finished uploading to S3."""
    photo = _get_owned_photo(db, photo_id, user)
    if photo.status != PhotoStatus.pending:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Photo is already {photo.status.value}")

    size = storage.object_size(photo.s3_key)
    if size is None:
        raise HTTPException(status.HTTP_409_CONFLICT, "File not found in storage yet")

    photo.size_bytes = size
    photo.status = PhotoStatus.uploaded
    db.commit()
    # TODO: publish `media.uploaded` to RabbitMQ here
    return photo


@router.get("", response_model=PhotoList)
def list_photos(
    project_id: UUID | None = None,
    photo_status: PhotoStatus | None = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    query = select(Photo).where(Photo.owner_id == user.id)
    if project_id:
        query = query.where(Photo.project_id == project_id)
    if photo_status:
        query = query.where(Photo.status == photo_status)

    total = db.scalar(select(func.count()).select_from(query.subquery()))
    items = db.scalars(query.order_by(Photo.created_at.desc()).limit(limit).offset(offset)).all()
    return PhotoList(items=items, total=total, limit=limit, offset=offset)


@router.get("/{photo_id}", response_model=PhotoDetail)
def get_photo(
    photo_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    photo = _get_owned_photo(db, photo_id, user)
    detail = PhotoDetail.model_validate(photo)
    if photo.status != PhotoStatus.pending:
        detail.download_url = storage.presigned_download_url(photo.s3_key, photo.filename)
    return detail


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_photo(
    photo_id: UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    photo = _get_owned_photo(db, photo_id, user)
    storage.delete_object(photo.s3_key)
    db.delete(photo)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
