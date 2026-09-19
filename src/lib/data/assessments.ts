import type { Assessment, AssessmentQuestion } from "@/lib/types";

const statsQuestions: AssessmentQuestion[] = [
  {
    id: "st-1",
    concept: "mean-variance",
    type: "mcq",
    prompt: "The mean of the dataset [4, 8, 6, 5, 3] is:",
    options: ["4.5", "5.2", "5.4", "6.0"],
    answerIndex: 1,
    explanation: "Mean = (4+8+6+5+3)/5 = 26/5 = 5.2.",
    weight: 2,
  },
  {
    id: "st-2",
    concept: "mean-variance",
    type: "mcq",
    prompt: "Variance measures:",
    options: [
      "The most frequent value in a dataset",
      "The spread of values around the mean",
      "The middle value when data is sorted",
      "The difference between the largest and smallest value",
    ],
    answerIndex: 1,
    explanation: "Variance is the average squared distance of each value from the mean.",
    weight: 2,
  },
  {
    id: "st-3",
    concept: "probability",
    type: "mcq",
    prompt: "A fair six-sided die is rolled. The probability of rolling an even number is:",
    options: ["1/6", "1/3", "1/2", "2/3"],
    answerIndex: 2,
    explanation: "Three of six outcomes (2, 4, 6) are even, so P = 3/6 = 1/2.",
    weight: 2,
  },
  {
    id: "st-4",
    concept: "probability",
    type: "mcq",
    prompt: "Two independent events A and B have P(A) = 0.5 and P(B) = 0.4. P(A and B) is:",
    options: ["0.1", "0.2", "0.45", "0.9"],
    answerIndex: 1,
    explanation: "For independent events, P(A and B) = P(A) × P(B) = 0.5 × 0.4 = 0.2.",
    weight: 2,
  },
  {
    id: "st-5",
    concept: "conditional-probability",
    type: "mcq",
    prompt: "P(A | B) is defined as:",
    options: [
      "P(A and B) / P(B)",
      "P(A and B) / P(A)",
      "P(A) + P(B) − P(A and B)",
      "P(B) / P(A)",
    ],
    answerIndex: 0,
    explanation: "Conditional probability is the probability of A given B has occurred: P(A|B) = P(A∩B)/P(B).",
    weight: 2,
  },
  {
    id: "st-6",
    concept: "conditional-probability",
    type: "problem",
    prompt: "In a class, 60% of students study and 80% of those who study pass. Overall pass rate is 60%. What is P(studied | passed)?",
    options: ["0.48", "0.60", "0.80", "0.36"],
    answerIndex: 2,
    explanation: "P(studied)=0.6, P(pass|studied)=0.8, P(pass)=0.6. Bayes: 0.6×0.8/0.6 = 0.8.",
    weight: 3,
  },
  {
    id: "st-7",
    concept: "distributions",
    type: "mcq",
    prompt: "A normal distribution is fully described by its:",
    options: ["Min and max", "Mean and median", "Mean and standard deviation", "Mode and range"],
    answerIndex: 2,
    explanation: "The normal distribution's shape is determined entirely by its mean μ and standard deviation σ.",
    weight: 2,
  },
  {
    id: "st-8",
    concept: "distributions",
    type: "mcq",
    prompt: "About 68% of the values of a normal distribution lie within:",
    options: ["1 standard deviation of the mean", "2 standard deviations", "3 standard deviations", "Mean ± median"],
    answerIndex: 0,
    explanation: "The empirical rule: ≈68% of values fall within 1σ of the mean.",
    weight: 2,
  },
  {
    id: "st-9",
    concept: "interpretation",
    type: "concept",
    prompt: "A dataset has a few very large outliers. Which statistic best summarizes its typical value?",
    options: ["Mean", "Median", "Range", "Variance"],
    answerIndex: 1,
    explanation: "The median is robust to outliers, whereas the mean is pulled toward extreme values.",
    weight: 2,
  },
  {
    id: "st-10",
    concept: "interpretation",
    type: "concept",
    prompt: "A smaller standard deviation means the data is:",
    options: ["More spread out", "More concentrated around the mean", "More skewed", "Likely has more outliers"],
    answerIndex: 1,
    explanation: "Standard deviation is a measure of spread; smaller values mean values cluster closer to the mean.",
    weight: 1,
  },
  {
    id: "st-11",
    concept: "distributions",
    type: "problem",
    prompt: "For a random variable, the expected value E[X] is best described as:",
    options: [
      "The value that occurs most often",
      "A probability-weighted average of all possible values",
      "The spread of the distribution",
      "The midpoint of the range",
    ],
    answerIndex: 1,
    explanation: "E[X] = Σ x·P(x), a probability-weighted average — the long-run mean.",
    weight: 2,
  },
  {
    id: "st-12",
    concept: "mean-variance",
    type: "mcq",
    prompt: "Each value in a dataset is increased by 10. What happens to its variance?",
    options: ["It increases by 10", "It increases by 100", "It stays the same", "It becomes 0"],
    answerIndex: 2,
    explanation: "Shifting data by a constant does not change spread, so variance is unchanged.",
    weight: 2,
  },
  {
    id: "st-13",
    concept: "interpretation",
    type: "concept",
    prompt: "A z-score of 2.0 for a value means it is:",
    options: [
      "2 values above the mean",
      "2 standard deviations above the mean",
      "Twice the mean",
      "The highest value in the dataset",
    ],
    answerIndex: 1,
    explanation: "z = (x − μ)/σ, so 2.0 means the value is 2 standard deviations above the mean.",
    weight: 1,
  },
];

