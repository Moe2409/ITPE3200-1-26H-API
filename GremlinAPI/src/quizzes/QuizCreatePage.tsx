import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import QuizForm from './QuizForm';
import { Quiz } from '../types/quiz';

const API_URL = import.meta.env.VITE_API_URL;

async function createQuiz(newQuiz: Quiz): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newQuiz),
  });
  if (!response.ok) {
    throw new Error(`Failed to create Quiz (status ${response.status})`);
  }
  return response.json();
}

export default function QuizCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // gets the SAME instance from App.tsx, not a new one

  const mutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Quizs'] });
      navigate('/Quizs'); // go to the QuizListPage
    },
  });

  return (
    <QuizForm
      id={0}
      onQuizChanged={(Quiz) => mutation.mutateAsync(Quiz)}
      error={mutation.error instanceof Error ? mutation.error.message : null}
      submitting={mutation.isPending}
    />
  );
}