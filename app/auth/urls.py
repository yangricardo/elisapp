from django.urls import path, include
from rest_framework import routers
from . import api
from knox import views as knox_views, urls as knox_urls

auth = routers.DefaultRouter(trailing_slash=True)
auth.register('register', api.RegisterViewSet,  basename='Register')
auth.register('login', api.LoginViewSet, basename='Login')
auth.register('user',api.UserViewSet, basename='User')
auth.register('logout', api.LogoutViewSet,  basename='Logout')
auth.register('logoutall', api.LogoutAllViewSet, basename='Logout All')

urlpatterns = [
  path('',include(auth.urls)),
  path('logout', knox_views.LogoutView.as_view(), name='knox_logout'),
  path('', include(knox_urls)),
]
