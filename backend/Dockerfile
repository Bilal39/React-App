FROM python:3.10.4

RUN apt-get update -y && \
    apt-get install -y xvfb libfontconfig

RUN wget https://s3.amazonaws.com/shopify-managemant-app/wkhtmltopdf-0.9.9-static-amd64.tar.bz2 && \
    tar xvjf wkhtmltopdf-0.9.9-static-amd64.tar.bz2 && \
    mv wkhtmltopdf-amd64 /usr/local/bin/wkhtmltopdf && \
    chmod +x /usr/local/bin/wkhtmltopdf

RUN /usr/local/bin/python -m pip install --upgrade pip
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . /app

EXPOSE 5000
CMD ["python", "server.py"]
