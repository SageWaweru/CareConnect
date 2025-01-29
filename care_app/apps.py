from django.apps import AppConfig
from django.contrib.auth import get_user_model
from decouple import config

class CareAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'care_app'


