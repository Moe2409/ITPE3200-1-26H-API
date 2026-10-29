import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Container from 'react-bootstrap/Container'
import { AuthProvider } from './auth/AuthContext' // 1. Import your AuthProvider
import HomePage from './home/HomePage'
import QuizListPage from './quizzes/QuizListPage'
import QuizCreatePage from './quizzes/QuizCreatePage'
import QuizUpdatePage from './quizzes/QuizUpdatePage'
import ProfilePage from './auth/ProfilePage'
import LoginPage from './auth/LoginPage'
import NavMenu from './shared/NavMenu'
import './App.css'

const queryClient = new QueryClient()

export default function App() {
  const currentUsername = "UserName";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> {/* 2. Wrap everything in AuthProvider */}
        <Router> {/* 3. Wrap Router around NavMenu and Routes so router hooks work everywhere */}
          <Container>
            <NavMenu />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/items" element={<QuizListPage />} />
              <Route path="/quizcreate" element={<QuizCreatePage />} />
              <Route path="/quizupdate/:id" element={<QuizUpdatePage />} />
              <Route path="/profile" element={<ProfilePage currentUsername={currentUsername} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}