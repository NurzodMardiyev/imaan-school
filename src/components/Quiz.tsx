import { useEffect, useState } from "react";
import questionsData from "../questions.json"; // ← yo‘ling to‘g‘ri bo‘lsin
import { useUser } from "./Context";
import { sendToTelegram } from "../sentTelegram/sendToTelegram";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

type ShuffledQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<
    ShuffledQuestion[]
  >([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasSentResult, setHasSentResult] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15);

  const { user } = useUser();

  // Shuffle variantlar
  useEffect(() => {
    const shuffled = questionsData.map((q: Question) => {
      const options = [...q.options];
      const correct = options[q.correctAnswerIndex];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return {
        id: q.id,
        question: q.question,
        options,
        correctAnswer: correct,
      };
    });
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    console.log(score);
    if (user && showResult && !hasSentResult) {
      sendToTelegram({
        name: user.name,
        phone: user.phone,
        score: score,
      });
      setHasSentResult(true);
    }
  }, [user, showResult, hasSentResult, score]);

  useEffect(() => {
    if (showResult || shuffledQuestions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleNext(); // vaqt tugadi — avtomatik keyingiga o‘t
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, [currentIndex, shuffledQuestions.length, showResult]);

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option); // faqat tanlaymiz, tekshirish emas
  };

  const handleNext = () => {
    const current = shuffledQuestions[currentIndex];
    if (selectedAnswer === current.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(15); // timer reset
    } else {
      setShowResult(true);
    }
  };

  if (shuffledQuestions.length === 0)
    return <div className="text-white">Loading...</div>;

  if (showResult) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#001033] text-white">
        <div className="bg-[#001033] text-center w-[80%] p-6 rounded">
          <h2 className="text-3xl font-bold mb-4">✅ Test yakunlandi!</h2>
          <p className="text-xl">
            {user?.name} Sizning natijangiz: <strong>{score}</strong> /{" "}
            {shuffledQuestions.length}
          </p>
        </div>
      </div>
    );
  }

  const current = shuffledQuestions[currentIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#001033] px-4">
      <div className="w-full md:w-[80%] bg-[#001033] text-white p-6 rounded space-y-4">
        <h3 className="text-xl font-semibold flex justify-between items-center">
          <span>
            {currentIndex + 1}. {current.question}
          </span>
          <span className="text-[#00E1FF] text-lg font-bold">{timeLeft}s</span>
        </h3>

        <ul className="space-y-3">
          {current.options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`cursor-pointer px-4 py-2 border rounded-md transition-all
              ${
                selectedAnswer === option
                  ? "bg-[#00E1FF] text-black font-semibold"
                  : "bg-white text-black bg-opacity-10 hover:bg-opacity-20"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>

        <button
          disabled={!selectedAnswer}
          onClick={handleNext}
          className={`mt-4 px-6 py-2 rounded-md transition-all font-semibold
            ${
              selectedAnswer
                ? "bg-[#00E1FF] text-black hover:opacity-90"
                : "bg-gray-500 text-white cursor-not-allowed"
            }`}
        >
          Keyingi savol →
        </button>
      </div>
    </div>
  );
}
