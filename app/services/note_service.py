from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.note import Note
from app.repositories.note_repository import NoteRepository


class NoteService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.notes = NoteRepository(session)

    async def list_notes_for_user(self, user_id: int) -> List[Note]:
        return await self.notes.list_for_user(user_id)

    async def create_note_for_user(self, user_id: int, title: str, content: str) -> Note:
        return await self.notes.create_for_user(user_id, title, content)


