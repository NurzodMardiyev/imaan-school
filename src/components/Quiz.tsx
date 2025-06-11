import { useEffect, useState } from "react";
import questionsData from "../questions.json";
import { useUser } from "./Context";
import { sendToTelegram } from "../sentTelegram/sendToTelegram";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Imaan logo.svg";

// Tiplar
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

type AnswerFeedback = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
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
  const [globalTimeLeft, setGlobalTimeLeft] = useState(25 * 60);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback[]>([]);

  const { user } = useUser();
  const navigate = useNavigate();

  function getLevel(score: number) {
    if (score <= 10) return "Beginner (A1)";
    if (score <= 20) return "Elementary (A2)";
    if (score <= 30) return "Pre-Intermediate (B1-)";
    if (score <= 35) return "Intermediate (B1)";
    return "Upper-Intermediate (B2)";
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    // Tasodifiy 40ta savolni tanlab olish
    const selected = [...questionsData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 40)
      .map((q: Question) => {
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
    setShuffledQuestions(selected);
  }, []);

  useEffect(() => {
    const level = getLevel(score);
    if (user && showResult && !hasSentResult) {
      const feedbackText = answerFeedback
        .map((f, index) => {
          return `${index + 1}. ${f.question}\nTanlandi: ${
            f.selectedAnswer
          }\nTo‘g‘ri javob: ${f.correctAnswer} → ${f.isCorrect ? "✅" : "❌"}`;
        })
        .join("\n\n");

      sendToTelegram({
        name: user.name,
        phone: user.phone,
        score: score,
        level: level,
        feedback: feedbackText,
      });
      setHasSentResult(true);
    }
  }, [user, showResult, hasSentResult, score, answerFeedback]);

  useEffect(() => {
    if (showResult) return;

    const globalTimer = setInterval(() => {
      setGlobalTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(globalTimer);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(globalTimer);
  }, [showResult]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    const current = shuffledQuestions[currentIndex];
    const isCorrect = selectedAnswer === current.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswerFeedback((prev) => [
      ...prev,
      {
        question: current.question,
        selectedAnswer: selectedAnswer || "Tanlanmadi",
        correctAnswer: current.correctAnswer,
        isCorrect: isCorrect,
      },
    ]);

    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
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
            {user?.name} sizning natijangiz: <strong>{score}</strong> /{" "}
            {shuffledQuestions.length}
          </p>
          <p className="text-xl">
            Sizning darajangiz: <strong>{getLevel(score)}</strong>
          </p>
        </div>
      </div>
    );
  }

  const current = shuffledQuestions[currentIndex];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#001033] px-4">
      <div className="w-full md:w-[80%] bg-[#001033] text-white p-6 rounded space-y-4 relative">
        <div className="flex md:justify-between justify-center md:absolute md:top-[-160px] top-[-60px] ">
          <div className="flex mx-auto w-full justify-center">
            <img
              src={logo}
              alt=""
              className="w-32 md:w-40 flex mb-[30px] md:mb-auto"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold flex justify-between items-center">
          <span>
            {currentIndex + 1}. {current.question}
          </span>
          <span className="text-[#ff0000] md:text-xl text-lg font-bold">
            {formatTime(globalTimeLeft)}
          </span>
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
          onClick={handleNext}
          className={`mt-4 px-6 py-2 rounded-md transition-all font-semibold
            bg-[#00E1FF] text-black hover:opacity-90 disabled:opacity-50`}
        >
          Keyingi savol →
        </button>
      </div>
    </div>
  );
}
