import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as QuizService from './QuizService';

export default function QuizResultPage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const resultQuery = useQuery({
    queryKey: ['QuizResults', id],
    queryFn: () => QuizService.fetchQuizResultById(id!),
    enabled: !!id,
  });

  if (resultQuery.isLoading) return <p className="text-center mt-5">Loading results...</p>;
  if (resultQuery.isError) return <p className="text-center mt-5 text-danger">Failed to load quiz results</p>;
  if (!resultQuery.data) return <p className="text-center mt-5">No results found</p>;

  const history = resultQuery.data;
  const quiz = history.quiz;
  const historyAnswers = history.historyAnswers || [];

  const score = history.score;
  const maxScore = history.maxPossibleScore;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          
          {/* Result Summary Card */}
          <div className="card border-0 shadow-lg rounded-4 mb-5 overflow-hidden">
            <div className="card-body text-center p-5 bg-white">
              <div className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3">
                Quiz Results
              </div>
              <h2 className="fw-bold text-dark mb-2">{quiz?.title || 'Quiz Summary'}</h2>
              <p className="text-muted small mb-4">Completed on {new Date(history.completed_at).toLocaleString()}</p>
              
              <div className="display-3 fw-bolder text-primary mb-3">
                {score} <span className="fs-1 text-muted fw-normal">/ {maxScore}</span>
              </div>

              <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                  <div className="progress rounded-pill" style={{ height: '10px' }}>
                    <div 
                      className={`progress-bar rounded-pill ${percentage >= 80 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <span className="fs-5 fw-medium text-secondary">
                Overall Score: <strong className="text-dark">{percentage}%</strong>
              </span>
            </div>
          </div>

          {/* Detailed Question Breakdown Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="fw-bold text-dark m-0">Question Breakdown</h3>
            {historyAnswers.length > 0 && (
              <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2">
                {historyAnswers.length} Questions Total
              </span>
            )}
          </div>
          
          {historyAnswers.length > 0 ? (
            historyAnswers.map((historyAnswer: any, i: number) => {
              const answerIndices = historyAnswer.answerIndices || [];
              const correctIndices = historyAnswer.correctAnswerIndices || [];
              const alternatives = historyAnswer.answerAlternatives || [];

              // Exact match check for multiple-choice correctness
              const sortedUser = [...answerIndices].sort((a, b) => a - b);
              const sortedCorrect = [...correctIndices].sort((a, b) => a - b);
              const isCorrect = sortedUser.length === sortedCorrect.length && 
                                sortedUser.every((val, idx) => val === sortedCorrect[idx]);

              return (
                <div 
                  key={historyAnswer.id || i} 
                  className={`card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-start border-5 ${isCorrect ? 'border-success' : 'border-danger'}`}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <h5 className="fw-bold text-dark mb-0">
                        <span className="text-muted fw-normal me-1">#</span> {historyAnswer.title || historyAnswer.questionTitle || `Question ${i + 1}`}
                      </h5>
                      {isCorrect ? (
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2 fw-semibold">
                          Correct
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 fw-semibold">
                          Incorrect
                        </span>
                      )}
                    </div>

                    {alternatives.length > 0 && (
                      <ul className="list-group list-group-flush rounded-3 overflow-hidden mt-3 gap-2 border-0">
                        {alternatives.map((alternative: string, j: number) => {
                          const isUserChoice = answerIndices.includes(j);
                          const isCorrectChoice = correctIndices.includes(j);

                          let itemClass = "bg-light text-secondary border-0";

                          if (isCorrectChoice && isUserChoice) {
                            // Chosen & Correct
                            itemClass = "bg-success-subtle text-success-emphasis border border-success";
                          } else if (isCorrectChoice && !isUserChoice) {
                            // Unchosen & Correct (Missed answer highlighted differently)
                            itemClass = "bg-white text-success border border-2 border-success border-opacity-50";
                          } else if (isUserChoice && !isCorrectChoice) {
                            // Chosen & Incorrect
                            itemClass = "bg-danger-subtle text-danger-emphasis border border-danger-subtle";
                          }

                          return (
                            <li key={j} className={`list-group-item ${itemClass} rounded-3 p-3 d-flex justify-content-between align-items-center`}>
                              <span className="fw-medium">{alternative}</span>
                              <div className="d-flex gap-2">
                                {isUserChoice && isCorrectChoice && (
                                  <span className="badge bg-success rounded-pill px-2 py-1 small">Your Choice</span>
                                )}
                                {isUserChoice && !isCorrectChoice && (
                                  <span className="badge bg-danger rounded-pill px-2 py-1 small">Your Choice</span>
                                )}
                                {!isUserChoice && isCorrectChoice && (
                                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small">Correct Answer</span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <p className="text-muted mb-0">No detailed answers are available for this quiz attempt.</p>
            </div>
          )}

          {/* Back Button */}
          <div className="d-flex justify-content-center mt-5 mb-4">
            <button 
              type="button" 
              onClick={() => navigate('/Quizzes')} 
              className="btn btn-dark btn-lg rounded-pill px-5 shadow-sm"
            >
              Back to Quizzes
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}