import httpx
from app.core.config import AUTH_SERVICE_URL, REQUEST_TIMEOUT

async def verify_token(authorization_header: str | None):
    if not authorization_header:
        return None
    headers = {"Authorization": authorization_header}
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
        try:
            r = await client.get(f"{AUTH_SERVICE_URL}/verify", headers=headers)
            r.raise_for_status()
            data = r.json()
            return data.get("user")
        except Exception:
            return None
