cd ./frontend

ng build --configuration production --base-href /frontend/

cd ..

rm -rf ./backend/static/*

mv ./frontend/dist/frontend/browser/* ./backend/static/