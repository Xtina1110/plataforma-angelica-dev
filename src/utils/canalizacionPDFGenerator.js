import jsPDF from 'jspdf';

/**
 * Genera un PDF hermoso y profesional para una canalización angelical
 * @param {Object} canalizacion - Objeto con los datos de la canalización
 * @returns {Promise<void>}
 */
export const generateCanalizacionPDF = async (canalizacion) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Colores
    const colorPrimario = [147, 51, 234]; // Purple
    const colorSecundario = [59, 130, 246]; // Blue
    const colorTexto = [31, 41, 55]; // Gray-800
    const colorTextoClaro = [107, 114, 128]; // Gray-500

    // Función auxiliar para agregar nueva página si es necesario
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Función para escribir texto con word wrap
    const writeText = (text, fontSize, color, align = 'left', fontStyle = 'normal') => {
      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);
      pdf.setFont('helvetica', fontStyle);
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      lines.forEach((line, index) => {
        checkPageBreak(fontSize * 0.5);
        
        let xPosition = margin;
        if (align === 'center') {
          xPosition = pageWidth / 2;
        } else if (align === 'right') {
          xPosition = pageWidth - margin;
        }
        
        pdf.text(line, xPosition, yPosition, { align });
        yPosition += fontSize * 0.5;
      });
    };

    // ========================================
    // PORTADA
    // ========================================
    
    // Fondo degradado (simulado con rectángulos)
    const gradientSteps = 50;
    for (let i = 0; i < gradientSteps; i++) {
      const alpha = i / gradientSteps;
      const r = colorPrimario[0] + (255 - colorPrimario[0]) * alpha;
      const g = colorPrimario[1] + (255 - colorPrimario[1]) * alpha;
      const b = colorPrimario[2] + (255 - colorPrimario[2]) * alpha;
      
      pdf.setFillColor(r, g, b);
      pdf.rect(0, i * (pageHeight / gradientSteps), pageWidth, pageHeight / gradientSteps, 'F');
    }

    // Título principal
    yPosition = 60;
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(canalizacion.titulo, contentWidth - 20);
    titleLines.forEach(line => {
      pdf.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 12;
    });

    // Subtítulo
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Canalización Angelical', pageWidth / 2, yPosition, { align: 'center' });

    // Arcángel
    yPosition += 20;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Arcángel ${canalizacion.arcangel}`, pageWidth / 2, yPosition, { align: 'center' });

    // Metadatos en la portada
    yPosition = pageHeight - 60;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Duración: ${canalizacion.duracion}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    pdf.text(`Frecuencia: ${canalizacion.frecuenciaSonora}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    pdf.text(`Color: ${canalizacion.colorVibracional}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    pdf.text(`Cristal: ${canalizacion.cristalRecomendado}`, pageWidth / 2, yPosition, { align: 'center' });

    // Footer de portada
    yPosition = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.text('Plataforma Angelica - Canalizaciones', pageWidth / 2, yPosition, { align: 'center' });

    // ========================================
    // PÁGINA 2: PROPÓSITO Y DESCRIPCIÓN
    // ========================================
    pdf.addPage();
    yPosition = margin;

    // Título de sección
    pdf.setFontSize(18);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text('💫 Propósito', margin, yPosition);
    yPosition += 10;

    // Descripción
    writeText(canalizacion.descripcion, 11, colorTexto, 'left', 'normal');
    yPosition += 5;

    // Propósito específico
    if (canalizacion.proposito) {
      writeText(canalizacion.proposito, 11, colorTexto, 'left', 'italic');
      yPosition += 10;
    }

    // ========================================
    // PREPARACIÓN ENERGÉTICA
    // ========================================
    checkPageBreak(30);
    yPosition += 5;
    
    pdf.setFontSize(16);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text(canalizacion.contenido.preparacionEnergetica.titulo, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colorTextoClaro);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Duración: ${canalizacion.contenido.preparacionEnergetica.duracion}`, margin, yPosition);
    yPosition += 10;

    canalizacion.contenido.preparacionEnergetica.pasos.forEach((paso, index) => {
      checkPageBreak(20);
      
      // Número y título del paso
      pdf.setFontSize(12);
      pdf.setTextColor(...colorSecundario);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${paso.numero}. ${paso.titulo}`, margin, yPosition);
      yPosition += 6;

      // Descripción del paso
      writeText(paso.descripcion, 10, colorTexto, 'left', 'normal');
      yPosition += 5;
    });

    // ========================================
    // VISUALIZACIÓN GUIADA
    // ========================================
    checkPageBreak(30);
    yPosition += 5;

    pdf.setFontSize(16);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text(canalizacion.contenido.visualizacionGuiada.titulo, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colorTextoClaro);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Duración: ${canalizacion.contenido.visualizacionGuiada.duracion}`, margin, yPosition);
    yPosition += 10;

    writeText(canalizacion.contenido.visualizacionGuiada.texto, 10, colorTexto, 'left', 'normal');
    yPosition += 10;

    // ========================================
    // MENSAJE CANALIZADO (Sección principal)
    // ========================================
    checkPageBreak(30);
    yPosition += 5;

    pdf.setFontSize(16);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text(canalizacion.contenido.mensajeCanalizado.titulo, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colorTextoClaro);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Duración: ${canalizacion.contenido.mensajeCanalizado.duracion}`, margin, yPosition);
    yPosition += 10;

    // Caja especial para el mensaje
    const mensajeStartY = yPosition;
    writeText(canalizacion.contenido.mensajeCanalizado.texto, 11, colorTexto, 'left', 'normal');
    yPosition += 10;

    // ========================================
    // INTEGRACIÓN PRÁCTICA
    // ========================================
    checkPageBreak(30);
    yPosition += 5;

    pdf.setFontSize(16);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text(canalizacion.contenido.integracionPractica.titulo, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colorTextoClaro);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Duración: ${canalizacion.contenido.integracionPractica.duracion}`, margin, yPosition);
    yPosition += 10;

    canalizacion.contenido.integracionPractica.pasos.forEach((paso, index) => {
      checkPageBreak(20);
      
      pdf.setFontSize(12);
      pdf.setTextColor(...colorSecundario);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${paso.numero}. ${paso.titulo}`, margin, yPosition);
      yPosition += 6;

      writeText(paso.descripcion, 10, colorTexto, 'left', 'normal');
      yPosition += 5;
    });

    // ========================================
    // CIERRE ENERGÉTICO
    // ========================================
    checkPageBreak(30);
    yPosition += 5;

    pdf.setFontSize(16);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text(canalizacion.contenido.cierreEnergetico.titulo, margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(...colorTextoClaro);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Duración: ${canalizacion.contenido.cierreEnergetico.duracion}`, margin, yPosition);
    yPosition += 10;

    writeText(canalizacion.contenido.cierreEnergetico.texto, 10, colorTexto, 'left', 'normal');
    yPosition += 10;

    // ========================================
    // DECRETO FINAL Y AFIRMACIÓN
    // ========================================
    checkPageBreak(40);
    yPosition += 10;

    // Decreto Final
    pdf.setFillColor(250, 245, 255); // Light purple background
    pdf.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, 30, 3, 3, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(...colorPrimario);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🕊️ Decreto Final', margin, yPosition);
    yPosition += 8;

    writeText(canalizacion.decretoFinal, 11, colorTexto, 'center', 'italic');
    yPosition += 15;

    // Afirmación Diaria
    checkPageBreak(30);
    pdf.setFillColor(245, 250, 255); // Light blue background
    pdf.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, 25, 3, 3, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(...colorSecundario);
    pdf.setFont('helvetica', 'bold');
    pdf.text('💎 Afirmación Diaria', margin, yPosition);
    yPosition += 8;

    writeText(canalizacion.afirmacionDiaria, 11, colorTexto, 'center', 'bold');
    yPosition += 15;

    // ========================================
    // MÚSICA Y FRECUENCIA SUGERIDA
    // ========================================
    if (canalizacion.musicaSugerida) {
      checkPageBreak(40);
      yPosition += 5;

      pdf.setFontSize(14);
      pdf.setTextColor(...colorPrimario);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🎶 Música y Frecuencia Sugerida', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(...colorTexto);
      pdf.setFont('helvetica', 'normal');
      
      pdf.text(`• Frecuencia: ${canalizacion.musicaSugerida.frecuencia}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`• Instrumentos: ${canalizacion.musicaSugerida.instrumentos}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`• Duración: ${canalizacion.musicaSugerida.duracionTrack}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`• Finalización: ${canalizacion.musicaSugerida.finalizacion}`, margin + 5, yPosition);
      yPosition += 10;
    }

    // ========================================
    // FOOTER EN TODAS LAS PÁGINAS
    // ========================================
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Línea decorativa
      pdf.setDrawColor(...colorPrimario);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Texto del footer
      pdf.setFontSize(8);
      pdf.setTextColor(...colorTextoClaro);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Plataforma Angelica', margin, pageHeight - 10);
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    // ========================================
    // GUARDAR PDF
    // ========================================
    const fileName = `Canalizacion_${canalizacion.arcangel}_${canalizacion.id}.pdf`;
    pdf.save(fileName);

    console.log(`✅ PDF generado exitosamente: ${fileName}`);
    return true;

  } catch (error) {
    console.error('❌ Error al generar PDF de canalización:', error);
    throw error;
  }
};

/**
 * Genera un PDF simplificado (versión rápida)
 */
export const generateSimpleCanalizacionPDF = async (canalizacion) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;

    // Título
    pdf.setFontSize(20);
    pdf.setTextColor(147, 51, 234);
    pdf.text(canalizacion.titulo, pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Mensaje principal
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(canalizacion.contenido.mensajeCanalizado.texto, 170);
    pdf.text(lines, 20, y);

    // Guardar
    const fileName = `Canalizacion_${canalizacion.id}_simple.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error al generar PDF simple:', error);
    throw error;
  }
};

