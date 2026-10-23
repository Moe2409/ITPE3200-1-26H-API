import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

async function deleteQuiz(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/quiz/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete quiz (status ${response.status})`);
  }
}  

export default function QuizListPage() {
  const { data: quizzes = [], isLoading, error, refetch } = useQuery<Quiz[], Error>({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
  });

  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["quizzes"]});
    },
  });
  
  const handleQuizDeleted = (id: number) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the quiz ${id}?`);
    if(confirmDelete) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div>
      <QuizTable quizzes={quizzes} onQuizDeleted={handleQuizDeleted} />
      <Link to="/quizcreate" className="btn btn-secondary mt-3">Add New Quiz</Link>
    </div>
  );
  
};