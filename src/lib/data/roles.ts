import type { Skill } from "@/lib/types";

export const SKILLS: Record<string, Skill> = {
  python: {
    id: "python",
    name: "Python",
    category: "programming",
    description:
      "The primary language for data science and machine learning — syntax, data structures, functions, and OOP.",
  },
  sql: {
    id: "sql",
    name: "SQL",
    category: "data",
    description:
      "Querying relational databases to extract, filter, join, and aggregate data for analysis.",
  },
  javascript: {
    id: "javascript",
    name: "JavaScript",
    category: "programming",
    description: "A general-purpose scripting language used across web, backend, and tooling.",
  },
  html_css: {
    id: "html_css",
    name: "HTML/CSS",
    category: "web",
    description: "The structural and visual layer of the web — semantic markup and styling.",
  },
  git: {
    id: "git",
    name: "Git",
    category: "engineering",
    description: "Version control for tracking changes, collaborating, and shipping software safely.",
  },
  statistics: {
    id: "statistics",
    name: "Statistics",
    category: "math",
    description:
      "Descriptive and inferential statistics — mean, variance, distributions, hypothesis testing, and interpreting data.",
  },
  probability: {
    id: "probability",
    name: "Probability",
    category: "math",
    description:
      "The mathematics of uncertainty — events, conditional probability, Bayes' rule, and random variables.",
  },
  numpy: {
    id: "numpy",
    name: "NumPy",
    category: "programming",
    description:
      "Numerical computing in Python — N-dimensional arrays, vectorized operations, and linear algebra.",
  },
  pandas: {
    id: "pandas",
    name: "Pandas",
    category: "data",
    description:
      "Data manipulation and analysis in Python — DataFrames, cleaning, grouping, and aggregation.",
  },
  "machine-learning": {
    id: "machine-learning",
    name: "Machine Learning",
    category: "ai",
    description:
      "Building predictive models — regression, classification, training, evaluation, and the core ML workflow.",
  },
  "model-evaluation": {
    id: "model-evaluation",
    name: "Model Evaluation",
    category: "ai",
    description:
      "Measuring model quality — train/test splits, cross-validation, metrics, overfitting, and bias-variance tradeoff.",
  },
  "deep-learning": {
    id: "deep-learning",
    name: "Deep Learning",
    category: "ai",
    description:
      "Neural networks and deep architectures — backpropagation, CNNs, RNNs, transformers, and training deep models.",
  },
  "data-processing": {
    id: "data-processing",
    name: "Data Processing",
    category: "data",
    description:
      "Cleaning, transforming, and preparing messy real-world data for modeling and analysis.",
  },
  react: {
    id: "react",
    name: "React",
    category: "web",
    description: "A component-based UI library for building interactive web interfaces.",
  },
  api: {
    id: "api",
    name: "API Development",
    category: "engineering",
    description: "Designing and building HTTP APIs, REST conventions, and service integration.",
  },
  "data-visualization": {
    id: "data-visualization",
    name: "Data Visualization",
    category: "data",
    description: "Communicating insights visually — charts, dashboards, and storytelling with data.",
  },
  "data-analysis": {
    id: "data-analysis",
    name: "Data Analysis",
    category: "data",
    description: "Applying statistics and computation to answer questions from real datasets.",
  },
  algorithms: {
    id: "algorithms",
    name: "Algorithms & Data Structures",
    category: "programming",
    description: "Foundational problem-solving structures and techniques used in technical interviews and engineering.",
  },
  "mlops": {
    id: "mlops",
    name: "MLOps / Deployment",
    category: "engineering",
    description: "Shipping and operating ML systems — pipelines, model serving, monitoring, and iteration.",
  },
};

export const SKILL_DEPENDENCIES: { from: string; to: string }[] = [
  { from: "python", to: "numpy" },
  { from: "python", to: "pandas" },
  { from: "statistics", to: "probability" },
  { from: "statistics", to: "data-analysis" },
  { from: "probability", to: "machine-learning" },
  { from: "statistics", to: "machine-learning" },
  { from: "numpy", to: "machine-learning" },
  { from: "pandas", to: "machine-learning" },
  { from: "sql", to: "data-processing" },
  { from: "pandas", to: "data-processing" },
  { from: "machine-learning", to: "model-evaluation" },
  { from: "machine-learning", to: "deep-learning" },
  { from: "model-evaluation", to: "deep-learning" },
  { from: "machine-learning", to: "mlops" },
  { from: "deep-learning", to: "mlops" },
  { from: "python", to: "algorithms" },
  { from: "javascript", to: "react" },
  { from: "html_css", to: "react" },
  { from: "react", to: "api" },
];

