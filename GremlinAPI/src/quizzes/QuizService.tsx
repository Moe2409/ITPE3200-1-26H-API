import { Quiz } from "../types/quiz";

const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  'Content-Type': 'application/json',
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }
  return response.json();
}

export async function fetchQuizzes(): Promise<Quiz[]> {
 const response = await fetch(`${API_URL}/api/quiz/all`);
 return handleResponse<Quiz[]>(response);
}

export async function fetchQuizById(id: string): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/${id}`);
  return handleResponse<Quiz>(response);
}

export async function createQuiz(quiz: Quiz): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(quiz),
  });
  return handleResponse<Quiz>(response);
}

export async function updateQuiz(quiz: Quiz): Promise<Quiz> {
  const response = await fetch(`${API_URL}/api/quiz/${quiz.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(quiz),
  });
  return handleResponse<Quiz>(response);
}

export async function deleteQuiz(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/quiz/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete item (status ${response.status})`);
  }
}

