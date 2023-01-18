FROM python:3.10.4

RUN apt-get update -y && \
    apt-get install -y xvfb libfontconfig

RUN /usr/local/bin/python -m pip install --upgrade pip
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . /app

EXPOSE 5000
CMD ["python", "main.py"]
