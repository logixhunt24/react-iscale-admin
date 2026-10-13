import React from 'react'
import { Route } from 'react-router-dom'
import QuizList from '../pages/quiz/QuizList'
import AddQuiz from '../pages/quiz/AddQuiz'
import QuizQuestions from '../pages/quiz/QuizQuestions'

const quizRoutes = [
  <Route key="quiz-list" path="/quiz/list/:packageId" element={<QuizList />} />,
  <Route key="quiz-add" path="/quiz/add/:packageId" element={<AddQuiz />} />,
  <Route key="quiz-questions" path="/quiz/questions/:quizId" element={<QuizQuestions />} />
]

export default quizRoutes
