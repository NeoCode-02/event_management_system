from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.models.event import Event
from app.schemas.event import EventCreate, EventOut, EventUpdate
from app.utils.dependencies import current_user_dependency, db_dependency

router = APIRouter(prefix="/events", tags=["events"])

# ------------------ Event APIs ------------------


@router.post("/events/", response_model=EventOut)
def create_event(
    payload: EventCreate,
    db: db_dependency,
    current_user: current_user_dependency,
):
    if not current_user.is_confirmed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only confirmed users can create events",
        )

    event = Event(**payload.model_dump(), organizer_id=current_user.id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/events/", response_model=list[EventOut])
def list_events(
    db: db_dependency,
    skip: int = 0,
    limit: int = 10,
):
    query = db.query(Event)
    return query.offset(skip).limit(limit).all()


@router.get("/events/{event_id}", response_model=EventOut)
def get_event(event_id: UUID, db: db_dependency):
    event = db.query(Event).filter_by(id=event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/events/{event_id}", response_model=EventOut)
def update_event(
    event_id: UUID,
    payload: EventUpdate,
    db: db_dependency,
    current_user: current_user_dependency,
):
    event = db.query(Event).filter_by(id=event_id).first()
    if not event or event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/events/{event_id}")
def delete_event(
    event_id: UUID, db: db_dependency, current_user: current_user_dependency
):
    event = db.query(Event).filter_by(id=event_id).first()
    if not event or event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(event)
    db.commit()
    return {"detail": "Event deleted"}
