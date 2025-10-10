import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Funciones para compartir en redes sociales
export const shareOnFacebook = (url, title) => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const shareOnTwitter = (url, title, hashtags = '') => {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const shareOnWhatsApp = (url, title) => {
  const text = `${title} ${url}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank');
};

export const shareOnLinkedIn = (url, title, summary = '') => {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

export const shareOnTelegram = (url, title) => {
  const text = `${title} ${url}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  window.open(shareUrl, '_blank');
};

export const copyToClipboard = async (url, title) => {
  const text = `${title} - ${url}`;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
};

// Función para generar PDF de artículos
export const generatePDF = async (elementId, fileName, title, author, date) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento no encontrado');
    }

    // Configurar el elemento para PDF
    const originalStyles = {
      width: element.style.width,
      maxWidth: element.style.maxWidth,
      padding: element.style.padding,
      backgroundColor: element.style.backgroundColor
    };

    // Aplicar estilos optimizados para PDF
    element.style.width = '800px';
    element.style.maxWidth = '800px';
    element.style.padding = '40px';
    element.style.backgroundColor = 'white';

    // Crear canvas del elemento
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: 'white',
      width: 800,
      height: element.scrollHeight
    });

    // Restaurar estilos originales
    Object.assign(element.style, originalStyles);

    // Crear PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calcular dimensiones
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10; // 10mm top margin

    // Agregar header del PDF
    pdf.setFontSize(20);
    pdf.setTextColor(106, 13, 173); // Color angelical
    pdf.text('Plataforma Angélica', 10, position);
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, 10, position + 10);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Por: ${author}`, 10, position + 18);
    pdf.text(`Fecha: ${date}`, 10, position + 25);
    
    position += 35;

    // Agregar contenido
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - position);

    // Agregar páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Agregar footer angelical
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Plataforma Angélica - Sabiduría Espiritual', 10, pdfHeight - 10);
      pdf.text(`Página ${i} de ${pageCount}`, pdfWidth - 30, pdfHeight - 10);
    }

    // Descargar PDF
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return false;
  }
};

// Función para formatear nombre de archivo
export const formatFileName = (title, type = 'articulo') => {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  const timestamp = new Date().toISOString().split('T')[0];
  return `${type}-angelical-${cleanTitle}-${timestamp}.pdf`;
};

// Función para mostrar notificaciones de éxito/error
export const showNotification = (message, type = 'success') => {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `angelical-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;

  // Estilos de la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  // Animación de entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remover después de 4 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
};

// Función para obtener URL actual
export const getCurrentUrl = () => {
  return window.location.href;
};

// Función para obtener datos Open Graph
export const getOpenGraphData = (title, description, image, url) => {
  return {
    title,
    description,
    image,
    url,
    site_name: 'Plataforma Angélica',
    type: 'article'
  };
};