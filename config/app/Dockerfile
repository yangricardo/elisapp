# Creating image based on official python3 image
FROM nikolaik/python-nodejs:python3.7-nodejs11

# Sets dumping log messages directly to stream instead of buffering
ENV PYTHONUNBUFFERED 1

# Creating and putting configurations
RUN mkdir -p /srv/{static,media}
RUN mkdir /config
ADD config/app /config/

# Installing all python dependencies
RUN pip install -r /config/requirements.txt

# Open port 8000 to outside world
EXPOSE 8000

# Creating and putting application inside container
# and setting it to working directory (meaning it is going to be default)
RUN mkdir /app
WORKDIR /app
ADD app /app/
RUN npm i
RUN npm run dev
RUN python manage.py collectstatic