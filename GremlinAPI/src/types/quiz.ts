export interface AuthUser {
  id: string;
  userName?: string | null;
  email?: string | null;
  [key: string]: any; // Allows other ASP.NET Core identity fields if present
}

export interface User {
    sub: string; // Subject (username)
    email: string;
    nameid: string; // User ID
    jti: string;
    iat: number;
    exp: number;
    iss: string;
    aud:string;
}

export interface Question {
  id: number;
  quiz_id?: number | null;
  type_id?: number | null;
  title?: string | null;
  answerAlternatives: string[];
  correctAnswerIndices: number[];
}

export interface Quiz {
  id: number;
  user?: AuthUser | null;
  title?: string | null;
  questions: Question[];
}