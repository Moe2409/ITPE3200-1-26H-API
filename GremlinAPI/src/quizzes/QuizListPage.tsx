import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QuizTable from './QuizTable';
import { Quiz } from '../types/quiz';
import { Link } from 'react-router-dom';
import * as QuizService from './QuizService';

export default function QuizListPage() {
  const { data: quizzes = [], isLoading, error, refetch } = useQuery<Quiz[], Error>({
    queryKey: ["quizzes"],
    queryFn: QuizService.fetchQuizzes,
  });

  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: QuizService.deleteQuiz,
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