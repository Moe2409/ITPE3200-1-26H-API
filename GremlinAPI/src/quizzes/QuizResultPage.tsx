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

  // resultQuery.data er history-objektet ditt
  const history = resultQuery.data;
  const quiz = history.quiz;
  const questions = quiz?.questions || [];

  const score = history.score;
  const maxScore = history.maxPossibleScore;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4 bg-light">
            <div className="card-body text-center py-4">
              <h2 className="mb-2">Quiz Results</h2>
              <h4 className="text-muted mb-3">{quiz?.title || 'Quiz Summary'}</h4>
              <div className="display-4 fw-bold text-primary mb-2">
                {score} / {maxScore}
              </div>
              <p className="fs-5 text-secondary mb-0">
                Score: {percentage}% | Completed: {new Date(history.completed_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* {questions.map((question: any, i: number) => {
            const answerAlternatives = question.answerAlternatives || [];
            const correctIndices = question.correctAnswerIndices || [];

            return (
              <div key={question.id || i} className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Question {i + 1}</h5>
                  <span className="badge bg-light text-dark">
                    {correctIndices.length > 1 ? 'Select all that apply' : 'Select one answer'}
                  </span>
                </div>
                
                <div className="card-body">
                  <p className="card-text fw-bold fs-5">{question.title}</p>

                  <div className="list-group mt-3">
                    {answerAlternatives.map((alternative: string, j: number) => {
                      const isActualCorrect = correctIndices.includes(j);

                      // Marker fasitsvarene tydelig med grønt
                      let itemClass = 'list-group-item d-flex align-items-center ps-4';
                      if (isActualCorrect) {
                        itemClass += ' list-group-item-success fw-bold';
                      }

                      return (
                        <div key={j} className={itemClass}>
                          <label className="form-check-label w-100 py-2">
                            {alternative}
                            {isActualCorrect && <span className="float-end badge bg-success">Correct Answer</span>}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })} */}

          <div className="d-flex justify-content-center mb-5">
            <button 
              type="button" 
              onClick={() => navigate('/Quizzes')} 
              className="btn btn-primary btn-lg px-5"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}