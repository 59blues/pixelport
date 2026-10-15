from functools import lru_cache

import boto3
from botocore.exceptions import ClientError

from app.core.config import get_settings


@lru_cache
def _s3():
    s = get_settings()
    session = boto3.Session(profile_name=s.aws_profile, region_name=s.aws_region)
    return session.client("s3")


def presigned_upload_url(key: str, content_type: str) -> str:
    s = get_settings()
    return _s3().generate_presigned_url(
        "put_object",
        Params={"Bucket": s.s3_bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=s.upload_url_expires,
    )


def presigned_download_url(key: str, filename: str) -> str:
    s = get_settings()
    return _s3().generate_presigned_url(
        "get_object",
        Params={
            "Bucket": s.s3_bucket,
            "Key": key,
            "ResponseContentDisposition": f'attachment; filename="{filename}"',
        },
        ExpiresIn=s.download_url_expires,
    )


def object_size(key: str) -> int | None:
    """Returns the object's size in bytes, or None if it doesn't exist."""
    try:
        head = _s3().head_object(Bucket=get_settings().s3_bucket, Key=key)
    except ClientError as e:
        if e.response["Error"]["Code"] in ("404", "NoSuchKey", "NotFound"):
            return None
        raise
    return head["ContentLength"]


def delete_object(key: str) -> None:
    _s3().delete_object(Bucket=get_settings().s3_bucket, Key=key)
