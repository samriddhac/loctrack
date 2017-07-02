Note :-

On react native background :-
If you are using react-native-maps or another lib that requires react-native-maps such as Exponent.js or airbnb's react-native-maps then aditionally to the instalation steps described here, you must also change node_modules/react-native-mauron85-background-geolocation/android/lib/build.gradle in order to gms:play-services-locations match the same version used by those libraries. (in this case 9.8.0)


Server start command :  
sudo forever npm run start:server -o out.log -l loc.log -e error.log
nohup sudo npm run start:server &

Redis installation :-
sudo apt-get update
sudo apt-get install build-essential tcl
cd /tmp
curl -O http://download.redis.io/redis-stable.tar.gz
tar xzvf redis-stable.tar.gz
cd redis-stable
make
make test
sudo make install
sudo mkdir /etc/redis
sudo cp /tmp/redis-stable/redis.conf /etc/redis

vi /etc/redis/redis.conf

supervised systemd

dir /var/lib/redis


vi /etc/systemd/system/redis.service
[Unit]
Description=Redis In-Memory Data Store
After=network.target

[Service]
User=redis
Group=redis
ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf
ExecStop=/usr/local/bin/redis-cli shutdown
Restart=always

[Install]
WantedBy=multi-user.target



sudo adduser --system --group --no-create-home redis
sudo mkdir /var/lib/redis
sudo chown redis:redis /var/lib/redis
sudo chmod 770 /var/lib/redis

start redis :-
sudo systemctl start redis

redis status :-
sudo systemctl status redis

stop redis:-
sudo systemctl stop redis

sudo systemctl restart redis