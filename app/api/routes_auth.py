from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_auth_service
from app.core.db import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserRead
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
async def register_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserRead:
    repo = UserRepository(db)
    auth = AuthService(db)

    existing = await repo.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed = auth.hash_password(data.password)
    user = await repo.create(email=data.email, hashed_password=hashed)
    await db.commit()
    await db.refresh(user)
    return UserRead.model_validate(user)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth: AuthService = Depends(get_auth_service),
) -> dict:
    user = await auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token = auth.create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}


