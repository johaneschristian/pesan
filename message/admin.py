from django.contrib import admin
from .models import LastMessage, Message, FriendHolder

# Register your models here.
admin.site.register(Message)
admin.site.register(FriendHolder)
admin.site.register(LastMessage)