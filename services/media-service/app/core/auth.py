"""Verifies Supabase access tokens sent as `Authorization: Bearer <jwt>`."""

from dataclasses import dataclass
from functools import lru_cache
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings

bearer = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    id: UUID
    email: str | None
    role: str


@lru_cache
def _jwks_client() -> jwt.PyJWKClient:
    # Supabase projects using asymmetric signing keys publish them here.
    # If your project still uses the legacy HS256 secret, switch to it under
    # Project Settings -> JWT Keys, or verify with the shared secret instead.
    return jwt.PyJWKClient(get_settings().jwks_url, cache_keys=True)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> CurrentUser:
    if creds is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")

    try:
        signing_key = _jwks_client().get_signing_key_from_jwt(creds.credentials)
        claims = jwt.decode(
            creds.credentials,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except jwt.PyJWTError as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Invalid token: {e}")

    return CurrentUser(
        id=UUID(claims["sub"]),
        email=claims.get("email"),
        role=claims.get("role", "authenticated"),
    )
