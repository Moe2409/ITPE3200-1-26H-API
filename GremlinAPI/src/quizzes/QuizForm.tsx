import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { Quiz, Question, IdentityUser } from '../types/quiz';

interface QuizFormProps {
  onQuizChanged: (newItem: Quiz) => Promise<unknown> | void;
  id: number;
  initialValues?: Partial<Quiz>;
  error?: string | null;
  submitting?: boolean;
}

export default function QuizForm({ onQuizChanged, id, initialValues}: QuizFormProps) {
  const [title, setTitle] = useState<string>(initialValues?.title ?? '');
  const [user, setUser] = useState<IdentityUser | null | undefined>(initialValues?.user);
  
  // Initialize with at least one question containing two default options if none exist
  const initialQuestions = initialValues?.questions && initialValues.questions.length > 0
    ? initialValues.questions
    : [{id: 0, title: '', answerAlternatives: ['', ''], correctAnswerIndices: [0] }];

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // Navigate back one step in history
  };

  // --- Question Handlers ---
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {id: 0,  title: '', answerAlternatives: ['', ''], correctAnswerIndices: [0] }
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      alert("A quiz must have at least 1 question.");
      return;
    }
    setQuestions(questions.filter((_, index) => index !== qIndex));
  };

  const handleQuestionTitleChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], title: value };
    setQuestions(updated);
  };

  // --- Option Handlers ---
  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    const currentOptions = updated[qIndex].answerAlternatives || [];
    updated[qIndex] = {
      ...updated[qIndex],
      answerAlternatives: [...currentOptions, '']
    };
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    const currentOptions = updated[qIndex].answerAlternatives || [];
    
    if (currentOptions.length <= 2) {
      alert("A question must have at least 2 answer options.");
      return;
    }

    const newOptions = currentOptions.filter((_, index) => index !== oIndex);
    
    // Adjust correct answer indices following removal
    const newCorrectIndices = (updated[qIndex].correctAnswerIndices || [])
      .filter(idx => idx !== oIndex)
      .map(idx => idx > oIndex ? idx - 1 : idx);

    updated[qIndex] = {
      ...updated[qIndex],
      answerAlternatives: newOptions,
      correctAnswerIndices: newCorrectIndices
    };
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const currentOptions = [...(updated[qIndex].answerAlternatives || [])];
    currentOptions[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], answerAlternatives: currentOptions };
    setQuestions(updated);
  };

  const handleToggleCorrectAnswer = (qIndex: number, oIndex: number, checked: boolean) => {
    const updated = [...questions];
    let currentCorrect = [...(updated[qIndex].correctAnswerIndices || [])];

    if (checked) {
      if (!currentCorrect.includes(oIndex)) {
        currentCorrect.push(oIndex);
      }
    } else {
      currentCorrect = currentCorrect.filter(idx => idx !== oIndex);
    }

    updated[qIndex] = { ...updated[qIndex], correctAnswerIndices: currentCorrect };
    setQuestions(updated);
  };

  // --- Form Submission ---
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const quiz: Quiz = { id, title, user, questions };

    try {
      await onQuizChanged(quiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h2 className="mb-4">Create New Quiz</h2>

          <Form onSubmit={handleSubmit} id="quizForm">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Quiz Title */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form.Group controlId="formQuizTitle" className="mb-3">
                  <Form.Label className="fw-bold">
                    Quiz Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    placeholder="e.g. World History Trivia"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Dynamic Questions Container */}
            <div id="questionsContainer">
              {questions.map((q, qIndex) => (
                <Card key={qIndex} className="mb-4 shadow-sm question-card" data-q-index={qIndex}>
                  <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 question-title-text">Question {qIndex + 1}</h5>
                    <Button
                      type="button"
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveQuestion(qIndex)}
                    >
                      Remove Question
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Question Prompt <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        size="lg"
                        placeholder="Enter your question here…"
                        value={q.title ?? ''}
                        onChange={(e) => handleQuestionTitleChange(qIndex, e.target.value)}
                        required
                      />
                    </Form.Group>

                    <h6 className="fw-bold mt-4 mb-2">
                      Answer Alternatives <small className="text-muted fw-normal">(Check all correct answers)</small>
                    </h6>

                    <div className="options-container">
                      {(q.answerAlternatives || []).map((opt, oIndex) => {
                        const isChecked = (q.correctAnswerIndices || []).includes(oIndex);
                        return (
                          <div key={oIndex} className="input-group mb-2 option-row">
                            <div className="input-group-text">
                              <input
                                className="form-check-input mt-0 option-checkbox"
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleToggleCorrectAnswer(qIndex, oIndex, e.target.checked)}
                                title="Check if this option is correct"
                              />
                            </div>
                            <Form.Control
                              type="text"
                              className="option-text"
                              placeholder={`Option ${oIndex + 1}`}
                              value={opt}
                              onChange={(e) => handleOptionTextChange(qIndex, oIndex, e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="outline-danger"
                              onClick={() => handleRemoveOption(qIndex, oIndex)}
                            >
                              &times;
                            </Button>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="outline-secondary"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleAddOption(qIndex)}
                    >
                      + Add Option
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Action Controls */}
            <div className="d-flex justify-content-between mb-5">
              <Button
                type="button"
                id="addQuestionBtn"
                variant="outline-primary"
                size="lg"
                onClick={handleAddQuestion}
              >
                + Add Question
              </Button>
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onCancel}
                  className="me-2"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Quiz'}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}