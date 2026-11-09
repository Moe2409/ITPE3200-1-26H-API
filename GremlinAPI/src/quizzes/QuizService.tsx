import { Quiz } from "../types/quiz";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }
  return response.json();
}

export async function fetchQuizzes(): Promise<Quiz[]> {
 const response = await fetch(`${API_URL}/api/quiz/all`, {
  headers: getAuthHeaders(),
 });
 return handleResponse<Quiz[]>(response);
}

export async function fetchQuizById(id: string): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Quiz>(response);
}

export async function createQuiz(quiz: Quiz): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(quiz),
  });
  return handleResponse<Quiz>(response);
}

export async function updateQuiz(quiz: Quiz): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/${quiz.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(quiz),
  });
  return handleResponse<Quiz>(response);
}

export async function deleteQuiz(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/quiz/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete item (status ${response.status})`);
  }
}

export interface SubmitQuizPayload {
  questions: {
    questionId: number;
    selectedAnswerIndices: number[];
  }[];
}

export interface QuizSubmitResult {
  message: string;
  score: number;
  maxPossibleScore: number;
}

export async function submitQuiz(id: number | string, payload: SubmitQuizPayload): Promise<QuizSubmitResult> {
  const response = await fetch(`${API_URL}/api/quiz/${id}/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<QuizSubmitResult>(response);
}