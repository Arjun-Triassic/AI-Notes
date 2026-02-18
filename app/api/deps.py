from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


DbSessionDep = Annotated[AsyncSession, Depends(get_db)]
CurrentUserIdDep = Annotated[int, Depends(lambda: None)]


async def get_auth_service(db: DbSessionDep) -> AuthService:
    return AuthService(db)


async def get_current_user_id(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: DbSessionDep,
) -> int:
    auth = AuthService(db)
    user_email = auth.decode_token(token)
    if not user_email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    repo = UserRepository(db)
    user = await repo.get_by_email(user_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user.id


