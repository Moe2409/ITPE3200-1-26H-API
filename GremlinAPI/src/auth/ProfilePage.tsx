import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../types/quiz';
import * as QuizService from '../quizzes/QuizService';

const API_URL = import.meta.env.VITE_API_URL;

interface ProfilePageProps {
  currentUserId: number | string; // Added back the props interface
}

export default function ProfilePage({ currentUserId }: ProfilePageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch created quizzes
  const { data: allQuizzes, isLoading: quizzesLoading, isError: quizzesError } = useQuery({
    queryKey: ['quizzes'],
    queryFn: QuizService.fetchQuizzes,
  });

  // Fetch quiz history directly using fetch to avoid missing service export errors
  const { data: quizHistory, isLoading: historyLoading, isError: historyError } = useQuery({
    queryKey: ['quizHistory', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const response = await fetch(`${API_URL}/history/user/${currentUserId}`);
      if (!response.ok) {
        // If the endpoint doesn't exist yet, return an empty array gracefully
        if (response.status === 404) return [];
        throw new Error('Failed to fetch quiz history');
      }
      return response.json();
    },
    enabled: !!currentUserId,
  });

  const userQuizzes = allQuizzes?.filter((quiz) => quiz.user?.id === currentUserId);

  const deleteMutation = useMutation({
    mutationFn: QuizService.deleteQuiz,
    onSuccess: () => {  
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
    onError: (error) => {
      alert(`Error deleting quiz: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteMutation.mutate(id);
    }
  };

  if (quizzesLoading || historyLoading) return <p>Loading profile...</p>;
  if (quizzesError || historyError) return <p>Failed to load profile data.</p>;

  return (
    <div id="center">
      <h2>My Profile</h2>

      {/* --- Section 1: Created Quizzes --- */}
      <h3>My Quizzes</h3>
      {userQuizzes?.length === 0 ? (
        <p>You haven't created any quizzes yet.</p>
      ) : (
        <ul className="ticks">
          {userQuizzes?.map((quiz) => (
            <li key={quiz.id} className="counter">
              <div>
                <strong>{quiz.title}</strong>
                <p>ID: {quiz.id}</p>
              </div>
              <div>
                <button
                  className="counter"
                  onClick={() => navigate(`/quiz/update/${quiz.id}`)}
                >
                  Update
                </button>
                <button
                  className="counter"
                  onClick={() => handleDelete(quiz.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --- Section 2: Quiz History / Attempt Log --- */}
      <h3 style={{ marginTop: '2rem' }}>Quiz History</h3>
      {!quizHistory || quizHistory.length === 0 ? (
        <p>You haven't taken any quizzes yet.</p>
      ) : (
        <ul className="ticks">
          {quizHistory.map((historyItem: any, index: number) => (
            <li key={historyItem.id || index} className="counter">
              <div>
                <strong>{historyItem.quizTitle || `Quiz #${historyItem.quizId}`}</strong>
                <p>Score: {historyItem.score} / {historyItem.totalQuestions}</p>
                <small>Completed on: {new Date(historyItem.completedAt || Date.now()).toLocaleDateString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}