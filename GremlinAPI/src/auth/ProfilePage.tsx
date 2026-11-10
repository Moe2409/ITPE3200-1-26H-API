  import { useNavigate } from 'react-router-dom';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { Quiz } from '../types/quiz';
  import * as QuizService from '../quizzes/QuizService'

  const API_URL = import.meta.env.VITE_API_URL;

  interface ProfilePageProps {
    currentUsername: string; 
  }

  export default function ProfilePage({ currentUsername }: ProfilePageProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: allQuizzes, isLoading, isError } = useQuery({
      queryKey: ['quizzes'],
      queryFn: QuizService.fetchQuizzes,
    });

    const userQuizzes = allQuizzes?.filter((quiz) => quiz.user?.userName === currentUsername);

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

    if (isLoading) return <p>Loading profile...</p>;
    if (isError) return <p>Failed to load quizzes.</p>;

    return (
      <div id="center">
        <h2>My Profile</h2>
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
      </div>
    );
  }