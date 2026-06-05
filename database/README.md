# Base de donnees

La base choisie pour le backend est MySQL/MariaDB via XAMPP.

## Connexion locale

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_presence
DB_USERNAME=root
DB_PASSWORD=
```

## Creation de la base

Avec XAMPP sous Windows :

```powershell
& 'C:\xampp\mysql\bin\mysql.exe' -u root -e "CREATE DATABASE IF NOT EXISTS gestion_presence CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## Migration Laravel

Depuis le dossier `backend` :

```bash
php artisan migrate --seed
```

## Comptes de test

```text
admin@test.com   / password
prof@test.com    / password
parent@test.com  / password
eleve@test.com   / password
```
