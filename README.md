# Simulateur Crypto S'investir

Démo fonctionnelle d'un simulateur crypto autonome, construite dans l'esprit de la suite de simulateurs S'investir.

L'application permet d'estimer l'évolution potentielle d'un investissement crypto avec :

- investissement initial ;
- DCA ;
- période de simulation ;
- fréquence d'investissement ;
- rendement annualisé estimé ;
- frais d'entrée et frais annuels.

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

- **Stratégie d'investissement** : investissement initial seul, DCA seul, ou initial + DCA.
- **Période de simulation** : date de début et date de fin avec durée calculée automatiquement.
- **Fréquence d'investissement** : mensuelle, hebdomadaire ou quotidienne.
- Sélection parmi 4 cryptos : Bitcoin, Ethereum, Solana, personnalisée.
- Rendement annuel estimé pré-rempli selon la crypto, puis entièrement modifiable.
- Frais d'entrée et frais annuels.
- Graphique de projection SVG interactif.
- Résultats formatés en euros.
- Page complète et page `/embed` compacte.
- Disclaimer pédagogique.

## Installation locale

```bash
npm install
npm run dev
```

Page principale :

```txt
http://localhost:3000
```

Page embarquable :

```txt
http://localhost:3000/embed
```

Note locale : la `.npmrc` du projet pointe vers `https://registry.yarnpkg.com/`, car certains environnements Windows bloquent l'accès SSL à `registry.npmjs.org`.

Les commandes restent des commandes npm classiques.

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

- `/` : page complète de démonstration ;
- `/embed` : version compacte pensée pour une intégration dans une page éditoriale ou un outil existant.

Le composant principal `<CryptoSimulator />` peut être réutilisé dans une autre application Next.js ou React.

La logique de calcul est isolée dans `src/lib/crypto-simulation.ts`.

Dans une intégration réelle, la page `/embed` pourrait être affichée via iframe ou le composant pourrait être importé directement dans la suite de simulateurs.

## Choix techniques

- Next.js est cohérent avec la stack cible S'investir.
- TypeScript apporte un typage clair des entrées, résultats et points de projection.
- Tailwind permet une UI rapide à adapter avec de futurs design tokens.
- La logique de calcul est isolée dans `src/lib/crypto-simulation.ts` pour faciliter les tests et la réutilisation.
- Les hypothèses de rendement par crypto sont isolées dans `src/lib/crypto-market-assumptions.ts`.
- La page `/embed` montre comment intégrer le simulateur dans un format plus compact.
- Aucun appel API externe n'est utilisé : la démo reste autonome et déployable simplement.
- Aucun package de chart n'a été ajouté : le graphique est un SVG React léger et suffisant pour cette démo.
- La gestion des dates est isolée dans `src/lib/date-utils.ts`.

## Hypothèses de calcul

- Le rendement annuel estimé est composé selon la fréquence sélectionnée.
- Les versements périodiques sont ajoutés au début de chaque période de projection.
- Les frais d'entrée s'appliquent à l'investissement initial et aux versements périodiques.
- Les frais annuels sont convertis en taux périodique selon la fréquence sélectionnée.
- La durée est calculée automatiquement à partir des dates de début et de fin.
- Le simulateur n'utilise pas de données crypto live.
- Le rendement annuel est pré-rempli avec une hypothèse de démonstration différente selon la crypto sélectionnée.
- Bitcoin, Ethereum et Solana donnent donc des résultats différents par défaut.
- Ces valeurs restent des hypothèses, pas des prévisions de marché.
- L'utilisateur peut modifier librement le rendement avant d'analyser le résultat.
- Les résultats sont indicatifs et ne constituent pas un conseil financier.

## Évolution production : branchement de données historiques

### Pourquoi la version actuelle n'utilise pas d'API externe

La version actuelle est volontairement autonome.

Elle utilise un rendement annualisé estimé, des frais simples et une projection composée selon la fréquence choisie.

Ce choix permet de conserver :

- une démo stable ;
- des tests reproductibles ;
- aucune dépendance à une API tierce ;
- aucun besoin de clé privée ;
- un déploiement Vercel simple ;
- un périmètre adapté à un test technique court.

L'objectif du livrable est de montrer une démo fonctionnelle, une structure claire et une logique de calcul propre.

En production, le simulateur pourrait évoluer vers un vrai backtest historique sans refaire l'interface.

La source de calcul changerait simplement :

- aujourd'hui : rendement annualisé estimé ;
- production : série de prix historiques pour la crypto sélectionnée.

### Architecture proposée

Une évolution propre pourrait ajouter un moteur historique à côté du moteur actuel :

```txt
src/
  lib/
    crypto-simulation.ts        # moteur actuel de projection
    historical-simulation.ts    # futur moteur de backtest historique
    historical-prices.ts        # récupération et normalisation des prix
  types/
    historical-prices.ts        # types liés aux prix historiques
```

