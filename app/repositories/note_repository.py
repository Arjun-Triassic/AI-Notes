from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.note import Note


class NoteRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_for_user(self, user_id: int) -> List[Note]:
        result = await self.session.execute(select(Note).where(Note.owner_id == user_id))
        return list(result.scalars().all())

    async def create_for_user(self, user_id: int, title: str, content: str) -> Note:
        note = Note(owner_id=user_id, title=title, content=content)
        self.session.add(note)
        await self.session.flush()
        return note


