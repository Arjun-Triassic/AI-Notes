from typing import Iterable


class SummaryService:
    """
    Placeholder AI summary service.

    Later, plug in OpenAI / local LLM + embeddings / vector DB here.
    """

    async def summarize_note(self, content: str) -> str:
        # TODO: replace with real LLM call + vector retrieval
        return f"Summary (placeholder): {content[:200]}..."

    async def summarize_documents(self, chunks: Iterable[str]) -> str:
        text = "\n\n".join(chunks)
        return await self.summarize_note(text)


