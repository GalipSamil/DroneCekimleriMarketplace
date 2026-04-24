FROM postgres:15

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-15-postgis-3 \
        postgresql-15-postgis-3-scripts \
    && rm -rf /var/lib/apt/lists/*

COPY infra/docker/postgres/init-postgis.sql /docker-entrypoint-initdb.d/01-init-postgis.sql

