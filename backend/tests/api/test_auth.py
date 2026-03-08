def test_register_success(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "secret123",
        "full_name": "Test User"
    })
    assert res.status_code == 201
    assert res.json()["email"] == "test@example.com"


def test_register_duplicate_email(client):
    payload = {"email": "dup@example.com", "password": "pass", "full_name": "User"}
    client.post("/api/v1/auth/register", json=payload)
    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 400


def test_login_success(client):
    client.post("/api/v1/auth/register", json={
        "email": "login@example.com", "password": "pass123", "full_name": "Login User"
    })
    res = client.post("/api/v1/auth/login", json={
        "email": "login@example.com", "password": "pass123"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password(client):
    client.post("/api/v1/auth/register", json={
        "email": "bad@example.com", "password": "correct", "full_name": "User"
    })
    res = client.post("/api/v1/auth/login", json={"email": "bad@example.com", "password": "wrong"})
    assert res.status_code == 401


def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
