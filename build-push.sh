echo "Enter version tag"
read version

docker image rm tabisch/offer-collector:latest
docker image rm tabisch/offer-collector:$version

docker builder prune -f

docker build -t tabisch/offer-collector:$version .
docker tag tabisch/offer-collector:$version tabisch/offer-collector:latest

exit 0

echo "Push to dockerhub? (y|n)"
read push
