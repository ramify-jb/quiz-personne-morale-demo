import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import { PersonneMoraleQuiz, type PersonneMoraleQuizProps } from "./CompoundInterestSimulator";

const WebflowPersonneMoraleQuiz = (componentProps: PersonneMoraleQuizProps) => {
  return <PersonneMoraleQuiz {...componentProps} />;
};

export default declareComponent(WebflowPersonneMoraleQuiz, {
  name: "Quiz Personne Morale",
  description: "Quiz d'orientation Ramify pour choisir une enveloppe d'investissement personne morale",
  group: "Ramify",
  props: {
    eyebrow: props.Text({
      name: "Sur-titre",
      group: "Contenu",
      defaultValue: "Quiz d'orientation",
    }),
    headline: props.Text({
      name: "Titre",
      group: "Contenu",
      defaultValue: "Quelle enveloppe choisir pour votre personne morale ?",
    }),
    subtitle: props.Text({
      name: "Description",
      group: "Contenu",
      defaultValue:
        "Répondez à quelques questions pour comparer compte-titres français, compte-titres luxembourgeois, contrat de capitalisation français et contrat luxembourgeois.",
    }),
    showCallToAction: props.Boolean({
      name: "Afficher le CTA final",
      group: "CTA",
      defaultValue: true,
    }),
    callToActionText: props.Text({
      name: "Texte CTA final",
      group: "CTA",
      defaultValue: "Échanger avec un conseiller",
    }),
  },
  options: {
    applyTagSelectors: true,
  },
});
