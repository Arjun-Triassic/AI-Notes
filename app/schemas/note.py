from datetime import datetime

from pydantic import BaseModel


class NoteBase(BaseModel):
    title: str
    content: str


class NoteCreate(NoteBase):
    pass


class NoteRead(NoteBase):
    id: int
    owner_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


