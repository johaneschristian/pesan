from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import FriendHolder, Message
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

import datetime
import json

def home(request):
    if request.user.is_authenticated:
        return redirect('main:chat_window')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Get corresponding username from email
        corresponding_users = User.objects.filter(email=email)

        if corresponding_users:
            user = authenticate(username=corresponding_users[0].username, password=password)
            if user:
                login(request, user)
                print(user.id)
                return redirect('main:chat_window')

    return render(request, 'main/landing_page.html')

@login_required
def logout_mechanism(request):
    logout(request)

    return redirect('main:home')

def register_user(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        full_name = request.POST.get('full_name')
        password = request.POST.get('password')

        # Some Validation (NOT IMPLEMENTED YET)

        # Instantiate user if valid
        new_user = User(
                        email=email,
                        username=username,
                        first_name=full_name,
                    )
        new_user.set_password(password)
        new_user.save()

        # Create new_user friendholder
        FriendHolder.objects.create(owning_user=new_user)

        login(request, new_user)

        return redirect('main:chat_window')
    
    return render(request, 'main/registration_form.html')


@login_required
def chat_window(request):
    user_account_id = request.user.id
    context = {
        'user_account_id':user_account_id,
    }

    return render(request, 'main/chat_window.html', context)

# Functions to return json
@login_required
def get_latest_chats(request):
    latest_chats = request.user.pivot_messages.all().order_by('-timestamp')

    data = []
    for chat in latest_chats:
        temp_dictionary = {
            "pk": chat.id,
            "fields": {
                "pivot_account": chat.pivot_account.id,
                "corresponding_account_id": chat.corresponding_account.id,
                "corresponding_account_name": chat.corresponding_account.first_name,
                "timestamp": datetime.datetime.strftime(chat.timestamp, '%H:%M') \
                    if chat.timestamp.date() == datetime.datetime.today().date() else 
                        str(chat.timestamp.date()),
                "content": chat.content,
            }
        }

        data.append(temp_dictionary)

    return JsonResponse(data, safe=False)

@login_required
def get_user_friends(request):
    user_friends_holder = request.user.friendholder.friends.all()

    data = []

    for friend_holder in user_friends_holder:
        temp_dictio = {
            "user_id": friend_holder.owning_user_id,
            "email": friend_holder.owning_user.email,
            "profile_name": friend_holder.owning_user.first_name,
        }

        data.append(temp_dictio)
    
    return JsonResponse(data, safe=False)

@login_required
def get_messages(request):
    if request.method == 'GET':
        corresponding_id = request.GET.get('corresponding-id')

        if corresponding_id != 'undefined':

            related_messages = (
                    Message.objects.filter(sender_id=request.user.id, receiver_id=corresponding_id) | 
                    Message.objects.filter(sender_id=corresponding_id, receiver_id=request.user.id)
                ).order_by('timestamp')
            
            data = serializers.serialize('json', related_messages)
        else:
            data = {}

        return HttpResponse(data, content_type='json')

@csrf_exempt
@login_required
def add_messages(request):
    if request.method == 'POST':
        Message.objects.create(
            sender=request.user,
            receiver=User.objects.get(id=request.POST.get('corresponding-id')),
            content=request.POST.get('content'),
        )
    
        return JsonResponse({'successful':True}, safe=False)


        

    
