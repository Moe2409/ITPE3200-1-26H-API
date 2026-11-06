import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QuizForm from './QuizForm';
import { Quiz, Question } from '../types/quiz';
import * as QuizService from './QuizService';

export default function TakeQuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const quizQuery = useQuery({
    queryKey: ['Quizzes', id],
    queryFn: () => QuizService.fetchQuizById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    // Sender med både quiz.id og payload til submitQuiz i QuizService
    mutationFn: (payload: { questions: { questionId: number; selectedAnswerIndices: number[] }[] }) => 
      QuizService.submitQuiz(quizQuery.data!.id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['Quizzes'] });
      console.log(data.message); // Viser evt. tilbakemelding fra backend
      navigate('/Quizzes');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const questions = quizQuery.data?.questions || [];
    
    // Bygger opp payloaden slik C#-kontrolleren forventer den ([FromBody] SubmitQuizDto)
    const payload = {
      questions: questions.map((q, i) => ({
        questionId: q.id,
        selectedAnswerIndices: formData.getAll(`question_${i}`).map(Number),
      })),
    };

    mutation.mutate(payload);
  };

  if (quizQuery.isLoading) return <p>Loading...</p>;
  if (quizQuery.isError) return <p>Failed to load Quiz</p>;
  if (!quizQuery.data) return <p>No Quiz found</p>;

  const quiz = quizQuery.data;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">{quiz.title || 'Take Quiz'}</h2>

          {mutation.isError && (
            <div className="alert alert-danger" role="alert">
              {mutation.error instanceof Error ? mutation.error.message : 'Failed to submit quiz'}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Fjernet hidden input for quizId siden ID-en nå sendes direkte i URL-en */}

            {quiz.questions.map((question, i) => (
              <div key={question.id || i} className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Question {i + 1}</h5>
                  <span className="badge bg-light text-dark">
                    {question.correctAnswerIndices.length > 1 ? 'Select all that apply' : 'Select one answer'}
                  </span>
                </div>
                
                <div className="card-body">
                  <p className="card-text fw-bold fs-5">{question.title}</p>

                  <div className="list-group mt-3">
                    {question.answerAlternatives.map((alternative, j) => {
                      const optionId = `question_${i}_option_${j}`;

                      return (
                        <div key={j} className="form-check list-group-item list-group-item-action d-flex align-items-center ps-4">
                          <input
                            className="form-check-input me-3"
                            type={question.correctAnswerIndices.length > 1 ? 'checkbox' : 'radio'}
                            id={optionId}
                            name={`question_${i}`}
                            value={j}
                          />
                          <label className="form-check-label w-100 py-2 cursor-pointer" htmlFor={optionId}>
                            {alternative}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between mb-5">
              <button 
                type="button" 
                onClick={() => navigate('/Quizzes')} 
                className="btn btn-secondary btn-lg"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success btn-lg" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>      
  );
}