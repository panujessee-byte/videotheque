import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { existsSync } from 'node:fs';

// Vérifie si le fichier de base de données est
// nouveau (n'existe pas encore)
const IS_NEW = !existsSync(process.env.DB_FILE);

// Connexion à la base de données. Vous devez
// spécifier le nom du fichier de base de données
// dans le fichier .env
let db = await open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Création de la table si elle n'existe pas, on
// peut écrire du code SQL pour initialiser les
// tables et données dans la fonction exec()
if(IS_NEW) {
    await db.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE film(
            id_film INTEGER PRIMARY KEY,
            titre TEXT NOT NULL,
            genre TEXT NOT NULL,
            annee INTEGER NOT NULL,
            note INTEGER NOT NULL,
            est_vu INTEGER NOT NULL
        );

        INSERT INTO film(titre, genre, annee, note, est_vu) VALUES
            ('Intouchables', 'Comédie', 2011, 5, 1),
            ('Inception', 'Science-fiction', 2010, 4, 0),
            ('Parasite', 'Thriller', 2019, 5, 0);
    `);
}



export { db }
