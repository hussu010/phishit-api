sudo apt update && sudo apt upgrade -y
curl -s https://deb.nodesource.com/setup_18.x | sudo bash
sudo apt install nodejs nginx ufw software-properties-common certbot python3-certbot-nginx -y
sudo ufw enable
sudo ufw status
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