Cette structure permet de conserver le simulateur actuel tout en ajoutant progressivement un vrai backtest.

### Types TypeScript possibles

```ts
export type HistoricalPricePoint = {
  date: string;
  price: number;
};

export type HistoricalPriceSeries = {
  cryptoId: string;
  currency: "eur" | "usd";
  points: HistoricalPricePoint[];
};

export type HistoricalPriceProviderInput = {
  cryptoId: string;
  startDate: string;
  endDate: string;
  currency: "eur" | "usd";
};
```

Exemple de récupération :

```ts
async function getHistoricalPrices(
  input: HistoricalPriceProviderInput,
): Promise<HistoricalPricePoint[]> {
  // Appel API, lecture depuis une base, ou lecture d'un fichier pré-normalisé.
}
```

Signature possible du futur moteur :

```ts
export function calculateHistoricalSimulation(
  input: SimulationInput,
  prices: HistoricalPriceSeries,
): SimulationResult {
  // Futur moteur de backtest historique.
}
```

### Flux d'intégration

1. Récupérer les prix historiques de la crypto sélectionnée sur la période demandée.
2. Normaliser les données.
3. Passer la série normalisée au futur moteur de backtest historique.
4. Calculer les achats, la quantité accumulée, la valeur finale et les points du graphique.

La normalisation doit notamment :

- trier les points par date ;
- gérer les dates manquantes ;
- adapter les fréquences quotidienne, hebdomadaire et mensuelle ;
- fixer ou convertir la devise ;
- vérifier que les prix sont valides.

Le moteur historique pourrait ensuite calculer :

- les dates d'achat ;
- le montant investi à chaque période ;
- le prix d'achat réel ;
- la quantité de crypto achetée ;
- la quantité totale accumulée ;
- la valeur finale ;
- le capital investi ;
- la plus-value ;
- les frais ;
- les points du graphique.

Pseudo-code d'intégration :

```ts
const prices = await fetchHistoricalPrices({
  cryptoId: input.crypto,
  startDate: input.startDate,
  endDate: input.endDate,
  currency: "eur",
});

const result = calculateHistoricalSimulation(input, prices);
```

Sources possibles :

- CoinGecko ;
- CoinMarketCap ;
- fournisseur interne ;
- dataset historisé en base ;
- fichier pré-normalisé.

Aucune clé API ne doit être exposée côté client.

### Points de vigilance production

- Cache des réponses API.
- Limites de requêtes.
- Erreurs réseau.
- Dates sans prix disponible.
- Devise EUR/USD.
- Différence entre prix journalier et prix intraday.
- Tests avec dataset historique figé.
- Tests de non-régression sur les calculs.
- Fallback si l'API est indisponible.

### Pourquoi l'architecture actuelle facilite cette évolution

- La logique de calcul est déjà isolée dans `src/lib/crypto-simulation.ts`.
- Les dates de début et de fin sont déjà présentes.
- Les fréquences mensuelle, hebdomadaire et quotidienne sont déjà modélisées.
- Les stratégies d'investissement sont déjà séparées.
- La page principale existe déjà.
- La page `/embed` existe déjà.
- L'UI est découplée de la source de données.
- Le format de sortie `SimulationResult` peut rester stable.

Cette approche permettrait de conserver les composants React actuels, la page principale, la page `/embed`, les stratégies existantes, les fréquences existantes, les dates existantes et le format des résultats.

## Limites

Cette version privilégie une simulation autonome et stable, sans dépendance à une API externe.

Une version production pourrait connecter une source de données historiques crypto afin de reproduire un backtest réel sur dates de début et de fin, comme le simulateur actuel de S'investir.

- Le design devra être ajusté avec les design tokens exacts ou des captures validées de S'investir.
- Pas de connexion à une API de prix crypto dans cette démo.
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
- versement périodique nul ;
- investissement initial nul ;
- durée minimale ;
- frais nuls et frais non nuls ;
- investissement initial seul ;
- DCA seul ;
- investissement initial + DCA ;
- durée courte et durée longue ;
- capital investi correctement calculé ;
- stratégie `initial-only` explicite ;
- stratégie `dca-only` explicite ;
- stratégie `initial-dca` explicite ;
- fréquence mensuelle, hebdomadaire, quotidienne ;
- date de début / date de fin ;
- date de fin avant date de début normalisée ;
- période très courte et période longue ;
- frais d'entrée avec DCA ;
- labels de stratégie et fréquence ;
- hypothèses de rendement différentes par crypto.

Checklist manuelle recommandée :

- valeurs par défaut ;
- investissement initial seul ;
- DCA avec fréquence mensuelle ;
- investissement initial + DCA ;
- rendement à 0 % ;
- durée courte et durée longue ;
- frais à 0 et frais supérieurs à 0 ;
- responsive mobile 375 px, tablette et desktop ;
- absence de débordement horizontal ;
- lisibilité des champs, résultats et graphique.
