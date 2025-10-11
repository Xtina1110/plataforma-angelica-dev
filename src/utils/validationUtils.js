// Enhanced validation utilities with visual feedback

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: re.test(email),
    message: !re.test(email) ? 'Por favor ingresa un email válido' : ''
  };
};

export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const strength = Object.values(checks).filter(Boolean).length;
  
  let level = 'weak';
  let color = 'red';
  let percentage = 20;
  
  if (strength >= 5) {
    level = 'very-strong';
    color = 'green';
    percentage = 100;
  } else if (strength >= 4) {
    level = 'strong';
    color = 'blue';
    percentage = 80;
  } else if (strength >= 3) {
    level = 'medium';
    color = 'yellow';
    percentage = 60;
  } else if (strength >= 2) {
    level = 'weak';
    color = 'orange';
    percentage = 40;
  }

  return {
    isValid: strength >= 3,
    strength: level,
    color,
    percentage,
    checks,
    message: strength < 3 ? 'La contraseña debe ser más fuerte' : ''
  };
};

export const validatePasswordMatch = (password, confirmPassword) => {
  return {
    isValid: password === confirmPassword && password.length > 0,
    message: password !== confirmPassword ? 'Las contraseñas no coinciden' : ''
  };
};

export const validateAge = (birthdate) => {
  const today = new Date();
  const birth = new Date(birthdate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
    ? age - 1
    : age;

  return {
    isValid: actualAge >= 18,
    age: actualAge,
    message: actualAge < 18 ? 'Debes ser mayor de 18 años' : ''
  };
};

export const validatePhone = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  return {
    isValid: cleaned.length >= 9 && cleaned.length <= 15,
    message: cleaned.length < 9 || cleaned.length > 15 
      ? 'Por favor ingresa un número de teléfono válido' 
      : ''
  };
};

export const validateRequired = (value, fieldName = 'Este campo') => {
  const isValid = value && value.toString().trim().length > 0;
  return {
    isValid,
    message: !isValid ? `${fieldName} es requerido` : ''
  };
};

export const validateName = (name) => {
  const isValid = name && name.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  return {
    isValid,
    message: !isValid ? 'Por favor ingresa un nombre válido' : ''
  };
};

// Visual feedback animations
export const shakeAnimation = {
  animation: 'shake 0.5s',
  '@keyframes shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
  }
};

export const pulseAnimation = {
  animation: 'pulse 0.5s',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' }
  }
};

export const bounceAnimation = {
  animation: 'bounce 0.6s',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
    '40%': { transform: 'translateY(-20px)' },
    '60%': { transform: 'translateY(-10px)' }
  }
};

