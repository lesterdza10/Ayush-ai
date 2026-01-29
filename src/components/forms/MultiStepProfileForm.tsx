'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormSlider } from '@/components/ui/FormSlider';
import { Button } from '@/components/ui/Button';
import { StreamingRecommendations } from '@/components/ui/StreamingRecommendations';

export interface ProfileData {
  name: string; age: number; gender: string; height: number; weight: number; location: string;
  bodyType: string; appetite: string; digestion: string; sleepQuality: number; stressLevel: number;
  wakeUpTime: string; sleepTime: string; exercise: string; foodType: string; junkFoodFreq: string; waterIntake: number;
  doshaAnswers: boolean[];
}

interface MultiStepProfileFormProps {
  onSubmit: (data: ProfileData) => void;
}

const STEP_LABELS = ['Basic Info', 'Body & Health', 'Lifestyle', 'Dosha Quiz'];

const doshaQuestions = [
  'Do you often feel cold or have dry skin?', 'Are you naturally quick and creative?',
  'Do you have a strong, intense personality?', 'Do you prefer warm, cozy environments?',
  'Do you get tired easily?', 'Are you naturally calm and stable?',
  'Do you often experience bloating?', 'Do you have a fast metabolism?',
  'Do you prefer sweet tastes?', 'Are you naturally organized and disciplined?',
  'Do you have difficulty with irregular schedules?', 'Do you tend to overheat easily?',
];

export const MultiStepProfileForm: React.FC<MultiStepProfileFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '', age: 25, gender: '', height: 170, weight: 70, location: '',
    bodyType: '', appetite: '', digestion: '', sleepQuality: 5, stressLevel: 5,
    wakeUpTime: '06:00', sleepTime: '22:00', exercise: '', foodType: '', junkFoodFreq: '', waterIntake: 8,
    doshaAnswers: Array(doshaQuestions.length).fill(false),
  });

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDoshaAnswer = (index: number, value: boolean) => {
    const newAnswers = [...formData.doshaAnswers];
    newAnswers[index] = value;
    handleInputChange('doshaAnswers', newAnswers);
  };

  const handleNext = () => { if (currentStep < STEP_LABELS.length - 1) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  // --- RESTORED & FIXED SUBMIT ---
  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("Session expired. Please log in.");
        return;
    }

    // 1. Show the AI analysis view immediately
    setShowRecommendations(true);

    // 2. Backup to local storage immediately so Profile-View isn't empty
    localStorage.setItem('tempProfileData', JSON.stringify(formData));

    // 3. Trigger the actual DB save in the parent page
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tell us about yourself</h2>
            <FormInput label="Full Name" placeholder="John Doe" value={formData.name} onChange={(v) => handleInputChange('name', v)} />
            <FormInput label="Age" type="number" value={formData.age} onChange={(v) => handleInputChange('age', Number(v))} />
            <FormSelect label="Gender" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} value={formData.gender} onChange={(v) => handleInputChange('gender', v)} />
            <FormInput label="Height (cm)" type="number" value={formData.height} onChange={(v) => handleInputChange('height', Number(v))} />
            <FormInput label="Weight (kg)" type="number" value={formData.weight} onChange={(v) => handleInputChange('weight', Number(v))} />
            <FormInput label="Location" placeholder="New York" value={formData.location} onChange={(v) => handleInputChange('location', v)} />
          </motion.div>
        );
      case 1:
        return (
          <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Body & Health</h2>
            <FormSelect label="Body Type" options={[{ value: 'slim', label: 'Slim' }, { value: 'athletic', label: 'Athletic' }, { value: 'curvy', label: 'Curvy' }]} value={formData.bodyType} onChange={(v) => handleInputChange('bodyType', v)} />
            <FormSelect label="Appetite Level" options={[{ value: 'poor', label: 'Poor' }, { value: 'moderate', label: 'Moderate' }, { value: 'strong', label: 'Strong' }]} value={formData.appetite} onChange={(v) => handleInputChange('appetite', v)} />
            <FormSelect label="Digestion" options={[{ value: 'poor', label: 'Poor' }, { value: 'normal', label: 'Normal' }, { value: 'excellent', label: 'Excellent' }]} value={formData.digestion} onChange={(v) => handleInputChange('digestion', v)} />
            <FormSlider label="Sleep Quality" min={1} max={10} value={formData.sleepQuality} onChange={(v) => handleInputChange('sleepQuality', v)} />
            <FormSlider label="Stress Level" min={1} max={10} value={formData.stressLevel} onChange={(v) => handleInputChange('stressLevel', v)} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Lifestyle</h2>
            <FormInput label="Usual Wake-up Time" type="time" value={formData.wakeUpTime} onChange={(v) => handleInputChange('wakeUpTime', v)} />
            <FormInput label="Usual Sleep Time" type="time" value={formData.sleepTime} onChange={(v) => handleInputChange('sleepTime', v)} />
            <FormSelect label="Exercise Frequency" options={[{ value: 'none', label: 'None' }, { value: '2x/week', label: '2x per week' }, { value: '4x/week', label: '4x per week' }, { value: 'daily', label: 'Daily' }]} value={formData.exercise} onChange={(v) => handleInputChange('exercise', v)} />
            <FormSelect label="Primary Food Type" options={[{ value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' }, { value: 'mixed', label: 'Mixed' }]} value={formData.foodType} onChange={(v) => handleInputChange('foodType', v)} />
            <FormSelect label="Junk Food Frequency" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'rarely', label: 'Rarely' }]} value={formData.junkFoodFreq} onChange={(v) => handleInputChange('junkFoodFreq', v)} />
            <FormInput label="Daily Water Intake (liters)" type="number" value={formData.waterIntake} onChange={(v) => handleInputChange('waterIntake', Number(v))} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dosha Assessment</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {doshaQuestions.map((question, index) => (
                <div key={index} className="backdrop-blur-md bg-white dark:bg-slate-700 rounded-xl border border-cyan-300 dark:border-cyan-600 p-4 flex items-center gap-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleDoshaAnswer(index, true)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${formData.doshaAnswers[index] ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'}`}>Yes</button>
                    <button onClick={() => handleDoshaAnswer(index, false)} className={`px-4 py-2 rounded-lg font-semibold transition-all ${!formData.doshaAnswers[index] ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'}`}>No</button>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{question}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900/30 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {showRecommendations ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">Your AI Health Analysis</h1>
              <p className="text-gray-600 dark:text-gray-400">Powered by Google Gemini</p>
            </div>
            <StreamingRecommendations profileData={formData} onComplete={() => {}} />
            <Button variant="secondary" onClick={() => setShowRecommendations(false)} className="w-full mt-4">← Edit Profile</Button>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">AYUSH Health Platform</h1>
              <p className="text-gray-600 dark:text-gray-400">Create your health profile in 4 steps</p>
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={STEP_LABELS.length} stepLabels={STEP_LABELS} />
            <GlassmorphismCard className="p-8 md:p-12 mt-8">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
              <div className="flex justify-between gap-4 mt-12">
                <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0} size="lg">← Back</Button>
                {currentStep === STEP_LABELS.length - 1 ? (
                  <Button variant="primary" onClick={handleSubmit} size="lg">Analyze My Health →</Button>
                ) : (
                  <Button variant="primary" onClick={handleNext} size="lg">Next →</Button>
                )}
              </div>
            </GlassmorphismCard>
            <p className="text-center text-gray-600 mt-8">Step {currentStep + 1} of {STEP_LABELS.length}</p>
          </>
        )}
      </div>
    </div>
  );
};