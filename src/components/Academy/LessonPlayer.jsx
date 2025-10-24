import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Settings,
  ChevronLeft, ChevronRight, Check, Lock, BookOpen,
  Download, MessageCircle, Star, Menu, X, CheckCircle
} from 'lucide-react';

const LessonPlayer = ({ courseId, lessonId, user }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [completedLessons, setCompletedLessons] = useState([1, 2, 3]);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  const videoRef = useRef(null);

  // Datos del curso y lecciones
  const course = {
    id: 1,
    title: 'Fundamentos de Comunicación Angelical',
    instructor: 'María Luz Angelical',
    progress: 35,
    curriculum: [
      {
        id: 1,
        title: 'Introducción a los Ángeles',
        lessons: [
          { id: 1, title: 'Bienvenida al Curso', duration: '5:30', videoUrl: '', completed: true },
          { id: 2, title: '¿Qué son los Ángeles?', duration: '12:45', videoUrl: '', completed: true },
          { id: 3, title: 'Jerarquía Angelical', duration: '18:20', videoUrl: '', completed: true },
          { id: 4, title: 'Los Arcángeles Principales', duration: '22:15', videoUrl: '', completed: false },
          { id: 5, title: 'Tu Ángel Guardián Personal', duration: '15:40', videoUrl: '', completed: false },
          { id: 6, title: 'Quiz: Conociendo a los Ángeles', duration: '10 min', type: 'quiz', completed: false }
        ]
      },
      {
        id: 2,
        title: 'Preparación para la Conexión',
        lessons: [
          { id: 7, title: 'Creando tu Espacio Sagrado', duration: '16:30', videoUrl: '', completed: false },
          { id: 8, title: 'Limpieza Energética Básica', duration: '14:20', videoUrl: '', completed: false },
          { id: 9, title: 'Protección Espiritual', duration: '18:45', videoUrl: '', completed: false },
          { id: 10, title: 'Herramientas y Cristales', duration: '12:10', videoUrl: '', completed: false }
        ]
      },
      {
        id: 3,
        title: 'Técnicas de Comunicación',
        lessons: [
          { id: 11, title: 'Meditación Guiada: Primer Contacto', duration: '25:30', videoUrl: '', completed: false },
          { id: 12, title: 'Escritura Automática Angelical', duration: '19:45', videoUrl: '', completed: false },
          { id: 13, title: 'Interpretando Señales', duration: '16:20', videoUrl: '', completed: false }
        ]
      }
    ]
  };

  useEffect(() => {
    // Encontrar la lección actual
    let found = null;
    for (const section of course.curriculum) {
      found = section.lessons.find(l => l.id === parseInt(lessonId));
      if (found) {
        setCurrentLesson({ ...found, sectionTitle: section.title });
        break;
      }
    }
  }, [lessonId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const markAsComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
      // Aquí iría la llamada a la API para guardar el progreso
    }
  };

  const goToNextLesson = () => {
    // Lógica para ir a la siguiente lección
    const allLessons = course.curriculum.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      window.location.href = `/academy/course/${courseId}/lesson/${nextLesson.id}`;
    }
  };

  const goToPreviousLesson = () => {
    const allLessons = course.curriculum.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      window.location.href = `/academy/course/${courseId}/lesson/${prevLesson.id}`;
    }
  };

  if (!currentLesson) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-purple-400 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-white font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-400">{currentLesson.sectionTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{course.progress}% completado</span>
            </div>

            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white hover:text-purple-400 transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {/* Placeholder Video */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <span className="text-6xl">👼</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentLesson.title}</h3>
              <p className="text-white/80 mb-6">Duración: {currentLesson.duration}</p>
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center mx-auto transition-colors"
              >
                <Play className="ml-1" size={32} />
              </button>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 330)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration || 330)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Speed Control */}
                <div className="relative group">
                  <button className="text-white hover:text-purple-400 transition-colors text-sm font-semibold">
                    {playbackSpeed}x
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => changeSpeed(speed)}
                        className={`block w-full px-4 py-2 text-sm text-left hover:bg-purple-600 transition-colors ${
                          playbackSpeed === speed ? 'text-purple-400' : 'text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <button className="text-white hover:text-purple-400 transition-colors">
                  <Settings size={20} />
                </button>

                <button className="text-white hover:text-purple-400 transition-colors">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <button
            onClick={goToPreviousLesson}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <BookOpen size={18} />
              <span>Notas</span>
            </button>

            <button
              onClick={markAsComplete}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                completedLessons.includes(currentLesson.id)
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <CheckCircle size={18} />
              <span>{completedLessons.includes(currentLesson.id) ? 'Completada' : 'Marcar como completada'}</span>
            </button>
          </div>

          <button
            onClick={goToNextLesson}
            className="flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors"
          >
            <span>Siguiente</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar - Curriculum */}
      <div className={`w-96 bg-gray-800 border-l border-gray-700 flex flex-col transition-all ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      } md:translate-x-0`}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Contenido del Curso</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{completedLessons.length} de {course.curriculum.flatMap(s => s.lessons).length} completadas</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.curriculum.map((section, sectionIndex) => (
            <div key={section.id} className="border-b border-gray-700">
              <div className="p-4 bg-gray-750">
                <h4 className="text-white font-semibold text-sm">
                  Sección {sectionIndex + 1}: {section.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{section.lessons.length} lecciones</p>
              </div>

              <div>
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => window.location.href = `/academy/course/${courseId}/lesson/${lesson.id}`}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-700 transition-colors border-l-4 ${
                      lesson.id === currentLesson.id
                        ? 'border-purple-600 bg-gray-700'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {completedLessons.includes(lesson.id) ? (
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      ) : lesson.type === 'quiz' ? (
                        <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                          <Star size={14} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <Play size={12} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        lesson.id === currentLesson.id ? 'text-purple-400' : 'text-white'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-400">{lesson.duration}</p>
                    </div>

                    {lesson.id === currentLesson.id && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-xl">
              👩‍🏫
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{course.instructor}</p>
              <p className="text-xs text-gray-400">Instructor</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            <MessageCircle size={16} />
            <span>Hacer una Pregunta</span>
          </button>
        </div>
      </div>

      {/* Notes Panel */}
      {showNotes && (
        <div className="absolute bottom-20 right-4 w-96 bg-white rounded-2xl shadow-2xl p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Mis Notas</h3>
            <button
              onClick={() => setShowNotes(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escribe tus notas aquí..."
            className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
          />
          <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
            Guardar Notas
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonPlayer;

