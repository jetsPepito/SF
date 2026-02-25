# 🚀 Guide de déploiement - Mettre l'app en ligne

Ce guide te montre comment déployer l'application sur **Vercel** (gratuit et très simple) pour que ta femme puisse y accéder depuis n'importe où.

## 📋 Prérequis

- Un compte GitHub (gratuit) : https://github.com
- Un compte Vercel (gratuit) : https://vercel.com

---

## 🎯 Étapes de déploiement

### 1. Mettre le code sur GitHub

**Option A : Via l'interface GitHub (le plus simple)**

1. Va sur https://github.com et crée un nouveau repository (bouton "+" en haut à droite)
2. Nomme-le par exemple `sagefemme-app` (ou ce que tu veux)
3. **Ne coche PAS** "Initialize with README" (on a déjà un README)
4. Clique sur "Create repository"

**Option B : Via la ligne de commande**

```bash
cd /Users/louis.legatt/camilleProject/sagefemme-app

# Initialiser git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Créer un premier commit
git commit -m "Initial commit - App sage-femme"

# Ajouter le remote GitHub (remplace TON_USERNAME et TON_REPO par tes infos)
git remote add origin https://github.com/TON_USERNAME/TON_REPO.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

### 2. Créer un compte Vercel et importer le projet

1. Va sur https://vercel.com
2. Clique sur **"Sign Up"** et connecte-toi avec ton compte GitHub
3. Une fois connecté, clique sur **"Add New..."** > **"Project"**
4. Tu verras la liste de tes repos GitHub → sélectionne `sagefemme-app`
5. Vercel détecte automatiquement que c'est un projet Next.js ✅

---

### 3. Configurer la base de données

**Avant de cliquer sur "Deploy", il faut ajouter une base de données :**

1. Dans la page de configuration du projet Vercel, va dans l'onglet **"Storage"** ou **"Databases"**
2. Clique sur **"Create Database"**
3. Choisis **"Postgres"** (ou **"Neon"** qui est le nouveau service recommandé)
4. Sélectionne le plan **"Hobby"** (gratuit, parfait pour commencer)
5. Vercel va créer la base et **ajouter automatiquement** la variable `DATABASE_URL` à ton projet ✅

---

### 4. Configurer le build

Vercel devrait déjà avoir détecté les bonnes configurations, mais vérifie :

- **Framework Preset** : Next.js
- **Build Command** : `npm run build` (déjà configuré automatiquement)
- **Install Command** : `npm install` (déjà configuré)
- **Root Directory** : `./` (par défaut)

Le script `postinstall` dans `package.json` va automatiquement générer le client Prisma, donc pas besoin de configuration supplémentaire.

---

### 5. Déployer !

1. Clique sur **"Deploy"**
2. Attends 2-3 minutes que Vercel build et déploie ton app
3. Une fois terminé, tu auras une URL du type : `https://sagefemme-app.vercel.app` 🎉

---

### 6. Créer les tables dans la base de données

**Après le premier déploiement**, il faut créer les tables Prisma :

**Option A : Via le terminal Vercel (le plus simple)**

1. Dans ton projet Vercel, va dans l'onglet **"Deployments"**
2. Clique sur les **"..."** à côté du dernier déploiement
3. Sélectionne **"Open in Terminal"**
4. Dans le terminal, lance :
   ```bash
   npx prisma db push
   ```
5. C'est fait ! ✅

**Option B : Depuis ta machine locale**

1. Dans ton projet Vercel, va dans **Settings** > **Environment Variables**
2. Copie la valeur de `DATABASE_URL`
3. Sur ta machine, dans le dossier du projet :
   ```bash
   cd /Users/louis.legatt/camilleProject/sagefemme-app
   DATABASE_URL="la_valeur_copiée" npx prisma db push
   ```

---

## ✅ C'est prêt !

Ton app est maintenant accessible en ligne à l'URL fournie par Vercel (ex: `https://sagefemme-app.vercel.app`).

Tu peux :
- Partager cette URL avec ta femme
- L'ajouter en favori sur son téléphone/ordinateur
- L'utiliser depuis n'importe où avec une connexion internet

---

## 🔄 Mettre à jour l'app plus tard

Si tu modifies le code et que tu veux mettre à jour l'app en ligne :

```bash
cd /Users/louis.legatt/camilleProject/sagefemme-app

# Faire tes modifications...

# Commiter et pousser sur GitHub
git add .
git commit -m "Description de tes changements"
git push
```

Vercel va **automatiquement** redéployer l'app dès que tu pushes sur GitHub ! 🚀

---

## 💰 Coûts

- **Vercel Hobby** : Gratuit (parfait pour un usage personnel)
- **Base de données Postgres/Neon** : Gratuit jusqu'à 512 MB (largement suffisant pour commencer)

---

## 🆘 En cas de problème

- **L'app ne se build pas** : Vérifie les logs dans Vercel (onglet "Deployments" > clique sur le déploiement)
- **Erreur de connexion à la DB** : Vérifie que `DATABASE_URL` est bien définie dans Vercel (Settings > Environment Variables)
- **Les tables n'existent pas** : Relance `npx prisma db push` dans le terminal Vercel

---

## 🎁 Bonus : Nom de domaine personnalisé (optionnel)

Si tu veux une URL plus jolie (ex: `sagefemme.tonnom.com`) :

1. Dans Vercel, va dans **Settings** > **Domains**
2. Ajoute ton domaine (si tu en as un)
3. Suis les instructions pour configurer le DNS

C'est optionnel, l'URL Vercel fonctionne très bien aussi !
