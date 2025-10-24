import React, { useState, useEffect } from 'react';
import { 
  Check, X, ChevronRight, ChevronLeft, Clock, Award,
  AlertCircle, CheckCircle, XCircle, RotateCcw, Home
} from 'lucide-react';

const QuizSystem = ({ courseId, quizId, user }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);

  // Datos del quiz
  const quiz = {
    id: 1,
    title: 'Quiz: Conociendo a los Ángeles',
    description: 'Evalúa tus conocimientos sobre la jerarquía angelical y los arcángeles principales',
    courseTitle: 'Fundamentos de Comunicación Angelical',
    passingScore: 70,
    timeLimit: 600, // 10 minutos en segundos
    attempts: 3,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '¿Cuál es la función principal de los Ángeles Guardianes?',
        options: [
          'Proteger y guiar a las personas individualmente',
          'Gobernar los planetas y estrellas',
          'Transmitir mensajes entre arcángeles',
          'Custodiar los tesoros celestiales'
        ],
        correctAnswer: 0,
        explanation: 'Los Ángeles Guardianes tienen como misión principal proteger y guiar a cada persona de manera individual a lo largo de su vida.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: '¿Cuántos arcángeles principales se mencionan tradicionalmente?',
        options: [
          '3 arcángeles',
          '5 arcángeles',
          '7 arcángeles',
          '12 arcángeles'
        ],
        correctAnswer: 2,
        explanation: 'Tradicionalmente se reconocen 7 arcángeles principales: Miguel, Gabriel, Rafael, Uriel, Jofiel, Chamuel y Zadquiel.'
      },
      {
        id: 3,
        type: 'true-false',
        question: 'Los Serafines son los ángeles más cercanos a Dios en la jerarquía celestial.',
        correctAnswer: true,
        explanation: 'Correcto. Los Serafines ocupan el nivel más alto en la jerarquía angelical, estando más cerca de la presencia divina.'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: '¿Qué arcángel es conocido como el mensajero divino?',
        options: [
          'Miguel',
          'Gabriel',
          'Rafael',
          'Uriel'
        ],
        correctAnswer: 1,
        explanation: 'Gabriel es conocido como el mensajero divino, encargado de transmitir mensajes importantes de Dios a la humanidad.'
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: '¿Cuál es el color asociado con el Arcángel Miguel?',
        options: [
          'Dorado',
          'Verde',
          'Azul',
          'Rosa'
        ],
        correctAnswer: 2,
        explanation: 'El Arcángel Miguel está asociado con el color azul, que representa protección, fuerza y valentía.'
      },
      {
        id: 6,
        type: 'true-false',
        question: 'Todos los seres humanos tienen un ángel guardián asignado desde su nacimiento.',
        correctAnswer: true,
        explanation: 'Sí, según las enseñanzas angelicales, cada persona tiene un ángel guardián asignado desde el momento de su nacimiento.'
      },
      {
        id: 7,
        type: 'multiple-choice',
        question: '¿Qué arcángel es conocido como el sanador divino?',
        options: [
          'Miguel',
          'Gabriel',
          'Rafael',
          'Uriel'
        ],
        correctAnswer: 2,
        explanation: 'Rafael es conocido como el sanador divino, asociado con la curación física, emocional y espiritual.'
      },
      {
        id: 8,
        type: 'multiple-choice',
        question: '¿Cuál de estos NO es un nivel en la jerarquía angelical?',
        options: [
          'Serafines',
          'Querubines',
          'Guardianes',
          'Celestiales'
        ],
        correctAnswer: 3,
        explanation: '"Celestiales" no es un nivel reconocido en la jerarquía angelical tradicional.'
      },
      {
        id: 9,
        type: 'true-false',
        question: 'Los ángeles pueden intervenir en nuestra vida sin que lo pidamos.',
        correctAnswer: false,
        explanation: 'Generalmente, los ángeles respetan nuestro libre albedrío y necesitan que pidamos su ayuda, excepto en situaciones de peligro extremo.'
      },
      {
        id: 10,
        type: 'multiple-choice',
        question: '¿Qué significa ver repetidamente números como 111, 222, 333?',
        options: [
          'Es una coincidencia sin significado',
          'Son mensajes angelicales o señales divinas',
          'Indica un problema con tu reloj',
          'Son números de la suerte'
        ],
        correctAnswer: 1,
        explanation: 'Ver números repetidos es considerado un mensaje angelical, cada secuencia tiene un significado específico de guía y apoyo.'
      }
    ]
  };

  useEffect(() => {
    if (quizStarted && timeRemaining !== null && timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeRemaining, quizStarted, showResults]);

  const startQuiz = () => {
    setQuizStarted(true);
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const retakeQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
    setQuizStarted(false);
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit);
    }
  };

  const getQuestionStatus = (questionIndex) => {
    const question = quiz.questions[questionIndex];
    if (!showResults) {
      return answers[question.id] !== undefined ? 'answered' : 'unanswered';
    }
    return answers[question.id] === question.correctAnswer ? 'correct' : 'incorrect';
  };

  // Intro Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="text-white" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.courseTitle}</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <p className="text-gray-700 mb-4">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preguntas</p>
                  <p className="text-lg font-bold text-gray-900">{quiz.questions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiempo Límite</p>
                  <p className="text-lg font-bold text-gray-900">
                    {quiz.timeLimit ? formatTime(quiz.timeLimit) : 'Sin límite'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Puntaje Mínimo</p>
                  <p className="text-lg font-bold text-gray-900">{quiz.passingScore}%</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Intentos</p>
                  <p className="text-lg font-bold text-gray-900">{quiz.attempts}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Instrucciones:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Lee cada pregunta cuidadosamente</li>
                  <li>Puedes navegar entre preguntas antes de enviar</li>
                  <li>Asegúrate de responder todas las preguntas</li>
                  <li>El quiz se enviará automáticamente cuando se acabe el tiempo</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Comenzar Quiz
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const passed = score >= quiz.passingScore;
    const correctAnswers = quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {passed ? (
                  <CheckCircle className="text-white" size={64} />
                ) : (
                  <XCircle className="text-white" size={64} />
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {passed ? '¡Felicitaciones!' : 'Sigue Intentando'}
              </h1>
              <p className="text-xl text-gray-600">
                {passed 
                  ? 'Has aprobado el quiz exitosamente' 
                  : 'No alcanzaste el puntaje mínimo, pero puedes intentarlo de nuevo'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Tu Puntaje</p>
                <p className="text-4xl font-bold text-purple-600">{score}%</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Correctas</p>
                <p className="text-4xl font-bold text-blue-600">{correctAnswers}/{quiz.questions.length}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Puntaje Mínimo</p>
                <p className="text-4xl font-bold text-green-600">{quiz.passingScore}%</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={retakeQuiz}
                className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Reintentar Quiz
              </button>
              <button
                onClick={() => window.location.href = `/academy/course/${courseId}`}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Volver al Curso
              </button>
            </div>
          </div>

          {/* Review Answers */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Revisión de Respuestas</h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const isCorrect = answers[question.id] === question.correctAnswer;
                const userAnswer = answers[question.id];

                return (
                  <div key={question.id} className={`border-2 rounded-2xl p-6 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {isCorrect ? (
                          <Check className="text-white" size={20} />
                        ) : (
                          <X className="text-white" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">
                          Pregunta {index + 1}: {question.question}
                        </h3>

                        {question.type === 'multiple-choice' && (
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border-2 ${
                                  optIndex === question.correctAnswer
                                    ? 'border-green-500 bg-green-100'
                                    : optIndex === userAnswer && !isCorrect
                                    ? 'border-red-500 bg-red-100'
                                    : 'border-gray-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {optIndex === question.correctAnswer && (
                                    <Check className="text-green-600" size={16} />
                                  )}
                                  {optIndex === userAnswer && !isCorrect && (
                                    <X className="text-red-600" size={16} />
                                  )}
                                  <span className={`text-sm ${
                                    optIndex === question.correctAnswer
                                      ? 'font-semibold text-green-900'
                                      : optIndex === userAnswer && !isCorrect
                                      ? 'font-semibold text-red-900'
                                      : 'text-gray-700'
                                  }`}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === 'true-false' && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-700">
                              Tu respuesta: <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {userAnswer ? 'Verdadero' : 'Falso'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-gray-700">
                                Respuesta correcta: <span className="font-semibold text-green-600">
                                  {question.correctAnswer ? 'Verdadero' : 'Falso'}
                                </span>
                              </p>
                            )}
                          </div>
                        )}

                        <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Explicación:</span> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Questions
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
              <p className="text-sm text-gray-600">{quiz.courseTitle}</p>
            </div>
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock size={20} />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-purple-600">
                Pregunta {currentQuestion + 1} de {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length} de {quiz.questions.length} respondidas
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h3>

            {/* Multiple Choice */}
            {question.type === 'multiple-choice' && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question.id, index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[question.id] === index
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === index
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}>
                        {answers[question.id] === index && (
                          <Check className="text-white" size={16} />
                        )}
                      </div>
                      <span className={`${
                        answers[question.id] === index
                          ? 'text-purple-900 font-semibold'
                          : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* True/False */}
            {question.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(question.id, true)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    answers[question.id] === true
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className={`${
                      answers[question.id] === true ? 'text-green-600' : 'text-gray-400'
                    }`} size={32} />
                    <span className={`font-semibold ${
                      answers[question.id] === true ? 'text-green-900' : 'text-gray-700'
                    }`}>
                      Verdadero
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleAnswer(question.id, false)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    answers[question.id] === false
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <XCircle className={`${
                      answers[question.id] === false ? 'text-red-600' : 'text-gray-400'
                    }`} size={32} />
                    <span className={`font-semibold ${
                      answers[question.id] === false ? 'text-red-900' : 'text-gray-700'
                    }`}>
                      Falso
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>

            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    index === currentQuestion
                      ? 'bg-purple-600 text-white'
                      : getQuestionStatus(index) === 'answered'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Enviar Quiz
                <CheckCircle size={20} />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Siguiente
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded"></div>
                <span className="text-gray-600">Respondida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-gray-600">Sin responder</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Enviar Quiz Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSystem;

