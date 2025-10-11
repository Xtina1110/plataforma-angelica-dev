import React from 'react';
import { Check, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PasswordStrengthMeter = ({ password, showRequirements = true }) => {
  const { isDark } = useTheme();

  const checks = {
    length: {
      test: password.length >= 8,
      label: 'Mínimo 8 caracteres'
    },
    uppercase: {
      test: /[A-Z]/.test(password),
      label: 'Una mayúscula'
    },
    lowercase: {
      test: /[a-z]/.test(password),
      label: 'Una minúscula'
    },
    number: {
      test: /[0-9]/.test(password),
      label: 'Un número'
    },
    special: {
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      label: 'Un carácter especial'
    }
  };

  const passedChecks = Object.values(checks).filter(check => check.test).length;
  
  let strength = 'Muy débil';
  let color = 'red';
  let bgColor = 'bg-red-500';
  let percentage = 20;
  
  if (passedChecks >= 5) {
    strength = 'Muy fuerte';
    color = 'green';
    bgColor = 'bg-green-500';
    percentage = 100;
  } else if (passedChecks >= 4) {
    strength = 'Fuerte';
    color = 'blue';
    bgColor = 'bg-blue-500';
    percentage = 80;
  } else if (passedChecks >= 3) {
    strength = 'Media';
    color = 'yellow';
    bgColor = 'bg-yellow-500';
    percentage = 60;
  } else if (passedChecks >= 2) {
    strength = 'Débil';
    color = 'orange';
    bgColor = 'bg-orange-500';
    percentage = 40;
  }

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className={`h-full ${bgColor} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Fortaleza:
          </span>
          <span className={`text-xs font-bold text-${color}-500`}>
            {strength}
          </span>
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Requisitos:
          </p>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(checks).map(([key, check]) => (
              <div key={key} className="flex items-center gap-2">
                {check.test ? (
                  <Check size={14} className="text-green-500 flex-shrink-0" />
                ) : (
                  <X size={14} className="text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    check.test
                      ? 'text-green-500 font-medium'
                      : isDark
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

