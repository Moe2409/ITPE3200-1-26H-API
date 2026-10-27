import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../types/quiz';

const API_URL = import.meta.env.VITE_API_URL;

async function fetchAllQuizzes(): Promise<Quiz[]> {
  const response = await fetch(`${API_URL}/api/quiz/all`, {
    credentials: 'include', 
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return response.json();
}

async function deleteQuiz(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/quiz/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include', // Sends authentication cookies along with the request
  });
  if (!response.ok) {
    throw new Error('Failed to delete quiz');
  }
}

interface ProfilePageProps {
  currentUsername: string; 
}

export default function ProfilePage({ currentUsername }: ProfilePageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all quizzes
  const { data: allQuizzes, isLoading, isError } = useQuery({
    queryKey: ['quizzes'],
    queryFn: fetchAllQuizzes,
  });

  // Filter so ONLY quizzes made by the current user are shown
  const userQuizzes = allQuizzes?.filter((quiz) => quiz.user?.userName === currentUsername);

  // Mutation for deleting a quiz
  const deleteMutation = useMutation({
    mutationFn: deleteQuiz,
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
    <div style={{ padding: '20px' }}>
      <h2>My Profile</h2>
      <h3>My Quizzes</h3>

      {userQuizzes?.length === 0 ? (
        <p>You haven't created any quizzes yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {userQuizzes?.map((quiz) => (
            <li
              key={quiz.id}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{quiz.title}</strong>
                <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>
                  ID: {quiz.id}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate(`/quiz/update/${quiz.id}`)}
                  style={{ padding: '6px 12px', cursor: 'pointer' }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  disabled={deleteMutation.isPending}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
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