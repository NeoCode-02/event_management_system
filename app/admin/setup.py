from starlette_admin.contrib.sqla import Admin
from app.admin.auth import JSONAuthProvider
from app.admin.views import UserAdminView, EventAdminView, RegistrationAdminView
from app.models import User, Event, Registration
from app.database.database import engine

admin = Admin(
    engine=engine,
    title="Event Manager Admin",
    base_url="/admin",
    auth_provider=JSONAuthProvider(login_path="/login", logout_path="/logout"),
)

admin.add_view(UserAdminView(User, icon="fa fa-user"))
admin.add_view(EventAdminView(Event, icon="fa fa-calendar"))
admin.add_view(RegistrationAdminView(Registration, icon="fa fa-address-book"))
