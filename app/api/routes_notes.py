from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.core.db import get_db
from app.schemas.note import NoteCreate, NoteRead
from app.services.note_service import NoteService


router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=List[NoteRead])
async def list_notes(
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> List[NoteRead]:
    service = NoteService(db)
    notes = await service.list_notes_for_user(current_user_id)
    return [NoteRead.model_validate(n) for n in notes]


@router.post("/", response_model=NoteRead)
async def create_note(
    data: NoteCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> NoteRead:
    service = NoteService(db)
    note = await service.create_note_for_user(current_user_id, data.title, data.content)
    await db.commit()
    await db.refresh(note)
    return NoteRead.model_validate(note)


