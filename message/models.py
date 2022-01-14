from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields import related

class Message(models.Model):
    message_id = models.BigAutoField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_received")

    def save(self, *args, **kwargs):
        super().save()

        if LastMessage.objects.filter(pivot_account=self.sender, corresponding_account = self.receiver):
            lastMessage1 = LastMessage.objects.get(pivot_account=self.sender, corresponding_account = self.receiver)
            lastMessage1.timestamp = self.timestamp
            lastMessage1.content = self.content
                
            lastMessage1.save()

            lastMessage2 = LastMessage.objects.get(pivot_account=self.receiver,corresponding_account = self.sender)
            lastMessage2.timestamp = self.timestamp
            lastMessage2.content = self.content
                
            lastMessage2.save()
        else:
            LastMessage.objects.create(
                pivot_account=self.sender,
                corresponding_account = self.receiver,
                timestamp = self.timestamp,
                content = self.content,
            )

            LastMessage.objects.create(
                pivot_account=self.receiver,
                corresponding_account=self.sender,
                timestamp = self.timestamp,
                content = self.content,
            )
        

class FriendHolder(models.Model):
    owning_user = models.OneToOneField(User, primary_key=True,on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', symmetrical=True, null=True)

class LastMessage(models.Model):
    pivot_account = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pivot_messages")
    corresponding_account = models.ForeignKey(User, on_delete=models.CASCADE, related_name='corresponding_lasts')
    timestamp = models.DateTimeField()
    content = models.TextField()

    class Meta:
        unique_together = ('pivot_account', 'corresponding_account')

    


