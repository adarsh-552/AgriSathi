import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer({ text, lang = 'te' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Select appropriate BCP-47 language tag
    if (lang === 'te') utterance.lang = 'te-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.9; // Slightly slower for clarity in rural agricultural context
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={handleToggleSpeak}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        isPlaying
          ? 'bg-forest-green text-white animate-pulse'
          : 'bg-green-100 text-forest-green hover:bg-green-200'
      }`}
      title="Listen to advisory (వినండి)"
    >
      {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
      <span>{isPlaying ? 'ఆపు (Stop)' : 'వినండి (Listen)'}</span>
    </button>
  );
}
