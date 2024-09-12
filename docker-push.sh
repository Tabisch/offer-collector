echo "Enter version tag"
read version

docker login

docker push tabisch/offer-collector:latest
docker push tabisch/offer-collector:$version