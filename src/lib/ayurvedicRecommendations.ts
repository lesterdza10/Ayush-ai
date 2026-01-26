// Ayurvedic recommendation engine - generates personalized health advice locally
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
  // Map answers to dosha questions
  // Questions 0,1,4,5,10 -> Vata
  // Questions 2,3,8,9,11 -> Pitta
  // Questions 1,5,6,7,9 -> Kapha
  
  const vataQuestions = [0, 1, 4, 5, 10];
  const pittaQuestions = [2, 3, 8, 11];
  const kaphaQuestions = [1, 5, 6, 7, 9];
  
  const vataScore = vataQuestions.filter(i => answers[i]).length;
  const pittaScore = pittaQuestions.filter(i => answers[i]).length;
  const kaphaScore = kaphaQuestions.filter(i => answers[i]).length;
  
  const total = vataScore + pittaScore + kaphaScore;
  
  return {
    vata: total > 0 ? Math.round((vataScore / total) * 100) : 33,
    pitta: total > 0 ? Math.round((pittaScore / total) * 100) : 33,
    kapha: total > 0 ? Math.round((kaphaScore / total) * 100) : 34,
  };
}

// Generate personalized recommendations
export function generateAyurvedicRecommendations(profileData: ProfileData): string {
  const dosha = calculateDosha(profileData.doshaAnswers);
  profileData.vata = dosha.vata;
  profileData.pitta = dosha.pitta;
  profileData.kapha = dosha.kapha;
  
  const dominantDosha = Object.keys(dosha).reduce((a, b) => 
    dosha[b as keyof typeof dosha] > dosha[a as keyof typeof dosha] ? b : a
  );

  let recommendations = `✨ YOUR PERSONALIZED AYURVEDIC HEALTH ANALYSIS\n`;
  recommendations += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  recommendations += `**Hello ${profileData.name}!**\n\n`;

  // Dosha Constitution
  recommendations += `## 🧬 YOUR DOSHA CONSTITUTION\n`;
  recommendations += `Your Ayurvedic constitution shows:\n`;
  recommendations += `• **Vata (Air/Ether):** ${dosha.vata}%\n`;
  recommendations += `• **Pitta (Fire/Water):** ${dosha.pitta}%\n`;
  recommendations += `• **Kapha (Water/Earth):** ${dosha.kapha}%\n\n`;
  recommendations += `Your dominant constitution is **${dominantDosha.toUpperCase()}**.\n\n`;

  // Daily Routine
  recommendations += `## 🌅 PERSONALIZED DAILY ROUTINE (Dinacharya)\n`;
  recommendations += getDailyroutineRecommendations(profileData, dominantDosha);

  // Dietary Recommendations
  recommendations += `## 🍽️ DIETARY RECOMMENDATIONS\n`;
  recommendations += getDietaryRecommendations(profileData, dominantDosha);

  // Yoga & Exercise
  recommendations += `## 🧘 YOGA & EXERCISE PRACTICES\n`;
  recommendations += getYogaRecommendations(profileData, dominantDosha);

  // Stress Management
  recommendations += `## 🧠 STRESS MANAGEMENT & MEDITATION\n`;
  recommendations += getStressManagementRecommendations(profileData, dominantDosha);

  // Herbal Remedies
  recommendations += `## 🌿 HERBAL REMEDIES & WELLNESS\n`;
  recommendations += getHerbalRecommendations(profileData, dominantDosha);

  // Lifestyle Adjustments
  recommendations += `## 💫 LIFESTYLE ADJUSTMENTS\n`;
  recommendations += getLifestyleRecommendations(profileData);

  // Health Score Analysis
  recommendations += `## 📊 YOUR HEALTH METRICS ANALYSIS\n`;
  recommendations += getHealthMetricsAnalysis(profileData);

  return recommendations;
}

