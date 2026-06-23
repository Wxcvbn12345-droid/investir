# Simulateur Crypto S'investir

Démo fonctionnelle d'un simulateur crypto autonome, construite dans l'esprit de la suite de simulateurs S'investir. L'application permet d'estimer l'évolution potentielle d'un investissement crypto avec investissement initial, DCA, période de simulation, fréquence d'investissement, rendement annualisé et frais simples.

## Liens

- Démo : [https://investir-six.vercel.app](https://investir-six.vercel.app)
- Version embed : [https://investir-six.vercel.app/embed](https://investir-six.vercel.app/embed)
- Dépôt GitHub : [https://github.com/Wxcvbn12345-droid/investir](https://github.com/Wxcvbn12345-droid/investir)

## Stack utilisée

- Next.js avec App Router
- TypeScript
- Tailwind CSS
- React
- Node test runner natif pour les tests unitaires de calcul

## Fonctionnalités

- **Stratégie d'investissement** : investissement initial seul, DCA seul, ou initial + DCA
- **Période de simulation** : date de début et date de fin avec durée calculée automatiquement
- **Fréquence d'investissement** : mensuelle, hebdomadaire ou quotidienne
- Sélection parmi 4 cryptos (Bitcoin, Ethereum, Solana, personnalisée)
- Rendement annuel estimé composé selon la fréquence sélectionnée
- Frais d'entrée et frais annuels
- Graphique de projection SVG interactif
- Résultats formatés en euros
- Page complète et page `/embed` compacte
- Disclaimer pédagogique

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

## Intégration / Embedding

Le simulateur est exposé via deux modes :

- `/` : page complète de démonstration
- `/embed` : version compacte pensée pour une intégration dans une page éditoriale ou un outil existant

Le composant principal `<CryptoSimulator />` peut être réutilisé dans une autre application Next.js ou React. La logique de calcul est isolée dans `src/lib/crypto-simulation.ts`.

Dans une intégration réelle, la page `/embed` pourrait être affichée via iframe ou le composant pourrait être importé directement dans la suite de simulateurs.

## Choix techniques

- Next.js est cohérent avec la stack cible S'investir.
- TypeScript apporte un typage clair des entrées, résultats et points de projection.
- Tailwind permet une UI rapide à adapter avec de futurs design tokens.
- La logique de calcul est isolée dans `src/lib/crypto-simulation.ts` pour faciliter les tests et la réutilisation.
- La page `/embed` montre comment intégrer le simulateur dans un format plus compact.
- Aucun appel API externe n'est utilisé : la démo reste autonome et déployable simplement.
- Aucun package de chart n'a été ajouté : le graphique est un SVG React léger et suffisant pour cette démo.
- La gestion des dates est isolée dans `src/lib/date-utils.ts`.

## Hypothèses de calcul

- Rendement annuel estimé composé selon la fréquence sélectionnée.
- Versements périodiques ajoutés au début de chaque période de projection.
- Les frais d'entrée s'appliquent à l'investissement initial et aux versements périodiques.
- Les frais annuels sont convertis en taux périodique selon la fréquence sélectionnée.
- La durée est calculée automatiquement à partir des dates de début et de fin.
- Pas de données crypto live.
- Les résultats sont indicatifs et ne constituent pas un conseil financier.

## Limites

Cette version privilégie une simulation autonome et stable, sans dépendance à une API externe. Une version production pourrait connecter une source de données historiques crypto afin de reproduire un backtest réel sur dates de début/fin, comme le simulateur actuel de S'investir.

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

- rendement nul sans frais
- versement périodique nul
- investissement initial nul
- durée minimale
- frais nuls et frais non nuls
- investissement initial seul
- DCA seul
- investissement initial + DCA
- durée courte et durée longue
- capital investi correctement calculé
- **stratégie initial-only explicite**
- **stratégie dca-only explicite**
- **stratégie initial + DCA explicite**
- **fréquence mensuelle, hebdomadaire, quotidienne**
- **date de début / date de fin**
- **date de fin avant date de début normalisée**
- **période très courte et période longue**
- **frais d'entrée avec DCA**
- **labels de stratégie et fréquence**

Checklist manuelle recommandée :

- valeurs par défaut
- investissement initial seul
- DCA avec fréquence mensuelle
- investissement initial + DCA
- rendement à 0 %
- durée courte et durée longue
- frais à 0 et frais supérieurs à 0
- responsive mobile 375 px, tablette et desktop
- absence de débordement horizontal
- lisibilité des champs, résultats et graphique