const mlQuestions: AssessmentQuestion[] = [
  { id: "ml-1", concept: "supervised-learning", type: "mcq", prompt: "A model that predicts a continuous number (e.g. house price) is performing:", options: ["Classification", "Regression", "Clustering", "Reinforcement"], answerIndex: 1, explanation: "Regression predicts continuous values; classification predicts categories.", weight: 2 },
  { id: "ml-2", concept: "supervised-learning", type: "mcq", prompt: "Labels are present in the training data for:", options: ["Unsupervised learning", "Supervised learning", "Both always", "Neither"], answerIndex: 1, explanation: "Supervised learning trains on labeled input-output pairs.", weight: 2 },
  { id: "ml-3", concept: "overfitting", type: "concept", prompt: "A model performs great on training data but poorly on new data. This is:", options: ["Underfitting", "Overfitting", "Regularization", "Normalization"], answerIndex: 1, explanation: "High train performance with poor generalization is the classic overfitting signal.", weight: 2 },
  { id: "ml-4", concept: "training", type: "mcq", prompt: "Gradient descent is used to:", options: ["Sort the dataset", "Minimize the loss function", "Evaluate precision", "Encode categories"], answerIndex: 1, explanation: "Gradient descent iteratively updates parameters to reduce loss.", weight: 2 },
  { id: "ml-5", concept: "features", type: "mcq", prompt: "Which is NOT a typical step in the ML workflow?", options: ["Data cleaning", "Feature engineering", "Model training", "Compiling to machine code"], answerIndex: 3, explanation: "ML models are trained, not compiled — this is not part of the workflow.", weight: 2 },
  { id: "ml-6", concept: "training", type: "problem", prompt: "Hyperparameters differ from model parameters because hyperparameters are:", options: ["Learned from data", "Set before training", "Always zero", "Outputs of the model"], answerIndex: 1, explanation: "Hyperparameters (e.g. learning rate) are configured before training; parameters are learned.", weight: 2 },
];

const evalQuestions: AssessmentQuestion[] = [
  { id: "ev-1", concept: "splits", type: "mcq", prompt: "The primary reason for holding out a test set is to:", options: ["Speed up training", "Estimate performance on unseen data", "Reduce dataset size", "Tune hyperparameters"], answerIndex: 1, explanation: "A held-out test set estimates how well the model generalizes.", weight: 2 },
  { id: "ev-2", concept: "metrics", type: "mcq", prompt: "With 100 positives and 5 predicted positives (all correct), recall is:", options: ["5%", "100%", "50%", "Cannot determine"], answerIndex: 0, explanation: "Recall = TP/(TP+FN) = 5/100 = 5%. Precision would be high, recall low.", weight: 2 },
  { id: "ev-3", concept: "metrics", type: "mcq", prompt: "Accuracy is a misleading metric when:", options: ["Classes are imbalanced", "Data is numeric", "There are two classes", "The model is a tree"], answerIndex: 0, explanation: "With imbalanced classes, high accuracy can hide poor performance on the minority class.", weight: 2 },
  { id: "ev-4", concept: "validation", type: "concept", prompt: "The bias-variance tradeoff describes:", options: ["Speed vs. accuracy", "Simple vs. complex models and their error sources", "Train vs. test time", "CPU vs. GPU training"], answerIndex: 1, explanation: "High bias = underfitting, high variance = overfitting; models balance the two.", weight: 2 },
  { id: "ev-5", concept: "validation", type: "mcq", prompt: "K-fold cross-validation:", options: ["Trains on all data at once", "Splits data into K folds, training K times", "Uses no labels", "Only works for deep learning"], answerIndex: 1, explanation: "Each fold is held out once while training on the rest, using all data for evaluation.", weight: 2 },
];

