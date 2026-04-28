# Quiz personne morale (Webflow Code Component)

Ce dossier contient le quiz Ramify pour orienter une personne morale vers l'une des quatre enveloppes commercialisées :

- CTO français
- CTO luxembourgeois
- Contrat de capitalisation français
- Contrat de capitalisation luxembourgeois

Le composant est en React + Webflow Code Components, sans iframe, dans la librairie Webflow `Ramify Simulateurs`.

## Prérequis

- Node.js 20+
- npm 10+
- Un token Workspace Webflow dans `.env` pour `npm run share` (voir `.env.example`)

## Commandes utiles

```bash
npm install
npm run dev
npm run verify
npm run share
npm run deploy:public-demo
npm run package:handoff
```

## Détail des scripts

- `npm run dev` : preview local Vite.
- `npm run verify` : vérification complète (`typecheck` + `build` + `bundle`).
- `npm run share` : partage la librairie Code Components dans un workspace Webflow.
- `npm run deploy:public-demo` : publie la démo statique sur `https://ramify-jb.github.io/quiz-personne-morale-demo/`.
- `npm run package:handoff` : crée une archive prête à transmettre à l'agence dans `release/`.

## Demo public (GitHub Pages)

Repo prévu :

- `https://github.com/ramify-jb/quiz-personne-morale-demo`

URL prévue :

- `https://ramify-jb.github.io/quiz-personne-morale-demo/`

Publication :

```bash
npm run deploy:public-demo
```

## Sources métier

Le mapping du quiz est documenté dans :

- `docs/SOURCES_PERSONNE_MORALE.md`

Les sources viennent du snapshot courant du website mirror :

- `website-mirror/snapshots/2026-04-07T10-17-54/`