function getDailyroutineRecommendations(data: ProfileData, dosha: string): string {
  let text = '';
  
  if (dosha === 'vata') {
    text += `As a **Vata person**, you benefit from routine and warmth:\n\n`;
    text += `**Morning:** Wake at 6:00 AM, drink warm water with lemon\n`;
    text += `**Exercise:** Gentle yoga (Yin yoga, slow flows) - best in morning\n`;
    text += `**Meals:** Eat at regular times, warm cooked foods\n`;
    text += `**Evening:** Wind down by 9:00 PM, avoid screens after 8 PM\n`;
    text += `**Best time for self-massage (Abhyanga):** Before morning shower with warm oil\n\n`;
  } else if (dosha === 'pitta') {
    text += `As a **Pitta person**, you need cooling and moderation:\n\n`;
    text += `**Morning:** Wake at 5:30 AM, cool water (not ice)\n`;
    text += `**Exercise:** Moderate intensity, best during cooler hours (early morning or evening)\n`;
    text += `**Meals:** Eat in peaceful environments, avoid spicy foods\n`;
    text += `**Evening:** Relaxing activities, gentle meditation\n`;
    text += `**Best time for self-massage:** In afternoon with cooling oils (coconut)\n\n`;
  } else {
    text += `As a **Kapha person**, you need stimulation and movement:\n\n`;
    text += `**Morning:** Wake at 5:00 AM, warm lemon water to energize\n`;
    text += `**Exercise:** Vigorous yoga, running, or dancing - daily is essential\n`;
    text += `**Meals:** Eat moderately, favor light and spicy foods\n`;
    text += `**Evening:** Keep active but ensure good sleep\n`;
    text += `**Best time for self-massage:** Morning with stimulating oils (mustard)\n\n`;
  }
  
  return text;
}

function getDietaryRecommendations(data: ProfileData, dosha: string): string {
  let text = '';
  
  if (dosha === 'vata') {
    text += `**Foods to Favor:**\n`;
    text += `• Warm cooked grains: rice, wheat, oats\n`;
    text += `• Warm oils: ghee, sesame oil\n`;
    text += `• Root vegetables: carrots, beets, sweet potatoes\n`;
    text += `• Warm spices: ginger, cumin, cinnamon\n`;
    text += `• Healthy fats: avocado, nuts, seeds\n\n`;
    text += `**Foods to Limit:**\n`;
    text += `• Raw vegetables and salads\n`;
    text += `• Cold foods and drinks\n`;
    text += `• Dry foods like crackers and popcorn\n`;
    text += `• Excessive caffeine\n\n`;
    text += `**Meal Timing:** 3 meals daily at regular times, avoid skipping meals\n\n`;
  } else if (dosha === 'pitta') {
    text += `**Foods to Favor:**\n`;
    text += `• Cooling grains: basmati rice, oats, barley\n`;
    text += `• Cooling oils: coconut oil, ghee\n`;
    text += `• Leafy greens and fresh vegetables\n`;
    text += `• Mild spices: fennel, cilantro, mint\n`;
    text += `• Sweet fruits: mangoes, coconut, dates\n\n`;
    text += `**Foods to Limit:**\n`;
    text += `• Spicy and fermented foods\n`;
    text += `• Alcohol and caffeine\n`;
    text += `• Sour foods\n`;
    text += `• Heavy foods\n\n`;
    text += `**Meal Timing:** Eat largest meal at lunch, light dinner before 7 PM\n\n`;
  } else {
    text += `**Foods to Favor:**\n`;
    text += `• Light grains: millet, quinoa, corn\n`;
    text += `• Warming spices: black pepper, ginger, cayenne\n`;
    text += `• Leafy greens and light vegetables\n`;
    text += `• Legumes: lentils, mung beans\n`;
    text += `• Raw honey (in moderation)\n\n`;
    text += `**Foods to Limit:**\n`;
    text += `• Heavy oils and fried foods\n`;
    text += `• Sweet and sour foods\n`;
    text += `• Cold foods\n`;
    text += `• Excessive milk and cheese\n\n`;
    text += `**Meal Timing:** 2-3 meals daily, eat smaller portions, avoid snacking\n\n`;
  }
  
  return text;
}

