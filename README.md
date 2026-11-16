# Sommative 2 - Vidéothèque

Projet individuel du cours IFM29990 : Introduction à la programmation de serveurs Web.

## Sujet choisi

**Sujet A : Vidéothèque.** Une application web pour garder la liste des films que l'on veut voir ou que l'on a vus.

L'application permet, sur une seule page, de :

- afficher tous les films de la base de données;
- ajouter un film avec un formulaire;
- marquer un film comme vu ou pas vu;
- supprimer un film.

## Comment lancer le projet

1. Ouvrir un terminal dans le dossier du projet.
2. Installer les dépendances :

   ```
   npm i
   ```

3. Démarrer le serveur :

   ```
   npm run dev
   ```

4. Ouvrir le navigateur à l'adresse http://localhost:5000

La base de données (`db/videotheque.db`) est créée automatiquement au premier démarrage du serveur, avec 3 films de départ.

## Configuration

Le fichier `.env` contient :

- `PORT` : le port du serveur (5000);
- `DB_FILE` : le chemin du fichier de base de données (`./db/videotheque.db`).

## Routes

| Méthode | Route       | Description                         | Code de statut |
|---------|-------------|-------------------------------------|----------------|
| GET     | `/`         | Affiche la page avec tous les films | 200            |
| POST    | `/api/film` | Ajoute un film                      | 201            |
| PATCH   | `/api/film` | Marque un film comme vu ou pas vu   | 200            |
| DELETE  | `/api/film` | Supprime un film                    | 200            |

Les données sont envoyées en JSON dans le corps de la requête. Si une donnée est invalide, le serveur répond avec le code 400.

## Structure du projet

- `server.js` : le serveur Express et ses routes;
- `db/db.js` : la connexion à la base de données et la création de la table;
- `model/film.js` : les requêtes SQL;
- `middlewares/validation.js` : les middlewares de validation du serveur;
- `views/` : les vues Handlebars (layout, page d'accueil et partials);
- `public/js/main.js` : le code client (fetch);
- `public/js/validation.js` : les fonctions de validation réutilisables;
- `public/css/global.css` : les styles communs à toutes les pages;
- `public/css/home.css` : les styles spécifiques à la page d'accueil.
