# Simulateur Crypto S'investir

Démo fonctionnelle d'un simulateur crypto autonome, construite dans l'esprit de la suite de simulateurs S'investir. L'application permet d'estimer l'évolution potentielle d'un investissement crypto avec investissement initial, DCA mensuel, durée, rendement annuel estimé et frais simples.

## Stack utilisée

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

Note locale : la `.npmrc` du projet pointe vers `https://registry.yarnpkg.com/`, car certains environnements Windows bloquent l'accès SSL à `registry.npmjs.org`. Les commandes restent des commandes npm classiques.

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

## Déploiement

Le projet est compatible Vercel sans configuration spécifique.

## Choix techniques

- Next.js est cohérent avec la stack cible S'investir.
- TypeScript apporte un typage clair des entrées, résultats et points de projection.
- Tailwind permet une UI rapide à adapter avec de futurs design tokens.
- La logique de calcul est isolée dans `src/lib/crypto-simulation.ts` pour faciliter les tests et la réutilisation.
- La page `/embed` montre comment intégrer le simulateur dans un format plus compact.
- Aucun appel API externe n'est utilisé : la démo reste autonome et déployable simplement.
- Aucun package de chart n'a été ajouté : le graphique est un SVG React léger et suffisant pour cette démo.

## Hypothèses de calcul

- Rendement annuel estimé composé mensuellement.
- Versements mensuels ajoutés au début de chaque mois de projection.
- Les frais d'entrée s'appliquent à l'investissement initial et aux versements mensuels.
- Les frais annuels sont convertis en taux mensuel composé et déduits chaque mois.
- Pas de données crypto live.
- Les résultats sont indicatifs et ne constituent pas un conseil financier.

## Limites

- Le design devra être ajusté avec les design tokens exacts ou des captures validées de S'investir.
- Pas de connexion à une API de prix crypto.
- Pas de sauvegarde de simulation.
- Les frais restent volontairement simplifiés pour garder le modèle compréhensible.

## Suggestions d'amélioration pour S'investir

- Harmoniser les simulateurs autour d'un design system commun.
- Ajouter un mode embed standardisé pour les articles et landing pages.
- Proposer un export PDF ou un lien de partage de simulation.
- Centraliser les hypothèses de calcul pour faciliter la maintenance.
- Ajouter un tracking des conversions et des interactions clés.
- Connecter certains simulateurs à HubSpot ou Google Sheets pour qualifier les leads.

## Vérification

```bash
npm test
npm run build
```

Capture de la page principale : `docs/screenshot-home.png`.

Cas couverts par les tests unitaires :

- rendement nul sans frais ;
- versement mensuel nul ;
- investissement initial nul ;
- durée minimale ;
- frais nuls et frais non nuls ;
- investissement initial seul ;
- DCA seul ;
- investissement initial + DCA ;
- durée courte et durée longue ;
- capital investi correctement calculé.

Checklist manuelle recommandée :

- valeurs par défaut ;
- investissement initial seul ;
- DCA mensuel seul ;
- investissement initial + DCA ;
- rendement à 0 % ;
- durée courte et durée longue ;
- frais à 0 et frais supérieurs à 0 ;
- responsive mobile 375 px, tablette et desktop ;
- absence de débordement horizontal ;
- lisibilité des champs, résultats et graphique.