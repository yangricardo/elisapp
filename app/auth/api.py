from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_out

from knox.models import AuthToken, AuthTokenManager
from rest_framework import (authentication, generics, mixins, permissions,
                            status, viewsets)
from rest_framework.response import Response

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

# Create your views here.



class RegisterViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token[1]
        })



class LoginViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated(request.data)
        token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token[1]
        })



class UserViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LogoutViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, format=None):
        request._auth.delete()
        user_logged_out.send(sender=request.user.__class__,
                             request=request, user=request.user)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class LogoutAllViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    '''
    Log the user out of all sessions
    I.E. deletes all auth tokens for the user
    '''
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, format=None):
        request.user.auth_token_set.all().delete()
        user_logged_out.send(sender=request.user.__class__,
                             request=request, user=request.user)
        return Response(None, status=status.HTTP_204_NO_CONTENT)
