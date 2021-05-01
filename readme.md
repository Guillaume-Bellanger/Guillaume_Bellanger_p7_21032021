Formation Développeur Web OPENCLASSROOMS
Groupomania
Projet n°7 : Création d'un réseau social d'entreprise

Comment démarrer le projet ?
Clonez le dépôt

Lancer XAMPP, MAMP ou WAMP ainsi que leurs serveurs Apache et Mysql

Placez vous respectivement dans les dossiers backend et frontend et lancez la commande npm install dans le terminal

Vérifiez les informations contenu dans le fichier backend/config/config.json ainsi que backend/config/database.js

Placé dans le dossier backend, lancez à la suite les commandes :

npx sequelize-cli db:create

npx sequelize-cli db:migrate

npx sequelize-cli db:seed:all

Créez à la racine du dossier backend/ un ficher .env avec comme contenu :

 TOKEN=votre_token
 
Ouvrez un 1er terminal et placez vous dans le dossier backend/. Lancez la commande npm start

Ouvrez un 2eme terminal et placez vous dans le dossier frontend/. Lancez la commande npm run serve

Ouvez votre navigateur et allez à l'adresse http://localhost:8080

le compte admin est disponible :

admin@test.fr

Le mot de passe est : Azerty123

Enjoy :=)
