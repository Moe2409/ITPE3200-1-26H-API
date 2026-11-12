import { useState } from 'react';
import { Button, Table, Form, InputGroup } from 'react-bootstrap';
import { Quiz } from '../types/quiz';
import { Link } from 'react-router-dom';

interface QuizTableProps {
    quizzes: Quiz[];
    onQuizDeleted: (quizId: number) => void;
}

export default function QuizTable({ quizzes, onQuizDeleted }: QuizTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter quizzes based on title or author username (with safety checks)
    const filteredQuizzes = quizzes.filter((quiz) => {
        const titleMatch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const authorMatch = quiz.user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return titleMatch || authorMatch;
    });

    return (
        <div>
            {/* Search Bar Input */}
            <div className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search quizzes by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-pill py-2 px-3 shadow-sm border-0"
                />
            </div>

            {/* Table Card */}
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <Table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase fs-7 text-secondary">
                            <tr>
                                <th scope="col" className="py-3 ps-4">Title</th>
                                <th scope="col" className="py-3">Author</th>
                                <th scope="col" className="py-3 text-center">Questions</th>
                                <th scope="col" className="py-3 text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuizzes.length > 0 ? (
                                filteredQuizzes.map((quiz) => (
                                    <tr key={quiz.id}>
                                        <td className="ps-4 fw-semibold">
                                            <a href={`/quiz/take/${quiz.id}`} className="text-decoration-none text-dark stretched-link">
                                                {quiz.title}
                                            </a>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2 fw-bold" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>
                                                    {quiz.user?.userName ? quiz.user.userName.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <span className="text-secondary">{quiz.user?.userName ?? 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                                                {quiz.questions?.length ?? 0}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4 position-relative" style={{zIndex: '2'}}>
                                            <a href={`/quiz/take/${quiz.id}`}
                                               className="btn btn-sm btn-outline-primary px-4 rounded-pill fw-semibold">
                                                Take Quiz
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-muted">
                                        No quizzes found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}