from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
import logging
import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

logger = logging.getLogger("Celery")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = Celery("backend")
app.config_from_object('django.conf:settings', namespace="CELERY")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@app.task(bind=True)
def cache_pages(self, processos_similares, token):
	processos_similares = json.loads(processos_similares)
	with ThreadPoolExecutor(max_workers=9) as executor:
		future_request = {executor.submit(
        	requests.get, processo['id'], headers={
            'Authorization': f'token {token}',
            'charset': 'utf-8'
        }): processo for processo in processos_similares}

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))