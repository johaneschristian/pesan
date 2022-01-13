from django.urls import path

from . import views

app_name = 'message'

urlpatterns = [
    path('', views.home, name='home'),
    path('logout/', views.logout_mechanism, name='logout'),
    path('register/', views.register_user, name='register_user'),
    path('chat/', views.chat_window, name='chat_window'),
    path('get-latest-chat/', views.get_latest_chats, name='get_latest_chat'),
    path('get-user-friends/', views.get_user_friends, name='get_user_friends'),
    path('get-messages/', views.get_messages, name='get_messages'),
    path('add-message/', views.add_messages, name='add_message'),
]
