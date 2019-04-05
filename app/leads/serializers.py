from rest_framework import serializers
from .models import Lead
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'