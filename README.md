# Suivi des patientes – Application Sage-Femme

Application web simple pour suivre quotidiennement le nombre de patientes vues et absentes, avec des statistiques détaillées.

## 🚀 Lancer le projet

### Option 1 : Avec Docker (recommandé - le plus simple)

Cette option lance automatiquement la base de données PostgreSQL et l'application.

#### Prérequis
- [Docker](https://www.docker.com/get-started) et Docker Compose installés

#### Commandes

**Pour le développement (avec hot-reload) :**
```bash
cd sagefemme-app
docker compose -f docker-compose.dev.yml up --build
```

**Pour la production :**
```bash
cd sagefemme-app
docker compose up --build
```

L'application sera accessible sur **http://localhost:3000**

La base de données PostgreSQL sera accessible sur le port **5432** avec :
- User: `sagefemme`
- Password: `sagefemme`
- Database: `sagefemme`

**Arrêter les conteneurs :**
```bash
docker compose -f docker-compose.dev.yml down
# ou pour la production
docker compose down
```

---

### Option 2 : Sans Docker (développement local)

#### Prérequis
- Node.js **≥ 20.9** (recommandé : Node 22)
- PostgreSQL installé et démarré localement

#### Étapes

1. **Installer les dépendances :**
```bash
cd sagefemme-app
npm install
```

2. **Configurer la base de données :**

Créer un fichier `.env.local` à la racine du projet :
```env
DATABASE_URL=postgres://sagefemme:sagefemme@localhost:5432/sagefemme
```

3. **Créer la base de données PostgreSQL :**
```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer l'utilisateur et la base
CREATE USER sagefemme WITH PASSWORD 'sagefemme';
CREATE DATABASE sagefemme OWNER sagefemme;
GRANT ALL PRIVILEGES ON DATABASE sagefemme TO sagefemme;
\q
```

4. **Générer le client Prisma et créer les tables :**
```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push
```

5. **Lancer l'application :**
```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

> **Note :** Avec Prisma, les tables sont créées via `npm run db:push` (ou `npm run db:migrate` pour des migrations versionnées).

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Page principale
│   └── api/daily/route.ts    # API pour les données (utilise Prisma)
├── components/               # Composants React
│   ├── DailyForm.tsx
│   ├── SummaryPanel.tsx
│   ├── TrendChart.tsx
│   └── DailyAndWeeklyTables.tsx
├── lib/
│   ├── types.ts              # Types TypeScript
│   ├── utils.ts              # Fonctions utilitaires
│   └── prisma.ts             # Client Prisma (singleton)
└── prisma/
    └── schema.prisma          # Schéma de la base de données
```

## 🛠️ Scripts disponibles

- `npm run dev` - Lancer en mode développement
- `npm run build` - Build pour la production (génère aussi le client Prisma)
- `npm run start` - Lancer en mode production
- `npm run lint` - Vérifier le code avec ESLint
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Synchroniser le schéma avec la base (développement)
- `npm run db:migrate` - Créer une migration versionnée
- `npm run db:studio` - Ouvrir Prisma Studio (interface graphique pour la DB)

## 📊 Fonctionnalités

- ✅ Saisie quotidienne du nombre de patientes vues / absentes
- ✅ Statistiques jour par jour et semaine par semaine
- ✅ Taux de présence / no-show
- ✅ Moyennes quotidiennes
- ✅ Graphique de tendance (moyenne glissante 7 jours)
- ✅ Interface simple et intuitive

## 🚢 Déploiement

### Sur Vercel (recommandé)

1. Pousser le code sur GitHub
2. Aller sur [Vercel](https://vercel.com) et importer le projet
3. Ajouter une base de données Postgres via Vercel (Storage > Databases)
4. Vercel configurera automatiquement la variable `DATABASE_URL`
5. **Important :** Ajouter un script de build dans les settings Vercel :
   - Build Command: `npm run build` (qui inclut `prisma generate`)
   - Ou ajouter un script postinstall dans `package.json` :
     ```json
     "postinstall": "prisma generate"
     ```
6. Cliquer sur "Deploy"

**Après le déploiement**, exécuter la migration :
```bash
# Via le terminal Vercel ou en local avec la DATABASE_URL de production
npx prisma db push
# ou pour des migrations versionnées
npx prisma migrate deploy
```

---

## 💡 Astuce

Si vous vous trompez en saisissant une journée, il suffit de ressaisir la même date avec les bons chiffres. La journée sera automatiquement mise à jour.
