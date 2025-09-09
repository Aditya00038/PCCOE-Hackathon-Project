// src/data/diseaseData.js
const diseases = [
  // Existing
  {
    name: "Acne",
    symptoms: [
      { symptom: "Pimples", keywords: ["acne", "pimple", "zit", "blemish"], priority: "Low" },
      { symptom: "Blackheads", keywords: ["blackhead", "comedone", "clogged pores"], priority: "Low" },
    ],
  },
  {
    name: "Asthma",
    symptoms: [
      { symptom: "Shortness of Breath", keywords: ["dyspnea", "wheezing", "breathing difficulty"], priority: "High" },
      { symptom: "Coughing", keywords: ["cough", "persistent cough", "dry cough"], priority: "Medium" },
    ],
  },
  {
    name: "Diabetes",
    symptoms: [
      { symptom: "Frequent Urination", keywords: ["polyuria", "increased urination", "frequent peeing"], priority: "Medium" },
      { symptom: "Excessive Thirst", keywords: ["polydipsia", "increased thirst", "dry mouth"], priority: "Medium" },
      { symptom: "Fatigue", keywords: ["tiredness", "lack of energy", "lethargy"], priority: "Low" },
    ],
  },
  {
    name: "Hypertension",
    symptoms: [
      { symptom: "High Blood Pressure", keywords: ["hypertension", "elevated bp", "high bp"], priority: "High" },
      { symptom: "Headache", keywords: ["head pain", "migraine", "pressure in head"], priority: "Medium" },
      { symptom: "Dizziness", keywords: ["lightheaded", "vertigo", "dizzy"], priority: "Medium" },
    ],
  },
  {
    name: "Flu",
    symptoms: [
      { symptom: "Fever", keywords: ["fever", "high temperature", "pyrexia"], priority: "Medium" },
      { symptom: "Cough", keywords: ["cough", "persistent cough", "dry cough"], priority: "Medium" },
      { symptom: "Sore Throat", keywords: ["throat pain", "scratchy throat", "pharyngitis"], priority: "Low" },
      { symptom: "Body Ache", keywords: ["muscle pain", "myalgia", "body pain"], priority: "Low" },
    ],
  },
  {
    name: "COVID-19",
    symptoms: [
      { symptom: "Fever", keywords: ["fever", "high temperature", "pyrexia"], priority: "High" },
      { symptom: "Dry Cough", keywords: ["cough", "persistent cough", "dry cough"], priority: "High" },
      { symptom: "Loss of Taste or Smell", keywords: ["anosmia", "ageusia", "loss of smell", "loss of taste"], priority: "High" },
      { symptom: "Shortness of Breath", keywords: ["breathless", "difficulty breathing", "dyspnea"], priority: "High" },
    ],
  },

  // New
  {
    name: "Pneumonia",
    symptoms: [
      { symptom: "Chest Pain", keywords: ["chest pain", "tight chest"], priority: "High" },
      { symptom: "High Fever", keywords: ["fever", "chills", "rigors"], priority: "High" },
      { symptom: "Cough with Phlegm", keywords: ["wet cough", "sputum"], priority: "Medium" },
    ],
  },
  {
    name: "Migraine",
    symptoms: [
      { symptom: "Severe Headache", keywords: ["migraine", "headache", "head throbbing"], priority: "Medium" },
      { symptom: "Light Sensitivity", keywords: ["photophobia", "bright light sensitivity"], priority: "Low" },
      { symptom: "Nausea", keywords: ["vomiting", "queasy"], priority: "Low" },
    ],
  },
  {
    name: "Tuberculosis",
    symptoms: [
      { symptom: "Persistent Cough > 2 weeks", keywords: ["long cough", "tb cough"], priority: "High" },
      { symptom: "Blood in Sputum", keywords: ["hemoptysis", "blood cough"], priority: "High" },
      { symptom: "Night Sweats", keywords: ["sweating at night", "tb sweats"], priority: "Medium" },
    ],
  },
  {
    name: "Heart Attack",
    symptoms: [
      { symptom: "Chest Pain", keywords: ["chest tightness", "crushing pain"], priority: "High" },
      { symptom: "Radiating Arm Pain", keywords: ["left arm pain", "jaw pain"], priority: "High" },
      { symptom: "Shortness of Breath", keywords: ["breathlessness", "dyspnea"], priority: "High" },
    ],
  },
  {
    name: "Stroke",
    symptoms: [
      { symptom: "Sudden Weakness", keywords: ["paralysis", "arm weakness"], priority: "High" },
      { symptom: "Speech Difficulty", keywords: ["slurred speech", "aphasia"], priority: "High" },
      { symptom: "Vision Problems", keywords: ["blurred vision", "loss of vision"], priority: "High" },
    ],
  },
  {
    name: "Chickenpox",
    symptoms: [
      { symptom: "Itchy Rash", keywords: ["chickenpox", "rash", "spots"], priority: "Low" },
      { symptom: "Fever", keywords: ["fever", "pyrexia"], priority: "Medium" },
      { symptom: "Fatigue", keywords: ["tiredness", "lethargy"], priority: "Low" },
    ],
  },
  {
    name: "Malaria",
    symptoms: [
      { symptom: "High Fever", keywords: ["malarial fever", "rigors", "chills"], priority: "High" },
      { symptom: "Sweating", keywords: ["excess sweat", "night sweat"], priority: "Medium" },
      { symptom: "Shivering", keywords: ["chills", "cold shakes"], priority: "Medium" },
    ],
  },
  {
    name: "Appendicitis",
    symptoms: [
      { symptom: "Abdominal Pain", keywords: ["lower right pain", "stomach pain"], priority: "High" },
      { symptom: "Nausea", keywords: ["vomiting", "queasiness"], priority: "Medium" },
      { symptom: "Loss of Appetite", keywords: ["no hunger", "reduced appetite"], priority: "Low" },
    ],
  },
  {
    name: "Kidney Stones",
    symptoms: [
      { symptom: "Severe Flank Pain", keywords: ["side pain", "back pain"], priority: "High" },
      { symptom: "Blood in Urine", keywords: ["hematuria", "red urine"], priority: "Medium" },
      { symptom: "Frequent Urination", keywords: ["urinating often"], priority: "Medium" },
    ],
  },
  {
    name: "Anemia",
    symptoms: [
      { symptom: "Fatigue", keywords: ["weakness", "low energy"], priority: "Low" },
      { symptom: "Pale Skin", keywords: ["paleness", "light skin"], priority: "Medium" },
      { symptom: "Shortness of Breath", keywords: ["dyspnea", "breathless"], priority: "Medium" },
    ],
  },
  {
    name: "Allergic Rhinitis",
    symptoms: [
      { symptom: "Sneezing", keywords: ["allergy sneeze", "hay fever"], priority: "Low" },
      { symptom: "Runny Nose", keywords: ["rhinorrhea", "watery nose"], priority: "Low" },
      { symptom: "Itchy Eyes", keywords: ["allergic eyes", "red eyes"], priority: "Low" },
    ],
  },
  {
    name: "Gastroenteritis",
    symptoms: [
      { symptom: "Diarrhea", keywords: ["loose stools", "watery stool"], priority: "Medium" },
      { symptom: "Vomiting", keywords: ["nausea", "queasiness"], priority: "Medium" },
      { symptom: "Abdominal Cramps", keywords: ["stomach cramps", "belly ache"], priority: "Medium" },
    ],
  },
  {
    name: "Arthritis",
    symptoms: [
      { symptom: "Joint Pain", keywords: ["arthritis pain", "joint stiffness"], priority: "Medium" },
      { symptom: "Swelling", keywords: ["joint swelling", "inflammation"], priority: "Medium" },
      { symptom: "Limited Movement", keywords: ["stiff joints", "difficulty moving"], priority: "Low" },
    ],
  },
  {
    name: "Depression",
    symptoms: [
      { symptom: "Sadness", keywords: ["low mood", "depressed"], priority: "Medium" },
      { symptom: "Loss of Interest", keywords: ["no motivation", "apathy"], priority: "Medium" },
      { symptom: "Sleep Problems", keywords: ["insomnia", "excess sleep"], priority: "Low" },
    ],
  },
  {
    name: "Anxiety Disorder",
    symptoms: [
      { symptom: "Excessive Worry", keywords: ["anxious", "restless"], priority: "Medium" },
      { symptom: "Palpitations", keywords: ["heart racing", "fast heartbeat"], priority: "High" },
      { symptom: "Sweating", keywords: ["nervous sweat"], priority: "Low" },
    ],
  },
];

export default diseases;