function getYogaRecommendations(data: ProfileData, dosha: string): string {
  let text = '';
  
  if (dosha === 'vata') {
    text += `**Recommended Yoga Practice:**\n`;
    text += `• Style: Yin yoga, restorative yoga, grounding flows\n`;
    text += `• Duration: 30-45 minutes, 3-4 times per week\n`;
    text += `• Key poses: Child's pose, Forward folds, Legs up the wall\n`;
    text += `• Pranayama: Nadi Shodhana (alternate nostril breathing) - 5 minutes daily\n`;
    text += `• Best time: Early morning (5:30-7:00 AM)\n\n`;
  } else if (dosha === 'pitta') {
    text += `**Recommended Yoga Practice:**\n`;
    text += `• Style: Cooling flows, moon salutations, gentle vinyasa\n`;
    text += `• Duration: 45-60 minutes, 4-5 times per week\n`;
    text += `• Key poses: Cat-cow, Warrior II, Moon Salutation\n`;
    text += `• Pranayama: Sitali breathing (cooling breath) - 5-10 minutes daily\n`;
    text += `• Best time: Early morning or evening (after 6 PM)\n\n`;
  } else {
    text += `**Recommended Yoga Practice:**\n`;
    text += `• Style: Vigorous flows, power yoga, dynamic sequences\n`;
    text += `• Duration: 60 minutes, 5-6 times per week\n`;
    text += `• Key poses: Sun Salutations, Warrior poses, Inversions\n`;
    text += `• Pranayama: Bhastrika (bellows breath) - 3-5 minutes daily\n`;
    text += `• Best time: Early morning (5:30-6:30 AM) for maximum benefit\n\n`;
  }
  
  return text;
}

function getStressManagementRecommendations(data: ProfileData, dosha: string): string {
  let text = '';
  
  if (dosha === 'vata') {
    text += `**For Balance:**\n`;
    text += `• Daily meditation: 10-15 minutes of grounding practices\n`;
    text += `• Technique: Focus on a steady object or mantra\n`;
    text += `• Use grounding essential oils: sandalwood, frankincense\n`;
    text += `• Practice: Foot massage daily before bed\n`;
    text += `• Herbs: Ashwagandha and Brahmi for calm (500mg twice daily)\n\n`;
  } else if (dosha === 'pitta') {
    text += `**For Balance:**\n`;
    text += `• Daily meditation: 15-20 minutes of cooling practices\n`;
    text += `• Technique: Visualization of cool spaces or water\n`;
    text += `• Use cooling essential oils: coconut, rose, lavender\n`;
    text += `• Practice: Gentle massage with cooling oils\n`;
    text += `• Herbs: Brahmi and Shatavari for cooling (400mg twice daily)\n\n`;
  } else {
    text += `**For Balance:**\n`;
    text += `• Daily meditation: 20-30 minutes of energizing practices\n`;
    text += `• Technique: Mantra-based or visualization with action\n`;
    text += `• Use stimulating essential oils: ginger, black pepper\n`;
    text += `• Practice: Vigorous self-massage with warming oils\n`;
    text += `• Herbs: Tulsi and Guggul for energy (600mg twice daily)\n\n`;
  }
  
  return text;
}

function getHerbalRecommendations(data: ProfileData, dosha: string): string {
  let text = '';
  
  if (dosha === 'vata') {
    text += `**Beneficial Herbs:**\n`;
    text += `• Ashwagandha: 500mg twice daily (grounding)\n`;
    text += `• Brahmi: 300mg daily (calming)\n`;
    text += `• Warm herbal tea: ginger-cinnamon tea with milk before bed\n`;
    text += `• Sesame oil massage: 3x weekly for grounding\n`;
    text += `• Triphala: 1 tsp at night for gentle digestion\n\n`;
  } else if (dosha === 'pitta') {
    text += `**Beneficial Herbs:**\n`;
    text += `• Brahmi: 400mg daily (cooling)\n`;
    text += `• Shatavari: 500mg twice daily (balancing)\n`;
    text += `• Cooling herbal tea: rose and mint tea with honey\n`;
    text += `• Coconut oil massage: 3x weekly for cooling\n`;
    text += `• Amalaki: 1000mg daily for pitta balance\n\n`;
  } else {
    text += `**Beneficial Herbs:**\n`;
    text += `• Tulsi: 500mg twice daily (energizing)\n`;
    text += `• Guggul: 500mg twice daily (stimulating)\n`;
    text += `• Warming herbal tea: ginger-turmeric tea with pepper\n`;
    text += `• Mustard oil massage: 2x weekly for stimulation\n`;
    text += `• Trikatu (3 peppers): 250mg twice daily for digestion\n\n`;
  }
  
  return text;
}

