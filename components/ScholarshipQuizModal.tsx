
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { ScholarshipQuestion } from '../types';

interface ScholarshipQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: ScholarshipQuestion[];
  onComplete: (isWinner: boolean) => void;
  winChance: number;
}

export const ScholarshipQuizModal: React.FC<ScholarshipQuizModalProps> = ({ isOpen, onClose, questions, onComplete, winChance }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsFinished(false);
      setIsWinner(false);
    }
  }, [isOpen]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setCorrectAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        // Determine winner based on score and chance
        const scorePercentage = (correctAnswers + (answerIndex === currentQuestion.correctAnswerIndex ? 1 : 0)) / questions.length;
        const randomChance = Math.random();
        // Higher score increases win probability, up to the max winChance
        if (randomChance < (winChance * scorePercentage)) {
            setIsWinner(true);
        }
        setIsFinished(true);
      }
    }, 1500);
  };

  const handleFinish = () => {
    onComplete(isWinner);
    onClose();
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) return 'bg-space-border hover:bg-space-blue';
    if (index === currentQuestion.correctAnswerIndex) return 'bg-nova-green text-white';
    if (index === selectedAnswer) return 'bg-red-500 text-white';
    return 'bg-space-border opacity-50';
  };

  return (
    <Modal isOpen={isOpen} onClose={handleFinish} title="Monthly Scholarship Quiz">
      {isFinished ? (
        <div className="text-center">
            <i className={`text-7xl mb-4 ${isWinner ? 'fas fa-graduation-cap text-star-yellow' : 'fas fa-times-circle text-cyber-pink'}`}></i>
            <h3 className="text-2xl font-bold">{isWinner ? 'Congratulations!' : 'Application Submitted'}</h3>
            <p className="text-lg mt-2">{isWinner ? 'You have won the $5,000 Tech Scholarship!' : 'Thank you for participating.'}</p>
            <p className="text-gray-400 mt-2">{isWinner ? 'Our team will contact you within 48 hours with the details.' : 'Winners for this month have been selected. Please try again next month!'}</p>
            <button onClick={handleFinish} className="mt-6 w-full bg-cyber-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition">
                Close
            </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-300">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-sm font-bold text-blue-400">Scholarship: Tech Innovators</span>
            </div>
            <div className="w-full bg-space-border rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.5s' }}></div>
            </div>
          </div>
          <h3 className="text-lg font-bold my-4 text-center min-h-[56px]">{currentQuestion.question}</h3>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerClick(index)} disabled={isAnswered} className={`p-3 rounded-lg text-left transition ${getButtonClass(index)}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
