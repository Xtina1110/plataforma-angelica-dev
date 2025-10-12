import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Check } from 'lucide-react';
import { SACRED_ENVIRONMENTS } from './SacredEnvironment';

/**
 * Componente para seleccionar el ambiente sagrado
 */
const EnvironmentSelector = ({ 
  selectedEnvironment, 
  onSelectEnvironment,
  userIsPremium = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const environments = Object.values(SACRED_ENVIRONMENTS);

  const handleSelect = (envId) => {
    const env = SACRED_ENVIRONMENTS[envId];
    
    // Verificar si requiere premium
    if (env.premium && !userIsPremium) {
      // Mostrar modal de upgrade (implementar después)
      alert('Esta ambiente requiere membresía premium. ¡Actualiza para desbloquear!');
      return;
    }

    onSelectEnvironment(envId);
    setIsOpen(false);
  };

  const currentEnv = SACRED_ENVIRONMENTS[selectedEnvironment];

  return (
    <div className="relative">
      {/* Botón para abrir selector */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg backdrop-blur-sm transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-purple-100 text-sm font-medium">
          {currentEnv.nombre}
        </span>
        <svg 
          className={`w-4 h-4 text-purple-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Panel de selección */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 w-80 bg-purple-900/95 border border-purple-500/50 rounded-xl backdrop-blur-md shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-purple-100 mb-3">
                Ambientes Sagrados
              </h3>
              
              <div className="space-y-2">
                {environments.map((env) => {
                  const isSelected = env.id === selectedEnvironment;
                  const isLocked = env.premium && !userIsPremium;

                  return (
                    <motion.button
                      key={env.id}
                      onClick={() => handleSelect(env.id)}
                      disabled={isLocked}
                      className={`
                        w-full text-left p-3 rounded-lg transition-all
                        ${isSelected 
                          ? 'bg-purple-600/50 border-2 border-purple-400' 
                          : 'bg-purple-800/30 border border-purple-600/30 hover:bg-purple-700/40'
                        }
                        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      whileHover={!isLocked ? { scale: 1.02 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-purple-100 font-medium">
                              {env.nombre}
                            </h4>
                            {env.premium && (
                              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 text-xs font-medium">
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="text-purple-300 text-xs">
                            {env.descripcion}
                          </p>
                        </div>
                        
                        <div className="ml-2">
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-purple-400" />
                          ) : isSelected ? (
                            <Check className="w-5 h-5 text-purple-300" />
                          ) : null}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Nota sobre premium */}
              {!userIsPremium && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-amber-200 text-xs">
                    💎 Actualiza a Premium para desbloquear todos los ambientes sagrados
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default EnvironmentSelector;

