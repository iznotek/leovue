# update ubuntu 16.04 for docker 17.06.2

docker version &&
sudo apt-get remove docker docker-engine docker.io &&
sudo apt-get update &&
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common &&
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - &&
sudo apt-key fingerprint 0EBFCD88 &&
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" &&
sudo apt-get update &&
apt-cache madison docker-ce &&
sudo apt-get install docker-ce=17.06.2~ce-0~ubuntu &&
docker version &&
docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover

# read-only error
# dmesg | grep "error"
# fsck.ext4 -f /dev/sda1