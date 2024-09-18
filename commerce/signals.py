from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import LedgerDeposit
from .serializers import LedgerDepositSerialzier

@receiver(post_save, sender=LedgerDeposit)
def send_notification_to_ui(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        # Serialize the newly created LedgerDeposit instance
        serialized_data = LedgerDepositSerialzier(instance).data
        # Assuming you have a channel group named 'finance_updates'
        async_to_sync(channel_layer.group_send)(
            'finance_updates',  # Channel group name
            {
                'type': 'send_notification',
                'data': serialized_data  # Send serialized data to UI
            }
        )
