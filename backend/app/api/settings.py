from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.settings import UserSettings, UserSettingsUpdate
from app.api.auth import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings"])

# In-memory settings store keyed by user_id for fast retrieval
USER_SETTINGS_STORE = {}


@router.get("", response_model=UserSettings)
async def get_settings(current_user: User = Depends(get_current_user)):
    if current_user.id not in USER_SETTINGS_STORE:
        USER_SETTINGS_STORE[current_user.id] = UserSettings().model_dump()
    return UserSettings(**USER_SETTINGS_STORE[current_user.id])


@router.put("", response_model=UserSettings)
async def update_settings(
    payload: UserSettingsUpdate,
    current_user: User = Depends(get_current_user)
):
    if current_user.id not in USER_SETTINGS_STORE:
        USER_SETTINGS_STORE[current_user.id] = UserSettings().model_dump()

    current_dict = USER_SETTINGS_STORE[current_user.id]
    for key, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            current_dict[key] = val

    USER_SETTINGS_STORE[current_user.id] = current_dict
    return UserSettings(**current_dict)