export const ROLE_SKILLS: Record<string, string[]> = {
  "software-developer": ["python", "javascript", "algorithms", "git", "sql", "api"],
  "full-stack-developer": ["javascript", "react", "html_css", "api", "sql", "git", "python"],
  "data-analyst": ["sql", "python", "data-analysis", "statistics", "data-visualization", "pandas"],
  "data-scientist": ["python", "statistics", "probability", "pandas", "numpy", "machine-learning", "data-processing", "data-visualization"],
  "machine-learning-engineer": [
    "python",
    "sql",
    "statistics",
    "probability",
    "numpy",
    "pandas",
    "machine-learning",
    "model-evaluation",
    "deep-learning",
    "data-processing",
    "git",
  ],
  "ai-engineer": [
    "python",
    "statistics",
    "probability",
    "machine-learning",
    "model-evaluation",
    "deep-learning",
    "mlops",
    "git",
    "api",
  ],
};

export const ROLE_REQUIREMENTS: Record<
  string,
  { skillId: string; requiredLevel: number; priority: "critical" | "high" | "medium" | "low"; reason: string }[]
> = {
  "machine-learning-engineer": [
    { skillId: "python", requiredLevel: 4, priority: "critical", reason: "Primary language used for model implementation and data work throughout the ML workflow." },
    { skillId: "sql", requiredLevel: 3, priority: "medium", reason: "Most production data lives in relational stores; you will reach for SQL constantly." },
    { skillId: "statistics", requiredLevel: 4, priority: "critical", reason: "A core mathematical foundation for understanding data, sampling, and model behavior." },
    { skillId: "probability", requiredLevel: 4, priority: "critical", reason: "Underpins ML algorithms, Bayesian thinking, and uncertainty in predictions." },
    { skillId: "numpy", requiredLevel: 3, priority: "high", reason: "Vectorized numerical computation is the substrate of all Python ML code." },
    { skillId: "pandas", requiredLevel: 3, priority: "high", reason: "Used daily for cleaning, exploring, and shaping datasets before modeling." },
    { skillId: "machine-learning", requiredLevel: 4, priority: "critical", reason: "The core skill of the role — selection, training, and tuning of models." },
    { skillId: "model-evaluation", requiredLevel: 4, priority: "critical", reason: "An ML Engineer must rigorously measure models and avoid overfitting." },
    { skillId: "deep-learning", requiredLevel: 3, priority: "high", reason: "Modern ML increasingly relies on neural approaches for complex problems." },
    { skillId: "data-processing", requiredLevel: 3, priority: "high", reason: "Real-world data is messy; cleaning and feature preparation are most of an ML engineer's job." },
    { skillId: "git", requiredLevel: 3, priority: "medium", reason: "Required to collaborate on any software or ML team." },
  ],
  "software-developer": [
    { skillId: "python", requiredLevel: 4, priority: "critical", reason: "Core backend and scripting language in most software roles." },
    { skillId: "javascript", requiredLevel: 4, priority: "high", reason: "Expected for web-facing software and modern tooling." },
    { skillId: "algorithms", requiredLevel: 4, priority: "critical", reason: "Core engineering problem-solving and interview requirement." },
    { skillId: "git", requiredLevel: 4, priority: "high", reason: "Non-negotiable collaboration tool for software teams." },
    { skillId: "sql", requiredLevel: 3, priority: "medium", reason: "Most applications persist and query relational data." },
    { skillId: "api", requiredLevel: 4, priority: "high", reason: "Software today is built around interacting with and building services." },
  ],
  "full-stack-developer": [
    { skillId: "javascript", requiredLevel: 4, priority: "critical", reason: "The language shared across the entire stack." },
    { skillId: "react", requiredLevel: 4, priority: "critical", reason: "Most demanded frontend library for building interfaces." },
    { skillId: "html_css", requiredLevel: 4, priority: "high", reason: "Foundation of every interface you will build." },
    { skillId: "api", requiredLevel: 4, priority: "critical", reason: "Building and consuming services connects frontend to backend." },
    { skillId: "sql", requiredLevel: 3, priority: "high", reason: "Persisting and reading application data." },
    { skillId: "git", requiredLevel: 4, priority: "high", reason: "Required for collaborating on any shipped product." },
    { skillId: "python", requiredLevel: 3, priority: "medium", reason: "Frequently used for backend and scripting." },
  ],
  "data-analyst": [
    { skillId: "sql", requiredLevel: 4, priority: "critical", reason: "The primary tool for pulling and shaping business data." },
    { skillId: "python", requiredLevel: 3, priority: "high", reason: "Modern analysts use Python for analysis and automation." },
    { skillId: "data-analysis", requiredLevel: 4, priority: "critical", reason: "The core discipline of the role." },
    { skillId: "statistics", requiredLevel: 3, priority: "high", reason: "Needed to interpret data and report meaningful findings." },
    { skillId: "data-visualization", requiredLevel: 4, priority: "critical", reason: "Communicating insights clearly is the analyst's core output." },
    { skillId: "pandas", requiredLevel: 3, priority: "high", reason: "Standard Python tool for data manipulation." },
  ],
  "data-scientist": [
    { skillId: "python", requiredLevel: 4, priority: "critical", reason: "The working language of data science." },
    { skillId: "statistics", requiredLevel: 4, priority: "critical", reason: "The mathematical foundation for modeling and inference." },
    { skillId: "probability", requiredLevel: 4, priority: "critical", reason: "Needed to reason about models and uncertainty." },
    { skillId: "pandas", requiredLevel: 4, priority: "high", reason: "Used daily for data access and exploration." },
    { skillId: "numpy", requiredLevel: 4, priority: "high", reason: "Foundation of numeric computing in Python." },
    { skillId: "machine-learning", requiredLevel: 4, priority: "critical", reason: "Building predictive models is the heart of the role." },
    { skillId: "data-processing", requiredLevel: 4, priority: "high", reason: "Scientific rigour demands clean, reproducible data work." },
    { skillId: "data-visualization", requiredLevel: 3, priority: "medium", reason: "Explaining findings visually is part of the scientist's job." },
  ],
  "ai-engineer": [
    { skillId: "python", requiredLevel: 4, priority: "critical", reason: "The dominant language across AI frameworks." },
    { skillId: "statistics", requiredLevel: 4, priority: "critical", reason: "Foundation for evaluating models and designing experiments." },
    { skillId: "probability", requiredLevel: 4, priority: "critical", reason: "Essential for probabilistic systems and uncertainty." },
    { skillId: "machine-learning", requiredLevel: 4, priority: "critical", reason: "Core modeling skill of the role." },
    { skillId: "model-evaluation", requiredLevel: 4, priority: "critical", reason: "Rigorous evaluation separates good AI engineers from guessing." },
    { skillId: "deep-learning", requiredLevel: 4, priority: "critical", reason: "Neural approaches dominate modern AI engineering." },
    { skillId: "mlops", requiredLevel: 4, priority: "high", reason: "Shipping and operating model-backed products." },
    { skillId: "git", requiredLevel: 3, priority: "medium", reason: "Collaboration on AI product teams." },
    { skillId: "api", requiredLevel: 4, priority: "high", reason: "AI systems are exposed to users through services." },
  ],
};

export const ROLES: Record<string, { id: string; label: string; description: string }> = {
  "software-developer": { id: "software-developer", label: "Software Developer", description: "Build and maintain applications, APIs, and systems." },
  "full-stack-developer": { id: "full-stack-developer", label: "Full Stack Developer", description: "Own interface and backend for complete web products." },
  "data-analyst": { id: "data-analyst", label: "Data Analyst", description: "Turn raw data into decisions and clear reporting." },
  "data-scientist": { id: "data-scientist", label: "Data Scientist", description: "Model data to find patterns and predict outcomes." },
  "machine-learning-engineer": { id: "machine-learning-engineer", label: "Machine Learning Engineer", description: "Engineer, evaluate, and ship machine learning systems." },
  "ai-engineer": { id: "ai-engineer", label: "AI Engineer", description: "Build products powered by modern AI and LLMs." },
};