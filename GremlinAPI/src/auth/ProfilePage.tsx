import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import * as QuizService from '../quizzes/QuizService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId: string = user?.sub ?? "";

  // Fetch created quizzes
  const { data: allQuizzes, isLoading: quizzesLoading, isError: quizzesError } = useQuery({
    queryKey: ['quizzes'],
    queryFn: QuizService.fetchQuizzes,
  });

  // Fetch quiz history
  const { data: quizHistory, isLoading: historyLoading, isError: historyError } = useQuery({
    queryKey: ['quizHistory', currentUserId],
    queryFn: () => QuizService.fetchUserHistory(currentUserId),
    enabled: !!currentUserId,
  });

  const userQuizzes = allQuizzes?.filter((quiz) => quiz.user?.id === currentUserId);

  const deleteMutation = useMutation({
    mutationFn: QuizService.deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
    onError: (error: Error) => {
      alert(`Error deleting quiz: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteMutation.mutate(id);
    }
  };

  // Loading State
  if (quizzesLoading || historyLoading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted fw-medium">Loading your profile...</p>
      </Container>
    );
  }

  // Error State
  if (quizzesError || historyError) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="rounded-3 shadow-sm">
          Failed to load profile data. Please refresh the page or try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* --- Profile Header --- */}
      <Card className="border-0 shadow-sm rounded-4 mb-5 bg-light">
        <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="text-start">
            <h2 className="fw-bold mb-1">{user?.name || 'My Profile'}</h2>
            <p className="text-muted mb-0">
              <span className="fw-semibold text-dark">{user?.email || ''}</span>
            </p>
          </div>
          <div className="d-flex gap-3">
            <div className="bg-white px-4 py-2 rounded-3 shadow-sm text-center">
              <div className="fs-4 fw-bold text-primary">{userQuizzes?.length || 0}</div>
              <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Created</small>
            </div>
            <div className="bg-white px-4 py-2 rounded-3 shadow-sm text-center">
              <div className="fs-4 fw-bold text-success">{quizHistory?.length || 0}</div>
              <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Completed</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* --- Section 1: Created Quizzes --- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">My Quizzes</h4>
        <Button variant="primary" size="sm" className="rounded-pill px-3" onClick={() => navigate('/quiz/create')}>
          + Create New Quiz
        </Button>
      </div>

      {!userQuizzes || userQuizzes.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5 mb-5">
          <Card.Body>
            <p className="text-muted mb-3">You haven't created any quizzes yet.</p>
            <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => navigate('/quiz/create')}>
              Create Your First Quiz
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4 mb-5">
          {userQuizzes.map((quiz) => (
            <Col key={quiz.id}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="d-flex flex-column justify-content-between p-4">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="secondary" className="bg-opacity-10 text-secondary rounded-pill">
                        ID: #{quiz.id}
                      </Badge>
                    </div>
                    <Card.Title className="fw-bold fs-5 mb-2">{quiz.title}</Card.Title>
                  </div>

                  <div className="d-flex gap-2 mt-4 pt-3 border-top">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100 rounded-3"
                      onClick={() => navigate(`/quiz/update/${quiz.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100 rounded-3"
                      onClick={() => handleDelete(quiz.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* --- Section 2: Quiz History / Attempt Log --- */}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-3">Quiz History</h4>
      </div>
      {!quizHistory || quizHistory.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body>
            <p className="text-muted mb-0">You haven't taken any quizzes yet.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light text-uppercase fs-7 text-secondary">
                <tr>
                  <th className="ps-4 py-3">Quiz Title</th>
                  <th className="py-3">Score</th>
                  <th className="py-3">Performance</th>
                  <th className="pe-4 py-3 text-end">Completed On</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((historyItem: any, index: number) => {
                  const score = historyItem.score ?? 0;
                  const maxScore = historyItem.maxPossibleScore || 1;
                  const percentage = Math.round((score / maxScore) * 100);
                  
                  // Color-code badge based on score percentage
                  let badgeVariant = 'danger';
                  if (percentage >= 80) badgeVariant = 'success';
                  else if (percentage >= 50) badgeVariant = 'warning';

                  return (
                    <tr key={historyItem.id || index}>
                      <td className="ps-4 py-3 fw-semibold text-dark">
                        {historyItem.quiz?.title || `Quiz #${historyItem.quizId}`}
                      </td>
                      <td className="py-3">
                        <span className="fw-bold">{score}</span>
                        <span className="text-muted"> / {historyItem.maxPossibleScore}</span>
                      </td>
                      <td className="py-3">
                        <Badge bg={badgeVariant} className="rounded-pill px-3 py-1">
                          {percentage}%
                        </Badge>
                      </td>
                      <td className="pe-4 py-3 text-end text-muted small">
                        {new Date(historyItem.completedAt || Date.now()).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </Container>
  );
}