const pyQuestions: AssessmentQuestion[] = [
  { id: "py-1", concept: "basics", type: "mcq", prompt: "Which is a mutable built-in data structure?", options: ["tuple", "list", "string", "int"], answerIndex: 1, explanation: "Lists are mutable; tuples and strings are immutable.", weight: 2 },
  { id: "py-2", concept: "basics", type: "mcq", prompt: "The output of `2 ** 3` is:", options: ["6", "8", "9", "23"], answerIndex: 1, explanation: "`**` is exponentiation: 2³ = 8.", weight: 2 },
  { id: "py-3", concept: "functions", type: "mcq", prompt: "A lambda is best described as:", options: ["A named function", "An anonymous inline function", "A loop", "A data type"], answerIndex: 1, explanation: "A lambda is a small anonymous function.", weight: 2 },
  { id: "py-4", concept: "functions", type: "concept", prompt: "A list comprehension is used to:", options: ["Merge lists", "Build a new list from an existing iterable concisely", "Sort a list", "Delete a list"], answerIndex: 1, explanation: "Comprehensions build lists from iterables in one line.", weight: 2 },
];

const pandasQuestions: AssessmentQuestion[] = [
  { id: "pd-1", concept: "dataframe", type: "mcq", prompt: "The primary 2-D tabular structure in Pandas is the:", options: ["Series", "DataFrame", "Matrix", "Dict"], answerIndex: 1, explanation: "A DataFrame is Pandas' 2-D labeled table.", weight: 2 },
  { id: "pd-2", concept: "operations", type: "mcq", prompt: "Which method groups rows and applies an aggregate?", options: ["map", "groupby", "reshape", "pivot_table_only"], answerIndex: 1, explanation: "`.groupby()` splits data into groups for aggregation.", weight: 2 },
  { id: "pd-3", concept: "operations", type: "concept", prompt: "df.isnull().sum() is used to:", options: ["Drop rows", "Count missing values per column", "Fill zeros", "Filter numbers"], answerIndex: 1, explanation: "It counts null values in each column — the first step of cleaning.", weight: 2 },
];

export interface AssessmentMeta {
  id: string;
  skillId: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  totalWeight: number;
}

function build(skillId: string, title: string, description: string, questions: AssessmentQuestion[]): Assessment {
  return { id: `${skillId}-assessment`, skillId, title, description, questions };
}

export const ASSESSMENTS: Record<string, Assessment> = {
  statistics: build(
    "statistics",
    "Statistics Checkpoint",
    "Covers mean and variance, probability, conditional probability, distributions, and statistical interpretation — the foundations you need before machine learning.",
    statsQuestions
  ),
  "machine-learning": build(
    "machine-learning",
    "Machine Learning Fundamentals",
    "Covers supervised learning, the ML workflow, training, and overfitting.",
    mlQuestions
  ),
  "model-evaluation": build(
    "model-evaluation",
    "Model Evaluation Checkpoint",
    "Tests your understanding of splits, metrics, validation, and the bias-variance tradeoff.",
    evalQuestions
  ),
  python: build("python", "Python Quick Check", "Verifies Python fluency before proceeding to data tooling.", pyQuestions),
  pandas: build("pandas", "Pandas Checkpoint", "Checks DataFrame manipulation and data-cleaning basics.", pandasQuestions),
};

export function statisticsTotalWeight(): number {
  return statsQuestions.reduce((s, q) => s + (q.weight ?? 1), 0);
}

export function conceptWeights(assessment: Assessment): Record<string, number> {
  const out: Record<string, number> = {};
  for (const q of assessment.questions) {
    out[q.concept] = (out[q.concept] ?? 0) + (q.weight ?? 1);
  }
  return out;
}