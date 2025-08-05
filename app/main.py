from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.admin.setup import admin
from app.routers import auth as auth_router
from app.routers import event as event_router
from app.routers import registration as registration_router

app = FastAPI(
    title="Event Management System",
    description="A system to manage events",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Event Management System API"}


app.include_router(auth_router.router)
app.include_router(event_router.router)
app.include_router(registration_router.router)

admin.mount_to(app)