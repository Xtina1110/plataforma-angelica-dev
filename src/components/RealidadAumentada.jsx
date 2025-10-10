import React, { useState, useEffect, useRef } from 'react';
import { Camera, Maximize2, RotateCcw, Volume2, Download, Share2, Sparkles, Eye, Heart, Zap } from 'lucide-react';
import './RealidadAumentada.css';
import { cartasAngelicas } from '../data/cartasAngelicas';
import logo from '../assets/Logosinfondo.png';

const RealidadAumentada = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentView, setCurrentView] = useState('carta');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const views = [
    { id: 'carta', name: 'Carta', icon: Eye, description: 'Vista de la carta angelical' },
    { id: 'interpretacion', name: 'Interpretación', icon: Sparkles, description: 'Mensaje angelical detallado' },
    { id: 'meditacion', name: 'Meditación', icon: Heart, description: 'Guía de meditación' },
    { id: 'energia', name: 'Energía', icon: Zap, description: 'Visualización energética' }
  ];

  const initializeAR = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsARActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
    setIsLoading(false);
  };

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsARActive(false);
    setSelectedCard(null);
    setCurrentView('carta');
  };

  const selectCard = (card) => {
    setSelectedCard(card);
    if (audioEnabled) {
      playAngelicSound();
    }
  };

  const playAngelicSound = () => {
    console.log('🎵 Reproduciendo sonido angelical...');
  };

  const changeView = (viewId) => {
    setCurrentView(viewId);
    if (audioEnabled) {
      playAngelicSound();
    }
  };

  const captureScreenshot = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const link = document.createElement('a');
      link.download = `carta-angelical-ar-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const cardsToShow = cartasAngelicas;

  return (
    <div className="realidad-aumentada">
      <div className="tirada-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="tirada-title-section">
            <div className="title-decoration-line"></div>
            <h1 className="tirada-title">Realidad Aumentada Angelical</h1>
            <div className="title-decoration-line"></div>
          </div>
          <p className="tirada-subtitle">
            Experimenta las cartas angelicales en 3D con efectos celestiales
          </p>
        </div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {!isARActive ? (
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg" style={{ border: '1px solid rgba(200, 200, 255, 0.3)' }}>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Preparación para la Experiencia AR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cámara Lista</h4>
                    <p className="text-sm text-gray-600">
                      Asegúrate de tener buena iluminación y permitir acceso a la cámara
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Corazón Abierto</h4>
                    <p className="text-sm text-gray-600">
                      Mantén una actitud receptiva para conectar con la energía angelical
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Volume2 className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Audio Activado</h4>
                    <p className="text-sm text-gray-600">
                      Habilita el audio para escuchar los sonidos angelicales
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg" style={{ border: '1px solid rgba(200, 200, 255, 0.3)' }}>
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  Selecciona tu Carta Angelical
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  {cardsToShow.length} Cartas Angelicales disponibles para tu experiencia AR
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {cardsToShow.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => selectCard(card)}
                      className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                        selectedCard?.id === card.id ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                      }`}
                    >
                      <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 shadow-lg hover:shadow-xl border-2 transition-all ${
                        selectedCard?.id === card.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-200'
                      }`}>
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                          <img
                            src={card.imagen}
                            alt={card.nombre}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 w-6 h-6 opacity-60">
                            <img
                              src={logo}
                              alt="logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          {selectedCard?.id === card.id && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-blue-500 text-white rounded-full p-2">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-800 text-center mb-1 text-xs leading-tight line-clamp-2 h-8">{card.nombre}</h4>
                        <div className="flex items-center justify-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#6B7FF0' }}
                          ></div>
                          <span className="text-xs text-gray-500 truncate">{card.elemento}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={initializeAR}
                  disabled={isLoading || !selectedCard}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Iniciando AR...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      <span>Iniciar Experiencia AR</span>
                    </>
                  )}
                </button>
                {!selectedCard && (
                  <p className="text-sm text-gray-500 mt-2">Selecciona una carta para continuar</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-4">
                  <button
                    onClick={stopAR}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Salir AR</span>
                  </button>
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      audioEnabled
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={captureScreenshot}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Capturar</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>

              <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 md:h-[500px] object-cover"
                />

                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>

                  {selectedCard && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-xl animate-pulse"></div>

                        <div
                          className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-2 transform hover:scale-110 transition-all duration-500"
                          style={{ borderColor: '#6B7FF0' }}
                        >
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden mx-auto mb-4">
                            <img
                              src={selectedCard.imagen}
                              alt={selectedCard.nombre}
                              className="w-full h-full object-cover animate-pulse"
                            />
                            <div
                              className="absolute top-2 right-2 w-8 h-8 opacity-60"
                            >
                              <img
                                src={logo}
                                alt="logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          <h3 className="font-bold text-gray-800 text-center text-lg">{selectedCard.nombre}</h3>
                          <p className="text-sm text-gray-600 text-center mt-2">{selectedCard.elemento}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {views.map((view) => {
                  const Icon = view.icon;
                  const isActive = currentView === view.id;

                  return (
                    <button
                      key={view.id}
                      onClick={() => changeView(view.id)}
                      className={`p-4 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{view.name}</div>
                      <div className="text-xs opacity-80 mt-1">{view.description}</div>
                    </button>
                  );
                })}
              </div>

              {selectedCard && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg" style={{ border: '1px solid rgba(200, 200, 255, 0.3)' }}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {views.find(v => v.id === currentView)?.name} - {selectedCard.nombre}
                  </h3>

                  <div className="max-w-3xl mx-auto">
                    {currentView === 'carta' && (
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <img
                            src={selectedCard.imagen}
                            alt={selectedCard.nombre}
                            className="w-64 h-auto rounded-xl shadow-lg"
                          />
                          <div
                            className="absolute top-4 right-4 w-12 h-12 opacity-60"
                          >
                            <img
                              src={logo}
                              alt="logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">{selectedCard.nombre}</h4>
                        <p className="text-gray-600 leading-relaxed mb-4">{selectedCard.significado}</p>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="bg-blue-50 rounded-xl p-3">
                            <strong className="text-sm text-gray-700">Elemento:</strong>
                            <p className="text-sm text-gray-600 mt-1">{selectedCard.elemento}</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3">
                            <strong className="text-sm text-gray-700">Color:</strong>
                            <p className="text-sm text-gray-600 mt-1">{selectedCard.color}</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-3">
                            <strong className="text-sm text-gray-700">Cristal:</strong>
                            <p className="text-sm text-gray-600 mt-1">{selectedCard.cristal}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentView === 'interpretacion' && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            Mensaje Angelical
                          </h4>
                          <p className="text-gray-700 leading-relaxed">{selectedCard.mensaje}</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                          <h4 className="font-semibold text-gray-800 mb-3">Afirmación Divina</h4>
                          <p className="text-gray-700 leading-relaxed italic">"{selectedCard.afirmacion}"</p>
                        </div>
                      </div>
                    )}

                    {currentView === 'meditacion' && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-green-600" />
                            Guía de Meditación
                          </h4>
                          <p className="text-gray-700 leading-relaxed mb-4">{selectedCard.mensaje}</p>
                          <div className="flex items-center justify-center">
                            <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                              <Heart className="w-5 h-5" />
                              <span>Iniciar Meditación</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentView === 'energia' && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Energía {selectedCard.elemento}
                          </h4>
                          <div className="flex items-center justify-center mb-4">
                            <div
                              className="w-24 h-24 rounded-full animate-pulse"
                              style={{
                                backgroundColor: '#6B7FF0',
                                boxShadow: '0 0 30px rgba(107, 127, 240, 0.5)'
                              }}
                            ></div>
                          </div>
                          <p className="text-gray-700 text-center">
                            Visualiza esta energía {selectedCard.elemento.toLowerCase()} fluyendo a través de ti
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default RealidadAumentada;
