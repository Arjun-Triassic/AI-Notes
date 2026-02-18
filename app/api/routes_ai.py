from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id
from app.ai.summary_service import SummaryService
from app.core.db import get_db
from app.services.note_service import NoteService


router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/summarize-note")
async def summarize_note(
    note_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> dict:
    notes = NoteService(db)
    summary_service = SummaryService()

    user_notes = await notes.list_notes_for_user(current_user_id)
    note = next((n for n in user_notes if n.id == note_id), None)
    if note is None:
        return {"error": "Note not found"}

    summary = await summary_service.summarize_note(note.content)
    return {"summary": summary}