function getLifestyleRecommendations(data: ProfileData): string {
  let text = `**General Wellness Tips:**\n\n`;
  
  // Sleep quality analysis
  if (data.sleepQuality < 5) {
    text += `⚠️ **Sleep Issue Detected:** Your sleep quality is low. Consider:\n`;
    text += `  • Establish consistent sleep time\n`;
    text += `  • Avoid screens 1 hour before bed\n`;
    text += `  • Use calming oils (lavender, brahmi)\n`;
    text += `  • Practice relaxation before sleep\n\n`;
  }
  
  // Stress level analysis
  if (data.stressLevel > 7) {
    text += `⚠️ **High Stress Detected:** Implement stress management:\n`;
    text += `  • Daily meditation for 15-20 minutes\n`;
    text += `  • Regular exercise or yoga\n`;
    text += `  • Breathing exercises (Pranayama)\n`;
    text += `  • Adequate rest and recreation\n\n`;
  }
  
  // Digestion analysis
  if (data.digestion === 'poor') {
    text += `⚠️ **Digestion Concern:** Improve digestive fire (Agni):\n`;
    text += `  • Eat meals at regular times\n`;
    text += `  • Avoid cold water during meals\n`;
    text += `  • Add warming spices to food\n`;
    text += `  • Take ginger tea 15 minutes before meals\n\n`;
  }
  
  // Exercise recommendation
  if (data.exercise === 'none') {
    text += `🏃 **Exercise:** Start with 20-30 minutes of light activity daily\n`;
    text += `  • Walking is excellent for beginners\n`;
    text += `  • Gradually increase intensity\n`;
    text += `  • Choose timing based on your dosha\n\n`;
  }
  
  // Water intake
  if (data.waterIntake < 6) {
    text += `💧 **Hydration:** Increase water intake to 2-3 liters daily\n`;
    text += `  • Drink warm water (not cold)\n`;
    text += `  • Add a pinch of rock salt for electrolytes\n\n`;
  }
  
  // Location-specific tips
  text += `📍 **For Your Location (${data.location}):**\n`;
  text += `  • Adapt routines to your local climate\n`;
  text += `  • Use seasonal fruits and vegetables\n`;
  text += `  • Adjust oil types based on local availability\n\n`;
  
  return text;
}

function getHealthMetricsAnalysis(data: ProfileData): string {
  let text = '';
  
  text += `Your Current Health Status:\n\n`;
  text += `**Sleep Quality:** ${data.sleepQuality}/10\n`;
  text += `${data.sleepQuality < 5 ? '⚠️ Needs improvement' : data.sleepQuality < 7 ? '⚠️ Can be better' : '✅ Good'}\n`;
  text += `• Aim for 7-9 hours daily\n`;
  text += `• Consistent sleep schedule helps\n\n`;
  
  text += `**Stress Level:** ${data.stressLevel}/10\n`;
  text += `${data.stressLevel < 4 ? '✅ Healthy' : data.stressLevel < 7 ? '⚠️ Moderate' : '⚠️ High - needs attention'}\n`;
  text += `• Regular meditation can reduce stress\n`;
  text += `• Exercise is highly beneficial\n\n`;
  
  text += `**Digestion Quality:** ${data.digestion}\n`;
  text += `• Eat warm, cooked foods\n`;
  text += `• Follow meal timing recommendations\n\n`;
  
  text += `**Appetite Level:** ${data.appetite}\n`;
  text += `• Maintain consistent eating patterns\n`;
  text += `• Eat only when hungry\n\n`;
  
  // BMI calculation
  const bmi = data.weight / ((data.height / 100) ** 2);
  text += `**BMI Status:** ${bmi.toFixed(1)}\n`;
  text += `${bmi < 18.5 ? 'Underweight - focus on nourishment' : bmi < 25 ? '✅ Healthy weight' : bmi < 30 ? 'Overweight - increase activity' : 'Obese - seek professional guidance'}\n\n`;
  
  return text;
}
