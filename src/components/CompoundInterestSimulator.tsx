import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeEuro,
  Check,
  Clock3,
  Globe2,
  Landmark,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { AdvisorContactModal, trackAdvisorModalOpen } from "./AdvisorContactModal";
import * as styles from "./CompoundInterestSimulator.module.css";

type ProductId = "cto_fr" | "cto_lux" | "cap_fr" | "cap_lux";
type QuestionId = "amount" | "company" | "horizon" | "security" | "international" | "assets" | "admin";
type ProductTone = "simple" | "international" | "secure" | "premium";
type ProductIcon = typeof WalletCards;

interface ProductProfile {
  id: ProductId;
  label: string;
  tone: ProductTone;
  icon: ProductIcon;
  headline: string;
  summary: string;
  bestFor: string[];
  watchouts: string[];
  facts: Array<{ label: string; value: string }>;
}

interface QuizAnswer {
  id: string;
  label: string;
  detail: string;
  scores: Partial<Record<ProductId, number>>;
}

interface QuizQuestion {
  id: QuestionId;
  label: string;
  helper: string;
  answers: QuizAnswer[];
}

type AnswersState = Partial<Record<QuestionId, string>>;

export interface PersonneMoraleQuizProps {
  headline?: string;
  subtitle?: string;
  eyebrow?: string;
  showCallToAction?: boolean;
  callToActionText?: string;
}

