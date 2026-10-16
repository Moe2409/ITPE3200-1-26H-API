import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Container from 'react-bootstrap/Container'
import HomePage from './home/HomePage'
import QuizListPage from './quizzes/QuizListPage'
import NavMenu from './shared/NavMenu'
import './App.css'

const queryClient = new QueryClient()

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <Container>
    <NavMenu />
        <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/items" element={<QuizListPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    </Container>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
