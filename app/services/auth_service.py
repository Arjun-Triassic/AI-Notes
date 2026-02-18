from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.user import User
from app.repositories.user_repository import UserRepository


# Use pbkdf2_sha256 to avoid bcrypt backend issues/limits (and bcrypt/passlib compatibility quirks).
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
settings = get_settings()


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_access_token(self, subject: str, expires_delta: timedelta | None = None) -> str:
        if expires_delta is None:
            expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode: Dict[str, Any] = {"sub": subject, "exp": expire}
        return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

    async def authenticate_user(self, email: str, password: str) -> User | None:
        user = await self.users.get_by_email(email)
        if not user or not self.verify_password(password, user.hashed_password):
            return None
        return user

    def decode_token(self, token: str) -> str | None:
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            return str(payload.get("sub"))
        except JWTError:
            return None