const PRODUCT_PROFILES: ProductProfile[] = [
  {
    id: "cto_fr",
    label: "Compte-titres français",
    tone: "simple",
    icon: WalletCards,
    headline: "Simple, liquide, frais contenus",
    summary:
      "Adapté aux trésoreries fluctuantes qui veulent accéder directement aux marchés avec une gestion administrative plus légère.",
    bestFor: [
      "Trésorerie limitée ou besoins de liquidité fréquents",
      "Activité surtout française ou européenne",
      "Priorité aux frais bas et à la digitalisation",
    ],
    watchouts: [
      "Pas de différé fiscal : les gains réalisés sont imposés annuellement à l'IS.",
      "Pas de fonds euros et moins d'options patrimoniales avancées.",
    ],
    facts: [
      { label: "Ticket Ramify", value: "100 000 € minimum" },
      { label: "Frais indicatifs", value: "0 % à 0,10 % / an" },
      { label: "Fiscalité IS", value: "Réelle annuelle" },
    ],
  },
  {
    id: "cto_lux",
    label: "Compte-titres luxembourgeois",
    tone: "international",
    icon: Globe2,
    headline: "Marchés directs et multi-devises",
    summary:
      "Pertinent pour les sociétés internationales ou les patrimoines qui veulent un compte espèces multi-devises et plus d'options de financement.",
    bestFor: [
      "Activité internationale, import/export ou filiales étrangères",
      "Besoin de devises, clean shares ou crédit Lombard",
      "Trésorerie à partir de 500 000 €",
    ],
    watchouts: [
      "Ne réduit pas l'impôt d'une société française : la fiscalité française reste applicable.",
      "Frais et formalisme supérieurs à un compte-titres français.",
    ],
    facts: [
      { label: "Ticket Ramify", value: "500 000 € minimum" },
      { label: "Frais indicatifs", value: "0,20 % à 0,50 % / an" },
      { label: "Fiscalité IS", value: "Réelle annuelle" },
    ],
  },
  {
    id: "cap_fr",
    label: "Contrat de capitalisation français",
    tone: "secure",
    icon: ShieldCheck,
    headline: "Fiscalité lissée et poche sécurisée",
    summary:
      "À considérer pour une société patrimoniale qui veut lisser la fiscalité à l'IS et conserver une exposition partielle à un fonds euros.",
    bestFor: [
      "Holding ou SCI patrimoniale éligible",
      "Besoin d'une poche fonds euros, si accessible",
      "Horizon d'au moins quelques années",
    ],
    watchouts: [
      "Éligibilité française plus restrictive pour les sociétés commerciales opérationnelles.",
      "Fonds euros souvent plafonné et retraits parfois pénalisés les premières années.",
    ],
    facts: [
      { label: "Ticket Ramify", value: "100 000 € minimum" },
      { label: "Frais indicatifs", value: "0,5 % à 1,5 % / an" },
      { label: "Fiscalité IS", value: "105 % du TME" },
    ],
  },
  {
    id: "cap_lux",
    label: "Contrat de capitalisation luxembourgeois",
    tone: "premium",
    icon: Landmark,
    headline: "Cadre patrimonial avancé",
    summary:
      "Souvent le plus complet pour une trésorerie importante, un horizon long, le multi-devises et les supports sophistiqués.",
    bestFor: [
      "Montant à partir de 250 000 €, idéalement 500 000 € et plus",
      "Horizon long, Private Equity, dette privée ou FAS/FID",
      "Recherche du triangle de sécurité et du super-privilège luxembourgeois",
    ],
    watchouts: [
      "Plus complexe à ouvrir et à administrer qu'une solution française.",
      "Fonds euros très rare et liquidité dépendante des supports choisis.",
    ],
    facts: [
      { label: "Ticket Ramify", value: "250 000 € minimum" },
      { label: "Supports", value: "Private Markets, or, crypto" },
      { label: "Fiscalité IS", value: "105 % du TME" },
    ],
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "amount",
    label: "Quel montant souhaitez-vous investir depuis votre personne morale ?",
    helper: "Les solutions personne morale Ramify s'adressent aux projets d'investissement à partir de 100 000 €.",
    answers: [
      {
        id: "100_250",
        label: "100 000 € à 250 000 €",
        detail: "Ticket compatible avec les solutions les plus accessibles.",
        scores: { cto_fr: 4, cap_fr: 4, cap_lux: -2, cto_lux: -3 },
      },
      {
        id: "250_500",
        label: "250 000 € à 500 000 €",
        detail: "Le contrat de capitalisation luxembourgeois devient accessible.",
        scores: { cap_lux: 3, cap_fr: 2, cto_fr: 2, cto_lux: -1 },
      },
      {
        id: "500_1m",
        label: "500 000 € à 1 000 000 €",
        detail: "Les quatre enveloppes peuvent être comparées.",
        scores: { cap_lux: 4, cto_lux: 3, cap_fr: 1 },
      },
      {
        id: "1m_plus",
        label: "Plus de 1 000 000 €",
        detail: "Accès plus large aux supports sophistiqués et aux frais dégressifs.",
        scores: { cap_lux: 5, cto_lux: 3 },
      },
    ],
  },
  {
    id: "company",
    label: "Quelle est la nature de votre personne morale ?",
    helper: "L'éligibilité française dépend souvent de l'objet social et du caractère patrimonial ou opérationnel.",
    answers: [
      {
        id: "patrimonial",
        label: "Holding, SCI ou société patrimoniale",
        detail: "Structure orientée détention et gestion de patrimoine.",
        scores: { cap_fr: 3, cap_lux: 2, cto_fr: 1 },
      },
      {
        id: "operational",
        label: "Société commerciale ou opérationnelle",
        detail: "Activité industrielle, commerciale, artisanale ou de services.",
        scores: { cto_fr: 3, cto_lux: 3, cap_lux: 2, cap_fr: -3 },
      },
      {
        id: "association",
        label: "Association, fondation ou autre structure",
        detail: "Statuts à vérifier avant toute souscription.",
        scores: { cto_fr: 2, cap_fr: 1, cto_lux: 1 },
      },
      {
        id: "unknown",
        label: "Je veux valider ce point avec un conseiller",
        detail: "Le diagnostic juridique fait partie des points à confirmer.",
        scores: { cap_lux: 1, cto_fr: 1, cto_lux: 1, cap_fr: 1 },
      },
    ],
  },
  {
    id: "horizon",
    label: "Quel est votre horizon de placement et votre besoin de liquidité ?",
    helper: "Plus l'horizon est court ou incertain, plus la liquidité et la simplicité comptent.",
    answers: [
      {
        id: "under_2",
        label: "Moins de 2 ans ou liquidité prioritaire",
        detail: "L'entreprise peut avoir besoin des fonds rapidement.",
        scores: { cto_fr: 4, cto_lux: 2, cap_fr: -2, cap_lux: -2 },
      },
      {
        id: "2_5",
        label: "2 à 5 ans",
        detail: "Horizon intermédiaire, avec une liquidité encore importante.",
        scores: { cto_fr: 2, cap_fr: 2, cto_lux: 1 },
      },
      {
        id: "5_10",
        label: "5 à 10 ans",
        detail: "Horizon compatible avec une enveloppe patrimoniale.",
        scores: { cap_lux: 3, cap_fr: 2, cto_lux: 1 },
      },
      {
        id: "10_plus",
        label: "Plus de 10 ans",
        detail: "Approche long terme, adaptée aux solutions les plus complètes.",
        scores: { cap_lux: 4, cap_fr: 2, cto_lux: 1 },
      },
    ],
  },
  {
    id: "security",
    label: "Quel niveau de sécurité recherchez-vous ?",
    helper: "Les fonds euros sont surtout disponibles en France, tandis que le Luxembourg apporte un cadre de protection distinct.",
    answers: [
      {
        id: "fund_euro",
        label: "Une poche fonds euros est indispensable",
        detail: "Vous voulez une partie à capital garanti, si votre structure y est éligible.",
        scores: { cap_fr: 4, cto_fr: -1, cto_lux: -1, cap_lux: -1 },
      },
      {
        id: "low_risk",
        label: "Je veux une allocation prudente, sans fonds euros obligatoire",
        detail: "Fonds monétaires, obligations ou allocation défensive peuvent suffire.",
        scores: { cap_fr: 2, cto_fr: 2, cap_lux: 1 },
      },
      {
        id: "protection",
        label: "Je privilégie la protection juridique de l'enveloppe",
        detail: "Cadre luxembourgeois, triangle de sécurité et super-privilège.",
        scores: { cap_lux: 4, cto_lux: 2 },
      },
      {
        id: "market_risk",
        label: "J'accepte une allocation diversifiée plus exposée aux marchés",
        detail: "Le rendement potentiel prime sur une garantie en capital.",
        scores: { cap_lux: 3, cto_lux: 2, cto_fr: 1, cap_fr: 1 },
      },
    ],
  },
  {
    id: "international",
    label: "Avez-vous un besoin multi-devises ou une activité internationale ?",
    helper: "Le Luxembourg devient plus utile lorsque les flux, les actifs ou le reporting dépassent le cadre euro français.",
    answers: [
      {
        id: "eur",
        label: "Non, l'euro et un cadre français suffisent",
        detail: "Activité principalement française ou européenne.",
        scores: { cto_fr: 3, cap_fr: 2 },
      },
      {
        id: "occasional",
        label: "Ponctuellement",
        detail: "Quelques expositions internationales ou devises à gérer.",
        scores: { cto_lux: 1, cap_lux: 1, cto_fr: 1 },
      },
      {
        id: "regular",
        label: "Oui, de façon régulière",
        detail: "Filiales, import/export, devises ou patrimoine international.",
        scores: { cto_lux: 4, cap_lux: 4, cto_fr: -1, cap_fr: -1 },
      },
    ],
  },
  {
    id: "assets",
    label: "Quels supports ou services sont prioritaires ?",
    helper: "Le choix change fortement selon que vous voulez des marchés directs, une fiscalité lissée ou des actifs non cotés.",
    answers: [
      {
        id: "low_fees",
        label: "Frais bas, ETF, obligations et liquidité",
        detail: "Gestion directe et coût minimal avant tout.",
        scores: { cto_fr: 4, cto_lux: 1 },
      },
      {
        id: "clean_shares",
        label: "Clean shares, marchés directs et multi-devises",
        detail: "Accès institutionnel et comptes espèces en devises.",
        scores: { cto_lux: 4, cto_fr: 2 },
      },
      {
        id: "private_assets",
        label: "Private Equity, dette privée ou fonds alternatifs",
        detail: "Univers d'investissement plus patrimonial et moins coté.",
        scores: { cap_lux: 4, cap_fr: 1 },
      },
      {
        id: "lombard",
        label: "Crédit Lombard ou nantissement",
        detail: "Utiliser le portefeuille comme garantie de financement.",
        scores: { cap_lux: 3, cto_lux: 3, cap_fr: 1 },
      },
    ],
  },
  {
    id: "admin",
    label: "Quel niveau de complexité administrative acceptez-vous ?",
    helper: "Les solutions luxembourgeoises apportent plus de possibilités, avec un formalisme plus élevé.",
    answers: [
      {
        id: "minimal",
        label: "Minimal : digitalisation et reporting simple",
        detail: "Ouverture rapide, gestion en ligne et démarches limitées.",
        scores: { cto_fr: 4, cap_fr: 2, cto_lux: -2, cap_lux: -2 },
      },
      {
        id: "moderate",
        label: "Modéré : quelques formalités sont acceptables",
        detail: "Vous acceptez un peu plus de dossier pour un meilleur ajustement.",
        scores: { cap_fr: 1, cto_lux: 1, cap_lux: 1 },
      },
      {
        id: "expert",
        label: "Élevé : la structuration prime sur la simplicité",
        detail: "Vous privilégiez l'accès aux services, supports et protections avancés.",
        scores: { cap_lux: 3, cto_lux: 2 },
      },
    ],
  },
];

