# Migration Instructions for User Profile Fields

## Problem
The registration is failing because the database doesn't have the new columns yet. You need to run the migration.

## Solution

### If using Laravel Sail:

```bash
./vendor/bin/sail artisan migrate
```

### If using docker-compose:

```bash
docker-compose exec app php artisan migrate
```

### If running locally (without Docker):

```bash
php artisan migrate
```

## What the Migration Does

The migration `2026_01_25_175157_add_user_profile_fields_to_users_table.php` adds the following columns to the `users` table:

- `first_name` (string, nullable)
- `last_name` (string, nullable)
- `date_of_birth` (date, nullable)
- `country_id` (foreign key to countries table, nullable)

## Verify Migration Ran Successfully

After running the migration, you can verify it worked by checking:

```bash
# With Sail
./vendor/bin/sail artisan migrate:status

# Or check the database directly
./vendor/bin/sail mysql
# Then in MySQL:
# DESCRIBE users;
```

## After Migration

Once the migration is complete, the registration endpoint should work correctly with all the new fields:
- first_name
- last_name
- email
- password
- password_confirmation
- date_of_birth
- country_id
