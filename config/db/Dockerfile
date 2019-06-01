FROM postgres

ENV POSTGRES_USER=elisdbadmin
ENV POSTGRES_PASSWORD=elisdbpassword
ENV POSTGRES_DB=elisdb
ENV PGDATA=/data

COPY ./elisdb.sql /docker-entrypoint-initdb.d/
RUN chmod a+r /docker-entrypoint-initdb.d/*