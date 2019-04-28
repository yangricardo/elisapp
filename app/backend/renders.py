from rest_framework import renderers

class Latin1JSONRender(renderers.JSONRenderer):
    charset = 'latin1'