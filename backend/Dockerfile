FROM python:3.8
RUN apt-get update -y
RUN apt-get install -y xvfb
RUN apt-get install -y libfontconfig
RUN wget https://s3.amazonaws.com/shopify-managemant-app/wkhtmltopdf-0.9.9-static-amd64.tar.bz2
RUN tar xvjf wkhtmltopdf-0.9.9-static-amd64.tar.bz2
RUN mv wkhtmltopdf-amd64 /usr/local/bin/wkhtmltopdf
RUN chmod +x /usr/local/bin/wkhtmltopdf
RUN pip install --upgrade pip
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "server.py"]
