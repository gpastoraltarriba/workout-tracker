from datetime import datetime


def _register_and_login(client, email="user@test.com"):
    client.post("/api/v1/auth/register", json={
        "email": email, "password": "pass123", "full_name": "User"
    })
    res = client.post("/api/v1/auth/login", json={"email": email, "password": "pass123"})
    return res.json()["access_token"]


def test_create_workout(client):
    token = _register_and_login(client)
    res = client.post("/api/v1/workouts", json={
        "title": "Leg Day",
        "started_at": datetime.now().isoformat(),
        "exercises": [
            {"name": "Squat", "order": 1, "sets": [
                {"set_number": 1, "reps": 5, "weight_kg": 100}
            ]}
        ]
    }, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 201
    assert res.json()["title"] == "Leg Day"


def test_list_workouts_requires_auth(client):
    res = client.get("/api/v1/workouts")
    assert res.status_code == 403
