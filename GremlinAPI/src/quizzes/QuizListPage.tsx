import { useQuery } from '@tanstack/react-query';
import QuizTable from './QuizTable';
import { Quiz } from '../types/quiz';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const fetchQuizzes = async(): Promise<Quiz[]> => {
  const response = await fetch(`${API_URL}/api/quiz/all`);
  if (!response.ok) {
    console.error(`Fetch failed with status: ${response.status}`);
    throw new Error('Network response was not ok'); 
  }
  const data = await response.json();
  console.log('Fetched quizzes successfully:', data);
  return data;
}

export default function QuizListPage() {
  const { data: quizzes = [], isLoading, error, refetch } = useQuery<Quiz[], Error>({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
  });

  return (
    <div>
      <QuizTable quizzes={quizzes} />
      <Link to="/quizcreate" className="btn btn-secondary mt-3">Add New Quiz</Link>
    </div>
  );
  
};