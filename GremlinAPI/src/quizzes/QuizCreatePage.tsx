import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import QuizForm from './QuizForm';
import { Quiz } from '../types/quiz';
import * as QuizService from './QuizService';


export default function QuizCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // gets the SAME instance from App.tsx, not a new one

  const mutation = useMutation({
    mutationFn: QuizService.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Quizzes'] });
      navigate('/Quizzes'); // go to the QuizListPage
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