const DEFAULT_HEADLINE = "Quelle enveloppe choisir pour votre personne morale ?";
const DEFAULT_SUBTITLE =
  "Répondez à quelques questions pour comparer compte-titres français, compte-titres luxembourgeois, contrat de capitalisation français et contrat luxembourgeois.";
const DEFAULT_EYEBROW = "Quiz d'orientation";
const DEFAULT_CTA = "Échanger avec un conseiller";

function getAnswer(questionId: QuestionId, answerId: string | undefined) {
  return QUIZ_QUESTIONS.find((question) => question.id === questionId)?.answers.find((answer) => answer.id === answerId);
}

function getSelectedAnswers(answers: AnswersState) {
  return QUIZ_QUESTIONS.map((question) => {
    const selected = getAnswer(question.id, answers[question.id]);
    return selected ? { question, answer: selected } : null;
  }).filter(Boolean) as Array<{ question: QuizQuestion; answer: QuizAnswer }>;
}

function computeScores(answers: AnswersState) {
  const scores = PRODUCT_PROFILES.reduce(
    (accumulator, product) => ({ ...accumulator, [product.id]: 0 }),
    {} as Record<ProductId, number>,
  );

  for (const { answer } of getSelectedAnswers(answers)) {
    for (const [productId, score] of Object.entries(answer.scores) as Array<[ProductId, number]>) {
      scores[productId] += score;
    }
  }

  return PRODUCT_PROFILES.map((product) => ({
    product,
    score: scores[product.id],
  })).sort((a, b) => b.score - a.score);
}

