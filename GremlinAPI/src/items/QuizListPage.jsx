import { Table } from 'react-bootstrap';

import React from 'react';

const QuizListPage = () => {
  // Mock data 
  const quizzes = [
    {
      Id: 1,
      Title: "HarryPotterFood",
      User: {
        UserName: "Harry_potter",
        Email: "harry.potter@hogwarts.co.uk",
        EmailConfirmed: true
      },
      Questions: [
        {
          Id: 1,
          TypeId: 1,
          Title: "What is Harry Potter's favorite flavor of Bertie Bott's Every Bottle Bean?",
          AnswerAlternatives: ["Earwax", "Sprout", "Chocolate", "Every flavor means *every* flavor"],
          CorrectAnswerIndices: [3]
        },
        {
          Id: 2,
          TypeId: 1,
          Title: "Which Hogwarts house has a ghost known as the Fat Friar?",
          AnswerAlternatives: ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"],
          CorrectAnswerIndices: [2]
        },
        {
          Id: 3,
          TypeId: 1,
          Title: "What type of creature is Aragog, Hagrid's pet spider?",
          AnswerAlternatives: ["Acromantula", "Basilisk", "Thestral", "Hippogriff"],
          CorrectAnswerIndices: [0]
        },
        {
          Id: 4,
          TypeId: 1,
          Title: "What is the core of Harry Potter's wand?",
          AnswerAlternatives: ["Dragon heartstring", "Phoenix feather", "Unicorn hair", "Thestral tail hair"],
          CorrectAnswerIndices: [1]
        },
        {
          Id: 5,
          TypeId: 1,
          Title: "Who would Harry consider a friend after book 1?",
          AnswerAlternatives: ["Hermoine", "Hagrid", "Draco", "Ron", "Snape"],
          CorrectAnswerIndices: [0, 1, 3]
        }
      ]
    },
    {
      Id: 2,
      Title: "Hamburger",
      User: {
        UserName: "Jean_Luc_Picard",
        Email: "J.L.Picard@ufp.org",
        EmailConfirmed: true
      },
      Questions: []
    }
  ];

  
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz List</h1>
      {quizzes.map((quiz) => (
        <div key={quiz.Id} className="border p-4 rounded-lg shadow mb-6 bg-white">
          <h2 className="text-xl font-semibold text-blue-600">{quiz.Title}</h2>
          <p className="text-sm text-gray-500 mb-3">
            Created by: <span className="font-medium">{quiz.User.UserName}</span> ({quiz.User.Email})
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Questions ({quiz.Questions.length}):</h3>
          {quiz.Questions.length > 0 ? (
            <div className="space-y-3">
              {quiz.Questions.map((q, qIndex) => (
                <div key={q.Id} className="bg-gray-50 p-3 rounded border">
                  <p className="font-medium text-sm text-gray-900 mb-1">
                    {qIndex + 1}. {q.Title}
                  </p>
                  <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                    {q.AnswerAlternatives.map((alt, altIndex) => {
                      const isCorrect = q.CorrectAnswerIndices.includes(altIndex);
                      return (
                        <li key={altIndex} className={isCorrect ? "font-semibold text-green-700" : ""}>
                          {alt} {isCorrect && "✓"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No questions available for this quiz.</p>
          )}
        </div>
      ))}
    </div>
  );
};
export default QuizListPage;