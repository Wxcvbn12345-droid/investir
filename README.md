# Simulateur Crypto S'investir

Demo fonctionnelle d'un simulateur crypto autonome, construite dans l'esprit de la suite de simulateurs S'investir. L'application permet d'estimer l'evolution potentielle d'un investissement crypto avec investissement initial, DCA mensuel, duree, rendement annuel estime et frais simples.

## Stack utilisee

- Next.js avec App Router
- TypeScript
- Tailwind CSS
- React
- Node test runner natif pour les tests unitaires de calcul

## Installation locale

```bash
npm install
npm run dev
```

Page principale : `http://localhost:3000`

Page embarquable : `http://localhost:3000/embed`

Note locale : la `.npmrc` du projet pointe vers `https://registry.yarnpkg.com/`, car certains environnements Windows bloquent l'acces SSL a `registry.npmjs.org`. Les commandes restent des commandes npm classiques.

## Commandes utiles

```bash
npm install
npm run dev
npm run build
npm test
```

## Build

```bash
npm run build
```

## Deploiement

Le projet est compatible Vercel sans configuration specifique.

## Choix techniques

- Next.js est coherent avec la stack cible S'investir.
- TypeScript apporte un typage clair des entrees, resultats et points de projection.
- Tailwind permet une UI rapide a adapter avec de futurs design tokens.
- La logique de calcul est isolee dans `src/lib/crypto-simulation.ts` pour faciliter les tests et la reutilisation.
- La page `/embed` montre comment integrer le simulateur dans un format plus compact.
- Aucun appel API externe n'est utilise : la demo reste autonome et deployable simplement.
- Aucun package de chart n'a ete ajoute : le graphique est un SVG React leger et suffisant pour cette demo.

## Hypotheses de calcul

- Rendement annuel estime compose mensuellement.
- Versements mensuels ajoutes au debut de chaque mois de projection.
- Les frais d'entree s'appliquent a l'investissement initial et aux versements mensuels.
- Les frais annuels sont convertis en taux mensuel compose et deduits chaque mois.
- Pas de donnees crypto live.
- Les resultats sont indicatifs et ne constituent pas un conseil financier.

## Limites

- Le design devra etre ajuste avec les design tokens exacts ou des captures validees de S'investir.
- Pas de connexion a une API de prix crypto.
- Pas de sauvegarde de simulation.
- Les frais restent volontairement simplifies pour garder le modele comprehensible.

## Suggestions d'amelioration pour S'investir

- Harmoniser les simulateurs autour d'un design system commun.
- Ajouter un mode embed standardise pour les articles et landing pages.
- Proposer un export PDF ou un lien de partage de simulation.
- Centraliser les hypotheses de calcul pour faciliter la maintenance.
- Ajouter un tracking des conversions et des interactions cles.
- Connecter certains simulateurs a HubSpot ou Google Sheets pour qualifier les leads.

## Verification

```bash
npm test
npm run build
```

Capture de la page principale : `docs/screenshot-home.png`.

Cas couverts par les tests unitaires :

- rendement nul sans frais ;
- versement mensuel nul ;
- investissement initial nul ;
- duree minimale ;
- frais nuls et frais non nuls ;
- investissement initial seul ;
- DCA seul ;
- investissement initial + DCA ;
- duree courte et duree longue ;
- capital investi correctement calcule.

Checklist manuelle recommandee :

- valeurs par defaut ;
- investissement initial seul ;
- DCA mensuel seul ;
- investissement initial + DCA ;
- rendement a 0 % ;
- duree courte et duree longue ;
- frais a 0 et frais superieurs a 0 ;
- responsive mobile 375 px, tablette et desktop ;
- absence de debordement horizontal ;
- lisibilite des champs, resultats et graphique.
