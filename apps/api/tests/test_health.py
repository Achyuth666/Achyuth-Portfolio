from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import app

client = TestClient(app)


def test_healthz_returns_ok() -> None:
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_cors_allows_local_web_origin() -> None:
    response = client.get("/healthz", headers={"Origin": "http://localhost:3100"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:3100"


def test_allowed_origins_parses_comma_separated_env(monkeypatch) -> None:
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://localhost:3100, https://achyuth.dev")
    assert Settings().allowed_origins == ["http://localhost:3100", "https://achyuth.dev"]
