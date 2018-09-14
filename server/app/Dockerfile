FROM cryptosushi:frontend AS frontend

FROM python:3.7

EXPOSE 56080

WORKDIR /app

# dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# src
COPY ./src /app/src

# static
COPY --from=frontend /app/dist /static

CMD ["python", "src/main.py"]

