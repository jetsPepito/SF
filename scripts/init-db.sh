#!/bin/sh
set -e

echo "⏳ Attente de la base de données..."
until npx prisma db push --skip-generate > /dev/null 2>&1; do
  echo "⏳ Base de données non prête, nouvelle tentative dans 2 secondes..."
  sleep 2
done

echo "✅ Base de données prête !"
exec "$@"
