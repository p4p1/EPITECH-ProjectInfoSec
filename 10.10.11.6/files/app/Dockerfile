FROM node:15.8-buster

WORKDIR /app

RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list

RUN apt-get -y update && apt-get -y install wireguard-tools sqlite3 netcat curl wget python3

COPY wg-quick.patch wg-quick.patch

RUN patch --verbose -d/ -p0 < wg-quick.patch

COPY eth1.conf /etc/wireguard/eth1.conf

COPY . .

WORKDIR /app/server

RUN npm ci

WORKDIR /app

CMD ["./run_docker.sh"]
