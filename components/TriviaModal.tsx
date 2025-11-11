
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { TriviaQuestion } from '../types';

interface TriviaModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: TriviaQuestion[];
  onComplete: (pointsWon: number) => void;
}

export const TriviaModal: React.FC<TriviaModalProps> = ({ isOpen, onClose, questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsFinished(false);
    }
  }, [isOpen]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + currentQuestion.points);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
      }
    }, 1500); // Wait 1.5s before next question or finishing
  };

  const handleFinish = () => {
    onComplete(score);
    onClose();
  }
  
  const getButtonClass = (index: number) => {
      if (!isAnswered) {
          return 'bg-space-border hover:bg-space-blue';
      }
      if (index === currentQuestion.correctAnswerIndex) {
          return 'bg-nova-green text-white';
      }
      if (index === selectedAnswer) {
          return 'bg-red-500 text-white';
      }
      return 'bg-space-border opacity-50';
  }

  return (
    <Modal isOpen={isOpen} onClose={handleFinish} title="Astro-Trivia Challenge">
      {isFinished ? (
        <div className="text-center">
            <h3 className="text-2xl font-bold text-star-yellow">Quiz Complete!</h3>
            <p className="text-lg mt-2">You answered {score > 0 ? (questions.filter((q, i) => q.points > 0).length) : 0} out of {questions.length} questions correctly.</p>
            <div className="my-6">
                <p className="text-gray-400">Total EXP Earned</p>
                <p className="text-5xl font-bold text-nova-green animate-pulse">{score.toLocaleString()}</p>
            </div>
            <button onClick={handleFinish} className="w-full bg-cyber-pink text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition">
                Return to Game Zone
            </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-300">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-sm font-bold text-star-yellow">{currentQuestion.points} EXP</span>
            </div>
            <div className="w-full bg-space-border rounded-full h-2.5">
              <div className="bg-cyber-pink h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, transition: 'width 0.5s' }}></div>
            </div>
          </div>

          <h3 className="text-lg font-bold my-4 text-center min-h-[56px]">{currentQuestion.question}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
                className={`p-3 rounded-lg text-left transition ${getButtonClass(index)}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