function getProgressLabel(answeredCount: number) {
  return `${answeredCount}/${QUIZ_QUESTIONS.length} réponses`;
}

function getScorePercent(score: number, topScore: number) {
  if (topScore <= 0) return 0;
  return Math.max(8, Math.round((Math.max(0, score) / topScore) * 100));
}

function buildRecommendationTitle(topProduct: ProductProfile, secondProduct: ProductProfile, topScore: number, secondScore: number) {
  if (topScore - secondScore <= 2) {
    return `${topProduct.label} à comparer avec ${secondProduct.label}`;
  }

  return `${topProduct.label} ressort en priorité`;
}

export function PersonneMoraleQuiz({
  headline = DEFAULT_HEADLINE,
  subtitle = DEFAULT_SUBTITLE,
  eyebrow = DEFAULT_EYEBROW,
  showCallToAction = true,
  callToActionText = DEFAULT_CTA,
}: PersonneMoraleQuizProps) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const answeredCount = getSelectedAnswers(answers).length;
  const isComplete = answeredCount === QUIZ_QUESTIONS.length;
  const rankedResults = useMemo(() => computeScores(answers), [answers]);
  const [topResult, secondResult] = rankedResults;
  const topScore = Math.max(topResult.score, 1);
  const selectedSignals = getSelectedAnswers(answers);
  const TopResultIcon = topResult.product.icon;

  const handleAnswerSelect = (questionId: QuestionId, answerId: string) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: answerId }));
    setCurrentQuestionIndex((index) => Math.min(index + 1, QUIZ_QUESTIONS.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const openAdvisorModal = () => {
    trackAdvisorModalOpen();
    setIsAdvisorModalOpen(true);
  };

  return (
    <section className={styles.simulatorContainer} aria-label="Quiz personne morale Ramify">
      <div className={styles.shell}>
        <aside className={styles.introPanel}>
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2 className={styles.title}>{headline}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <div className={styles.productRail} aria-label="Enveloppes comparées">
            {PRODUCT_PROFILES.map((product) => {
              const Icon = product.icon;
              return (
                <div key={product.id} className={`${styles.productPill} ${styles[`productPill_${product.tone}`]}`}>
                  <Icon className={styles.productPillIcon} aria-hidden="true" />
                  <span>{product.label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.introFacts}>
            <div className={styles.introFact}>
              <BadgeEuro className={styles.introFactIcon} aria-hidden="true" />
              <div>
                <strong>100 000 €</strong>
                <span>Ticket minimum cible</span>
              </div>
            </div>
            <div className={styles.introFact}>
              <Clock3 className={styles.introFactIcon} aria-hidden="true" />
              <div>
                <strong>7 questions</strong>
                <span>Diagnostic indicatif</span>
              </div>
            </div>
          </div>
        </aside>

        <div className={styles.quizPanel}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>{getProgressLabel(answeredCount)}</span>
            <span className={styles.progressStep}>Question {currentQuestionIndex + 1}</span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressFill} style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%` }} />
          </div>

          {!isComplete ? (
            <div className={styles.questionStage}>
              <div className={styles.questionHeader}>
                <p className={styles.questionHelper}>{currentQuestion.helper}</p>
                <h3 className={styles.questionTitle}>{currentQuestion.label}</h3>
              </div>

              <div className={styles.answerGrid}>
                {currentQuestion.answers.map((answer) => {
                  const isSelected = answers[currentQuestion.id] === answer.id;
                  return (
                    <button
                      type="button"
                      key={answer.id}
                      className={`${styles.answerButton} ${isSelected ? styles.answerButtonSelected : ""}`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                    >
                      <span className={styles.answerCheck} aria-hidden="true">
                        {isSelected && <Check className={styles.answerCheckIcon} />}
                      </span>
                      <span className={styles.answerText}>
                        <strong>{answer.label}</strong>
                        <span>{answer.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.navigationRow}>
                <button type="button" className={styles.secondaryButton} onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  <ArrowLeft className={styles.buttonIcon} aria-hidden="true" />
                  Précédent
                </button>
                <button type="button" className={styles.secondaryButton} onClick={handleReset} disabled={answeredCount === 0}>
                  <RotateCcw className={styles.buttonIcon} aria-hidden="true" />
                  Recommencer
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.resultStage}>
              <div className={styles.resultHeader}>
                <span className={styles.resultBadge}>Résultat indicatif</span>
                <h3 className={styles.resultTitle}>
                  {buildRecommendationTitle(topResult.product, secondResult.product, topResult.score, secondResult.score)}
                </h3>
                <p className={styles.resultLead}>{topResult.product.summary}</p>
              </div>

              <div className={styles.resultHero}>
                <div className={`${styles.resultProductCard} ${styles[`resultProductCard_${topResult.product.tone}`]}`}>
                  <TopResultIcon className={styles.resultIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.resultProductLabel}>{topResult.product.label}</p>
                    <h4>{topResult.product.headline}</h4>
                  </div>
                </div>
                <div className={styles.resultFacts}>
                  {topResult.product.facts.map((fact) => (
                    <div key={fact.label} className={styles.resultFact}>
                      <span>{fact.label}</span>
                      <strong>{fact.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.resultColumns}>
                <div>
                  <h4 className={styles.detailTitle}>Pourquoi cette piste ressort</h4>
                  <ul className={styles.checkList}>
                    {topResult.product.bestFor.map((item) => (
                      <li key={item}>
                        <Check className={styles.listIcon} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={styles.detailTitle}>Points à valider</h4>
                  <ul className={styles.watchList}>
                    {topResult.product.watchouts.map((item) => (
                      <li key={item}>
                        <LockKeyhole className={styles.listIcon} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.scoreBoard}>
                <h4 className={styles.detailTitle}>Comparaison des 4 enveloppes</h4>
                {rankedResults.map(({ product, score }) => (
                  <div key={product.id} className={styles.scoreRow}>
                    <div className={styles.scoreLabel}>
                      <span>{product.label}</span>
                    </div>
                    <div className={styles.scoreTrack} aria-hidden="true">
                      <span
                        className={`${styles.scoreFill} ${styles[`scoreFill_${product.tone}`]}`}
                        style={{ width: `${getScorePercent(score, topScore)}%` }}
                      />
                    </div>
                    <strong>{Math.max(0, score)}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.signalPanel}>
                <h4 className={styles.detailTitle}>Vos réponses structurantes</h4>
                <div className={styles.signalGrid}>
                  {selectedSignals.map(({ question, answer }) => (
                    <div key={question.id} className={styles.signalItem}>
                      <span>{question.label}</span>
                      <strong>{answer.label}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.resultFooter}>
                <p>
                  Ce quiz ne remplace pas une analyse fiscale, comptable ou juridique. Il sert à préparer l'échange avec un conseiller
                  Ramify.
                </p>
                <div className={styles.resultActions}>
                  <button type="button" className={styles.secondaryButton} onClick={handleReset}>
                    <RotateCcw className={styles.buttonIcon} aria-hidden="true" />
                    Refaire le quiz
                  </button>
                  {showCallToAction && (
                    <button type="button" className={styles.primaryButton} onClick={openAdvisorModal}>
                      {callToActionText}
                      <ArrowRight className={styles.buttonIcon} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdvisorContactModal isOpen={isAdvisorModalOpen} onClose={() => setIsAdvisorModalOpen(false)} />
    </section>
  );
}

export const CompoundInterestSimulator = PersonneMoraleQuiz;
export type CompoundInterestSimulatorProps = PersonneMoraleQuizProps;
