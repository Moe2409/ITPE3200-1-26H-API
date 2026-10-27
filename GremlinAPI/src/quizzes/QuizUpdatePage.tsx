import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QuizForm from './QuizForm';
import { Quiz } from '../types/quiz';
const API_URL = import.meta.env.VITE_API_URL;

async function fetchQuiz(id: string): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Quiz');
  }
  return response.json();
}

async function updateQuiz(Quiz: Quiz): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/${Quiz.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Quiz),
  });
  if (!response.ok) {
    throw new Error(`Failed to update Quiz (status ${response.status})`);
  }
  return response.json();
}

export default function QuizUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const QuizQuery = useQuery({
    queryKey: ['Quizs', id],
    queryFn: () => fetchQuiz(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Quizzes'] });
      navigate('/Quizzes');
    },
  });

  if (QuizQuery.isLoading) return <p>Loading...</p>;
  if (QuizQuery.isError) return <p>Failed to load Quiz</p>;
  if (!QuizQuery.data) return <p>No Quiz found</p>;

  return (
    <div>
      <h2>Update Quiz</h2>
      <QuizForm
        key={QuizQuery.data?.id ?? 'loading'}
        onQuizChanged={(Quiz) => mutation.mutateAsync(Quiz)}
        id={QuizQuery.data.id}
        initialValues={QuizQuery.data}
        error={mutation.error instanceof Error ? mutation.error.message : null}
        submitting={mutation.isPending}
      />
    </div>
  );
}