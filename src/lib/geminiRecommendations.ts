import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProfileData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  location: string;
  bodyType: string;
  appetite: string;
  digestion: string;
  sleepQuality: number;
  stressLevel: number;
  wakeUpTime: string;
  sleepTime: string;
  exercise: string;
  foodType: string;
  junkFoodFreq: string;
  waterIntake: number;
  doshaAnswers: boolean[];
  vata?: number;
  pitta?: number;
  kapha?: number;
}

// Calculate dosha from answers (Ayurvedic constitution)
function calculateDosha(answers: boolean[]): { vata: number; pitta: number; kapha: number } {
  const vataQuestions = [0, 1, 4, 5, 10];
  const pittaQuestions = [2, 3, 8, 11];
  const kaphaQuestions = [1, 5, 6, 7, 9];

  const vataScore = vataQuestions.filter((i) => answers[i]).length;
  const pittaScore = pittaQuestions.filter((i) => answers[i]).length;
  const kaphaScore = kaphaQuestions.filter((i) => answers[i]).length;

  const total = vataScore + pittaScore + kaphaScore;

  return {
    vata: total > 0 ? Math.round((vataScore / total) * 100) : 33,
    pitta: total > 0 ? Math.round((pittaScore / total) * 100) : 33,
    kapha: total > 0 ? Math.round((kaphaScore / total) * 100) : 34,
  };
}

// Build context for Gemini from profile data
function buildProfileContext(profileData: ProfileData): string {
  const dosha = calculateDosha(profileData.doshaAnswers);
  profileData.vata = dosha.vata;
  profileData.pitta = dosha.pitta;
  profileData.kapha = dosha.kapha;

  const dominantDosha = Object.keys(dosha).reduce((a, b) =>
    dosha[b as keyof typeof dosha] > dosha[a as keyof typeof dosha] ? b : a
  );

  const bmi = profileData.weight / (profileData.height / 100) ** 2;

  return `${profileData.name}, ${profileData.age}y, ${profileData.gender} | BMI: ${bmi.toFixed(1)} | Sleep: ${profileData.sleepQuality}/10 | Stress: ${profileData.stressLevel}/10 | Digestion: ${profileData.digestion} | Exercise: ${profileData.exercise}

Dosha: Vata ${dosha.vata}% | Pitta ${dosha.pitta}% | Kapha ${dosha.kapha}% (Dominant: ${dominantDosha.toUpperCase()})`;
}

const SYSTEM_PROMPT = `You are an Ayurvedic health consultant. Provide personalized recommendations in these 8 sections:

## 🧬 DOSHA CONSTITUTION - Explain percentages and characteristics
## 🌅 DAILY ROUTINE - Personalized schedule based on dosha
## 🍽️ DIET - Foods to favor/limit, meal timing
## 🧘 YOGA & EXERCISE - Recommended practices
## 🧠 STRESS MANAGEMENT - Meditation and herbs
## 🌿 HERBAL REMEDIES - Specific herbs with dosages
## 💫 LIFESTYLE ADJUSTMENTS - Address key concerns
## 📊 HEALTH ANALYSIS - Analyze the metrics

Start with "✨ YOUR PERSONALIZED AYURVEDIC HEALTH ANALYSIS" then a dash line.
Use markdown: bold with **, bullets with •. Be specific and personal.`;

export async function generateRecommendationsWithGemini(
  profileData: ProfileData
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const profileContext = buildProfileContext(profileData);

  const userPrompt = `${profileContext}

Please provide personalized Ayurvedic health recommendations for this person. Follow the exact formatting requirements specified.`;

  const response = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: SYSTEM_PROMPT,
  });

  const text = response.response.text();
  return text;
}

// Fallback: local recommendations if Gemini fails
export { generateAyurvedicRecommendations } from './ayurvedicRecommendations';
