import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import * as authService from './AuthService';
  import { useAuth } from './AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => { // Clear timeout on unmount to prevent memory leaks
        let timerId: ReturnType<typeof setTimeout>; // Fixed type annotation
        
        if (success) {
            timerId = setTimeout(() => {
                navigate('/quizzes');
            }, 2000);
        }
        return () => clearTimeout(timerId);
    }, [success, navigate]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            await authService.register(formData);

            const { username, password } = formData;
            await login({ username, password });
            setSuccess('Registration successful! Redirecting to quizzes...');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2>Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} disabled={isSubmitting || !!success} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting || !!success} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} disabled={isSubmitting || !!success} required />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting || !!success}>
                    {isSubmitting ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Registering...
                        </>
                    ) : (
                        'Register'
                    )}
                </Button>
            </Form>
        </Container>
    );
}