sudo apt-get update
sudo apt-get upgrade

### Docker ###
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# User to docker group
sudo usermod -aG docker tom
# hmm silti sudo .. docker compose..

# To install the latest version, run:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify that the Docker Engine installation is successful by running the hello-world image
sudo docker run hello-world

### Git ###
sudo apt install git-all
# SSH-avain github
ssh-keygen -t ed25519 -C "niilo.rinne@hotmail.com"
copy
cat ~/.ssh/id_ed25519.pub

git config --global user.name "RasPi"
git config --global user.email "niilo.rinne@hotmail.com"
git clone git@github.com:Lomen-Git/GymLog

# DuckDNS
linux cron...