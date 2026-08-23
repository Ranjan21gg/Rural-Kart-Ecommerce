FROM python:3.11-slim

WORKDIR /app

# System deps needed for psycopg2 and Pillow
RUN apt-get update && apt-get install -y \
    libpq-dev gcc libjpeg-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY . .

ENV PATH="/app/.venv/bin:$PATH"

RUN chmod +x entrypoint.sh entrypoint-celery.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]