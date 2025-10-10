import logo from '../assets/Logosinfondo.png';

export const createWatermarkedCardFront = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const cardImg = new Image();
    cardImg.crossOrigin = 'anonymous';

    cardImg.onload = () => {
      canvas.width = cardImg.width;
      canvas.height = cardImg.height;

      ctx.drawImage(cardImg, 0, 0);

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      logoImg.onload = () => {
        const logoSize = canvas.width * 0.15;

        ctx.save();
        ctx.globalAlpha = 0.35;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-30 * Math.PI / 180);
        ctx.drawImage(
          logoImg,
          -logoSize / 2,
          -logoSize / 2,
          logoSize,
          logoSize
        );

        ctx.restore();

        const watermarkedDataUrl = canvas.toDataURL('image/png', 0.95);
        resolve(watermarkedDataUrl);
      };

      logoImg.onerror = () => {
        console.warn('No se pudo cargar el logo, usando texto como fallback');
        const watermarkText = 'El Angelologo';
        const watermarkFontSize = Math.min(canvas.width, canvas.height) * 0.08;

        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.font = `bold ${watermarkFontSize}px Arial`;
        ctx.fillStyle = '#6d28d9';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(watermarkText, 0, 0);

        const offsetY = watermarkFontSize * 1.5;
        ctx.fillText(watermarkText, 0, offsetY);
        ctx.fillText(watermarkText, 0, -offsetY);
        ctx.restore();

        const watermarkedDataUrl = canvas.toDataURL('image/png', 0.95);
        resolve(watermarkedDataUrl);
      };

      logoImg.src = logo;
    };

    cardImg.onerror = (error) => {
      console.error('Error cargando imagen para marca de agua:', error);
      reject(error);
    };

    if (imageUrl.startsWith('data:')) {
      cardImg.src = imageUrl;
    } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      cardImg.src = imageUrl;
    } else {
      cardImg.src = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
  });
};

export default createWatermarkedCardFront;
