from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.models.event import Event
from app.models.registration import Registration, Status
from app.schemas.registration import (
    RegistrationCreate,
    RegistrationOut,
    RegistrationUpdate,
)
from app.utils.dependencies import current_user_dependency, db_dependency

router = APIRouter(prefix="/registrations", tags=["registrations"])


@router.post("/events/{event_id}/register", response_model=RegistrationOut)
def register_for_event(event_id: UUID, payload: RegistrationCreate, db: db_dependency):
    event = db.query(Event).filter_by(id=event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    registration = Registration(
        event_id=event_id, status=Status.WAITLIST, **payload.model_dump()
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration


@router.get("/events/{event_id}/registrations", response_model=list[RegistrationOut])
def list_registrations(
    event_id: UUID, db: db_dependency, current_user: current_user_dependency
):
    event = db.query(Event).filter_by(id=event_id).first()
    if not event or event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(Registration).filter_by(event_id=event_id).all()


@router.put("/registrations/{registration_id}", response_model=RegistrationOut)
def update_registration_status(
    registration_id: UUID,
    payload: RegistrationUpdate,
    db: db_dependency,
    current_user: current_user_dependency,
):
    reg = db.query(Registration).filter_by(id=registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    event = db.query(Event).filter_by(id=reg.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

   
    if payload.status in [Status.ACCEPTED, Status.REJECTED]:
        if event.organizer_id != current_user.id:
            raise HTTPException(
                status_code=403, detail="Not authorized to accept/reject"
            )

    elif payload.status == Status.CANCELLED:
        if reg.status == Status.REJECTED:
            raise HTTPException(status_code=403, detail="Cannot cancel after rejection")

    else:
        raise HTTPException(status_code=400, detail="Invalid status update")

    reg.status = payload.status
    db.commit()
    db.refresh(reg)
    return reg


@router.delete("/registrations/{registration_id}")
def cancel_registration(registration_id: UUID, db: db_dependency):
    reg = db.query(Registration).filter_by(id=registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")

    if reg.status == Status.REJECTED:
        raise HTTPException(
            status_code=403, detail="Cannot cancel a rejected registration"
        )

    reg.status = Status.CANCELLED
    db.commit()
    return {"detail": "Registration cancelled"}
