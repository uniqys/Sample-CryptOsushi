FROM cryptosushi:frontend AS frontend

FROM python:3.7

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY src/dao.py /app/src/dao.py
COPY src/decorator.py /app/src/decorator.py
COPY src/gari.py /app/src/gari.py
COPY src/main.py /app/src/main.py
COPY src/sushi.py /app/src/sushi.py
COPY src/util.py /app/src/util.py

COPY --from=frontend /app/dist /static

EXPOSE 56080

CMD python src/main.py