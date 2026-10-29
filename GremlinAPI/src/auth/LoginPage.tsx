  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
  import { useAuth } from './AuthContext';

  export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);
      try {
        await login({ username, password });
        navigate('/quizzes');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Invalid username or password.');
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Container className="mt-5" style={{ maxWidth: '500px' }}>
        <h2>Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>
      </Container>
    );
  }