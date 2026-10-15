import { useQuery } from '@tanstack/react-query';
import { Table } from 'react-bootstrap';
import React from 'react';

const API_URL = 'http://localhost:5125'

const fetchQuizzes = async () => {
  const response = await fetch(`${API_URL}/api/QuizAPI/all`);
  if (!response.ok) {
    console.error(`Fetch failed with status: ${response.status}`);
    throw new Error('Network response was not ok'); 
  }
  const data = await response.json();
  console.log('Fetched quizzes successfully:', data);
  return data;
}

const QuizListPage = () => {
  const { data: quizzes = [], isLoading, error, refetch } = useQuery({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz List</h1>
      {quizzes.map((quiz) => (
        // FIXED: quiz.id and quiz.title instead of Id and Title
        <div key={quiz.id} className="border p-4 rounded-lg shadow mb-6 bg-white">
          <h2 className="text-xl font-semibold text-blue-600">{quiz.title}</h2>
          <p className="text-sm text-gray-500 mb-3">
            {/* Make sure user properties match what ASP.NET Core Identity returns */}
            Created by: <span className="font-medium">{quiz.user?.userName ?? quiz.user?.username}</span>
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Questions ({quiz.questions?.length || 0}):</h3>
          {quiz.questions?.length > 0 ? (
            <div className="space-y-3">
              {quiz.questions.map((q, qIndex) => (
                // FIXED: q.id and q.title instead of Id and Title
                <div key={q.id} className="bg-gray-50 p-3 rounded border">
                  <p className="font-medium text-sm text-gray-900 mb-1">
                    {qIndex + 1}. {q.title}
                  </p>
                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                    {q.answerAlternatives?.map((alt, altIndex) => {
                      const isCorrect = q.correctAnswerIndices?.includes(altIndex);
                      return (
                        <li key={altIndex} className={isCorrect ? "font-semibold text-green-700" : ""}>
                          {alt} {isCorrect && "✓"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No questions available for this quiz.</p>
          )}
        </div>
      ))}
    </div>
  );
};
export default QuizListPage;