import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QuizForm from './QuizForm';
import { Quiz } from '../types/quiz';
import * as QuizService from './QuizService';

export default function QuizUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const QuizQuery = useQuery({
    queryKey: ['Quizs', id],
    queryFn: () => QuizService.fetchQuizById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: QuizService.updateQuiz,
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