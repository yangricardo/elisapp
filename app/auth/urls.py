from django.urls import path, include
from rest_framework import routers
from .api import RegisterAPI, LoginAPI, UserAPI
from knox import views as knox_views, urls as knox_urls


urlpatterns = [
  path('register/', RegisterAPI.as_view()),
  path('login/', LoginAPI.as_view()),
  path('user/', UserAPI.as_view()),
  path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
]
