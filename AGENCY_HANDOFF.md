# Handoff agence Webflow - Quiz personne morale

Ce document décrit la procédure pour installer et publier le Code Component natif Webflow du quiz personne morale.

## 1) Ce qui est livré

- Composant Webflow : `Quiz Personne Morale`
- Groupe Webflow : `Ramify`
- Librairie Webflow : `Ramify Simulateurs`
- Entrée Webflow : `src/components/CompoundInterestSimulator.webflow.tsx`
- Implémentation UI : `src/components/CompoundInterestSimulator.tsx`
- Modal RDV : `src/components/AdvisorContactModal.tsx`
- Sources métier : `docs/SOURCES_PERSONNE_MORALE.md`

## 2) Préparer l'environnement

1. Ouvrir `webflow-code-component/`.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer `.env` à partir de `.env.example` et renseigner :
   - `WEBFLOW_WORKSPACE_API_TOKEN`

## 3) Vérifier avant publication

Exécuter :

```bash
npm run verify
```

Cette commande valide :

- TypeScript (`typecheck`)
- Build front (`vite build`)
- Bundle Webflow (`webflow library bundle`)

## 4) Publier ou mettre à jour la librairie Webflow

Exécuter :

```bash
npm run share
```

Résultat attendu : message de succès Webflow CLI confirmant le partage de la librairie dans le workspace cible.

## 5) Installer le composant dans Webflow

Page cible : `https://www.ramify.fr/produits/personne-morale`

Procédure recommandée :

1. Valider d'abord sur un site Webflow sandbox ou une page dupliquée.
2. Installer ou mettre à jour la librairie `Ramify Simulateurs`.
3. Ajouter `Quiz Personne Morale` dans la section dark de la page.
4. Régler la largeur du composant à 100%.
5. Vérifier desktop, tablet et mobile avant publication.

## 6) Props Webflow

Paramètres recommandés :

- Sur-titre : `Quiz d'orientation`
- Titre : `Quelle enveloppe choisir pour votre personne morale ?`
- Description : `Répondez à quelques questions pour comparer CTO français, CTO luxembourgeois, contrat de capitalisation français et contrat luxembourgeois.`
- Afficher la note de source : `true`
- Afficher le CTA final : `true`
- Texte CTA final : `Échanger avec un conseiller`

## 7) CTA et prise de rendez-vous

Le CTA final ouvre le même flow Calendly que le simulateur intérêts composés, mais la première question est adaptée au ticket personne morale :

- Entre 100 000 € et 250 000 €
- Entre 250 000 € et 500 000 €
- Entre 500 000 € et 1 000 000 €
- Entre 1 000 000 € et 5 000 000 €
- Plus de 5 000 000 €
- Je ne sais pas encore

Seuils produit à respecter dans les contenus :

- Contrat de capitalisation français : à partir de 100 000 €
- Contrat de capitalisation luxembourgeois : à partir de 250 000 €
- CTO français : à partir de 100 000 €
- CTO luxembourgeois : à partir de 500 000 €

## 8) QA fonctionnelle

- Chaque réponse avance à la question suivante.
- Le bouton précédent fonctionne.
- Le reset vide les réponses.
- Le résultat affiche bien les quatre enveloppes.
- Le CTA ouvre le modal RDV.
- Le choix du montant charge bien Calendly.
- Les textes restent lisibles dans une section dark.

## 9) QA métier

- CTO français favorisé par liquidité, frais bas, simplicité et cadre français.
- CTO luxembourgeois favorisé par multi-devises, international, clean shares et Lombard.
- Contrat de capitalisation français favorisé par société patrimoniale, fonds euros et fiscalité lissée.
- Contrat luxembourgeois favorisé par montant important, horizon long, supports sophistiqués et protection luxembourgeoise.
- Le résultat indique que le quiz ne remplace pas une analyse fiscale, juridique ou comptable.

## 10) Demo public via GitHub Pages

Repo prévu :

- `https://github.com/ramify-jb/quiz-personne-morale-demo`

URL prévue :

- `https://ramify-jb.github.io/quiz-personne-morale-demo/`

Publication :

```bash
npm run deploy:public-demo
```
