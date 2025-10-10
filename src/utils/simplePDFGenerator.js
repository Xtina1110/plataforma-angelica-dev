// Generador de PDF Angelical Mejorado
import jsPDF from 'jspdf';
import { createWatermarkedCardFront } from './watermarkUtils';
import logo from '../assets/Logosinfondo.png';
import angelElegante from '../assets/AngelElegante.png';
import fondoMarmoleado from '../assets/Fondomarmoleado copy.jpg';

export const generateSimplePDF = async (data) => {
  console.log('🎨 Generando PDF angelical...', data);
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configurar el idioma para caracteres especiales
    pdf.setLanguage('es');
    
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    const maxYPos = pageHeight - 25; // Límite inferior para evitar cortes
    
    // Función auxiliar para verificar espacio y agregar página si es necesario
    const checkAndAddPage = (requiredSpace, currentY) => {
      if (currentY + requiredSpace > maxYPos) {
        pdf.addPage();
        drawHeader(pdf, 'Lectura Angelical', 50);
        return 65; // Retorna nueva posición Y después del header
      }
      return currentY;
    };
    
    // Función para dibujar header angelical con fondo marmoleado morado-dorado
    const drawHeader = (pdfDoc, title, height = 60) => {
      try {
        pdfDoc.addImage(fondoMarmoleado, 'JPEG', 0, 0, pageWidth, height);
      } catch (error) {
        console.warn('No se pudo cargar fondo marmoleado, usando color sólido:', error);
        pdfDoc.setFillColor(230, 220, 240);
        pdfDoc.rect(0, 0, pageWidth, height, 'F');
      }

      const logoSize = height > 50 ? 35 : 25;
      const logoX = (pageWidth - logoSize) / 2;
      const logoY = 10;

      try {
        pdfDoc.addImage(logo, 'PNG', logoX, logoY, logoSize, logoSize);
      } catch (error) {
        console.warn('No se pudo agregar logo:', error);
      }

      const titleY = logoY + logoSize + 8;
      pdfDoc.setFontSize(height > 50 ? 34 : 26);
      pdfDoc.setFont('helvetica', 'bold');

      pdfDoc.setTextColor(80, 50, 100);

      const titleText = title.toUpperCase();
      const charSpacing = 0.6;
      const tempWidth = pdfDoc.getTextWidth(titleText);
      const totalWidth = tempWidth + (titleText.length - 1) * charSpacing;
      let xPos = (pageWidth - totalWidth) / 2;

      for (let i = 0; i < titleText.length; i++) {
        const char = titleText[i];
        pdfDoc.text(char, xPos, titleY, { align: 'left' });
        xPos += pdfDoc.getTextWidth(char) + charSpacing;
      }

      let subtitleY = titleY + 7;
      if (height > 50) {
        pdfDoc.setFontSize(10);
        pdfDoc.setFont('helvetica', 'normal');
        pdfDoc.setTextColor(100, 80, 120);
        pdfDoc.text('Conecta con la sabiduría celestial a través de tus ángeles', pageWidth / 2, subtitleY, { align: 'center' });
      }

      pdfDoc.setDrawColor(212, 175, 55);
      pdfDoc.setLineWidth(2.5);
      const lineY = height > 50 ? subtitleY + 4 : titleY + 5;
      pdfDoc.line(20, lineY, pageWidth - 20, lineY);
    };
    
    // Función para dibujar footer
    const drawFooter = (pdfDoc, pageNum = null) => {
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(120, 120, 120);
      pdfDoc.setFont('helvetica', 'normal');
      const footerText = pageNum 
        ? `El Angelólogo - Plataforma Angélica | Página ${pageNum}`
        : 'El Angelólogo - Plataforma Angélica';
      pdfDoc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    };
    
    // Configurar fuente
    pdf.setFont('helvetica');
    
    // ===== PÁGINA 1: PORTADA CON ESTILO DE APERTURA ANGELICAL =====
    drawHeader(pdf, 'Apertura Angelical', 60);

    let yPos = 75;

    // Agregar imagen del ángel en la portada
    try {
      const angelWidth = 80;
      const angelHeight = 90;
      const angelX = (pageWidth - angelWidth) / 2;

      // Marco decorativo elegante
      pdf.setFillColor(252, 251, 255); // Blanco muy suave con tinte morado
      pdf.roundedRect(angelX - 5, yPos - 5, angelWidth + 10, angelHeight + 10, 8, 8, 'F');

      // Borde dorado suave
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(1.5);
      pdf.roundedRect(angelX - 5, yPos - 5, angelWidth + 10, angelHeight + 10, 8, 8, 'S');

      pdf.addImage(angelElegante, 'PNG', angelX, yPos, angelWidth, angelHeight);
      yPos += angelHeight + 20;
    } catch (error) {
      console.warn('No se pudo agregar imagen del ángel:', error);
      yPos += 10;
    }

    // Fondo elegante para la info
    const infoBoxHeight = 70;
    pdf.setFillColor(252, 251, 255); // Fondo muy claro con tinte morado
    pdf.roundedRect(margin, yPos, contentWidth, infoBoxHeight, 5, 5, 'F');

    // Borde decorativo suave
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, yPos, contentWidth, infoBoxHeight, 5, 5, 'S');
    
    yPos += 10;
    pdf.setTextColor(139, 92, 246); // Morado
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    pdf.text('Fecha:', margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text(fecha, margin + 25, yPos);
    yPos += 8;
    
    if (data.tipoTirada?.nombre) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 92, 246); // Morado
      pdf.text('Tipo de Lectura:', margin + 5, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text(data.tipoTirada.nombre, margin + 42, yPos);
      yPos += 8;
    }

    if (data.tema?.nombre) {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 92, 246); // Morado
      pdf.text('Tema:', margin + 5, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text(data.tema.nombre, margin + 20, yPos);
      yPos += 8;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(139, 92, 246); // Morado
    pdf.text('Numero de Cartas:', margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text(`${data.cartas?.length || 0}`, margin + 42, yPos);
    
    yPos += 20;

    // Caja de frase inspiracional elegante
    const quoteBoxHeight = 45;

    // Gradiente suave morado-azul
    for (let i = 0; i < quoteBoxHeight; i++) {
      const ratio = i / quoteBoxHeight;
      const r = Math.round(245 - (245 - 240) * ratio);   // Tonos muy claros
      const g = Math.round(243 - (243 - 248) * ratio);
      const b = Math.round(255);
      pdf.setFillColor(r, g, b);
      pdf.rect(margin - 5, yPos + i, contentWidth + 10, 1, 'F');
    }

    // Borde dorado suave
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(1.5);
    pdf.roundedRect(margin - 5, yPos, contentWidth + 10, quoteBoxHeight, 5, 5, 'S');

    // Icono decorativo superior
    pdf.setFontSize(16);
    pdf.text('✧', pageWidth / 2, yPos + 8, { align: 'center' });

    yPos += 16;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(255, 255, 255);
    const quote = 'Los angeles susurran mensajes de amor y guia a aquellos que abren su corazon para escuchar.';
    const quoteLines = pdf.splitTextToSize(quote, contentWidth - 15);
    pdf.text(quoteLines, pageWidth / 2, yPos, { align: 'center' });
    yPos += quoteLines.length * 6;

    // Icono decorativo inferior
    pdf.setFontSize(16);
    pdf.text('✧', pageWidth / 2, yPos + 4, { align: 'center' });
    
    // ===== PÁGINAS DE CARTAS =====
    if (data.cartas && data.cartas.length > 0) {
      for (let i = 0; i < data.cartas.length; i++) {
        const carta = data.cartas[i];
        pdf.addPage();
        
        let pageNum = i + 2; // +2 porque la portada es la página 1
        drawHeader(pdf, `Carta ${i + 1} de ${data.cartas.length}`, 50);
        
        yPos = 62;

        // Caja decorativa elegante para nombre de carta
        const nameBoxHeight = 18;
        pdf.setFillColor(252, 251, 255); // Blanco muy suave con tinte morado
        pdf.roundedRect(margin, yPos, contentWidth, nameBoxHeight, 4, 4, 'F');

        pdf.setDrawColor(212, 175, 55); // Dorado
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, yPos, contentWidth, nameBoxHeight, 4, 4, 'S');

        // Nombre de la carta con morado
        pdf.setTextColor(106, 13, 173); // Morado oscuro
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold');
        const nombreLines = pdf.splitTextToSize(carta.nombre || 'Sin nombre', contentWidth - 10);
        pdf.text(nombreLines, pageWidth / 2, yPos + 6, { align: 'center' });
        yPos += nameBoxHeight + 8;
        
        // Agregar imagen de la carta con marca de agua
        yPos = checkAndAddPage(120, yPos);
        
        if (carta.imagen) {
          try {
            console.log(`📸 Procesando imagen de carta ${i + 1} con marca de agua...`);

            // Crear imagen con marca de agua
            const watermarkedImageUrl = await createWatermarkedCardFront(carta.imagen);

            if (!watermarkedImageUrl) {
              throw new Error('No se generó la marca de agua');
            }

            // Centrar imagen con marco decorativo
            const imgWidth = 80;
            const imgHeight = 112;
            const imgX = (pageWidth - imgWidth) / 2;

            // Marco decorativo elegante para la imagen
            const framePadding = 3;
            pdf.setFillColor(252, 251, 255); // Blanco muy suave
            pdf.roundedRect(
              imgX - framePadding,
              yPos - framePadding,
              imgWidth + framePadding * 2,
              imgHeight + framePadding * 2,
              5, 5, 'F'
            );

            // Borde dorado suave
            pdf.setDrawColor(212, 175, 55);
            pdf.setLineWidth(1.5);
            pdf.roundedRect(
              imgX - framePadding,
              yPos - framePadding,
              imgWidth + framePadding * 2,
              imgHeight + framePadding * 2,
              5, 5, 'S'
            );

            // Agregar imagen con marca de agua
            pdf.addImage(watermarkedImageUrl, 'PNG', imgX, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 15;

            console.log(`✅ Imagen con marca de agua agregada correctamente`);
          } catch (error) {
            console.error('❌ Error al agregar imagen con marca de agua:', error);
            // Fallback: agregar sin marca de agua
            try {
              const imgWidth = 75;
              const imgHeight = 105;
              const imgX = (pageWidth - imgWidth) / 2;
              pdf.addImage(carta.imagen, 'PNG', imgX, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 10;
              console.warn('⚠️ Imagen agregada sin marca de agua');
            } catch (err) {
              console.error('❌ No se pudo agregar la imagen:', err);
              yPos += 10;
            }
          }
        }
        
        // Detalles de la carta: cristal, color y elemento en un recuadro unificado
        if (carta.cristal || carta.color || carta.elemento) {
          const detalleItems = [
            { label: 'Cristal', value: carta.cristal, color: [139, 92, 246] },  // Morado
            { label: 'Color', value: carta.color, color: [212, 175, 55] },      // Dorado
            { label: 'Elemento', value: carta.elemento, color: [59, 130, 246] } // Azul
          ].filter(item => item.value);
          
          if (detalleItems.length > 0) {
            const boxHeight = detalleItems.length * 8 + 8;
            yPos = checkAndAddPage(boxHeight + 10, yPos);
            
            // Recuadro unificado elegante
            pdf.setFillColor(252, 251, 255); // Fondo muy claro
            pdf.setDrawColor(212, 175, 55); // Dorado
            pdf.setLineWidth(1);
            pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 4, 4, 'FD');
            
            yPos += 6;
            
            detalleItems.forEach((detalle, idx) => {
              // Label en color
              pdf.setFontSize(10);
              pdf.setTextColor(detalle.color[0], detalle.color[1], detalle.color[2]);
              pdf.setFont('helvetica', 'bold');
              pdf.text(`${detalle.label}:`, margin + 5, yPos);
              
              // Valor en gris oscuro
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(60, 60, 60);
              pdf.text(detalle.value, margin + 30, yPos);
              
              yPos += 8;
            });
            
            yPos += 8;
          }
        }
        
        // Significado con diseño mejorado y caja completa
        if (carta.significado) {
          const significadoLines = pdf.splitTextToSize(carta.significado, contentWidth - 20);
          const boxHeight = significadoLines.length * 5 + 18;
          yPos = checkAndAddPage(boxHeight + 5, yPos);

          // Caja elegante con fondo suave
          pdf.setFillColor(252, 250, 255); // Blanco con tinte morado muy suave
          pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 4, 4, 'F');

          // Borde lateral decorativa morada
          pdf.setFillColor(139, 92, 246);
          pdf.roundedRect(margin, yPos, 4, boxHeight, 4, 4, 'F');

          pdf.setTextColor(106, 13, 173); // Morado oscuro
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('✦ Significado', margin + 8, yPos + 7);
          yPos += 13;

          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(significadoLines, margin + 8, yPos);
          yPos += significadoLines.length * 5 + 10;
        }
        
        // Mensaje Angelical con diseño mejorado y caja completa
        if (carta.mensaje) {
          const mensajeLines = pdf.splitTextToSize(carta.mensaje, contentWidth - 20);
          const boxHeight = mensajeLines.length * 5 + 18;
          yPos = checkAndAddPage(boxHeight + 5, yPos);

          // Caja elegante con fondo azul suave
          pdf.setFillColor(248, 252, 255); // Azul muy claro
          pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 4, 4, 'F');

          // Borde lateral decorativa azul
          pdf.setFillColor(59, 130, 246);
          pdf.roundedRect(margin, yPos, 4, boxHeight, 4, 4, 'F');

          pdf.setTextColor(59, 130, 246); // Azul
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('✦ Mensaje Angelical', margin + 8, yPos + 7);
          yPos += 13;

          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(mensajeLines, margin + 8, yPos);
          yPos += mensajeLines.length * 5 + 10;
        }
        
        // Afirmacion con caja especial en amarillo claro
        if (carta.afirmacion) {
          const afirmacionLines = pdf.splitTextToSize(`"${carta.afirmacion}"`, contentWidth - 16);
          const neededSpace = afirmacionLines.length * 5 + 22;
          yPos = checkAndAddPage(neededSpace, yPos);
          
          // Caja elegante con fondo dorado suave
          const boxHeight = afirmacionLines.length * 5 + 14;
          pdf.setFillColor(255, 253, 245); // Amarillo muy suave
          pdf.roundedRect(margin, yPos - 2, contentWidth, boxHeight, 2, 2, 'F');

          pdf.setDrawColor(212, 175, 55); // Dorado
          pdf.setLineWidth(0.8);
          pdf.roundedRect(margin, yPos - 2, contentWidth, boxHeight, 2, 2, 'S');

          pdf.setTextColor(212, 175, 55); // Dorado
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Afirmacion', margin + 5, yPos + 3);
          yPos += 9;

          pdf.setTextColor(106, 13, 173); // Morado oscuro para legibilidad
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          pdf.text(afirmacionLines, margin + 8, yPos);
          yPos += afirmacionLines.length * 5 + 10;
        }
        
        // Guia Practica (si existe en la carta)
        if (carta.guiaPractica) {
          const guiaNeeded = 80; // Estimación del espacio necesario
          yPos = checkAndAddPage(guiaNeeded, yPos);
          
          // Título principal de Guía Práctica
          pdf.setTextColor(106, 13, 173); // Morado oscuro
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${carta.guiaPractica.titulo || 'Guia Practica'}`, margin, yPos);
          yPos += 10;

          // Ritual
          if (carta.guiaPractica.ritual) {
            yPos = checkAndAddPage(25, yPos);
            pdf.setFontSize(10);
            pdf.setTextColor(212, 175, 55); // Dorado
            pdf.setFont('helvetica', 'bold');

            // Manejar tanto formato objeto como string
            const ritualTexto = typeof carta.guiaPractica.ritual === 'string'
              ? carta.guiaPractica.ritual
              : carta.guiaPractica.ritual.instrucciones || carta.guiaPractica.ritual.nombre || '';

            const ritualNombre = typeof carta.guiaPractica.ritual === 'object' && carta.guiaPractica.ritual.nombre
              ? `Ritual: ${carta.guiaPractica.ritual.nombre}`
              : 'Ritual:';

            pdf.text(ritualNombre, margin + 3, yPos);
            yPos += 6;

            const ritualLines = pdf.splitTextToSize(ritualTexto, contentWidth - 18);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.text(ritualLines, margin + 3, yPos);
            yPos += ritualLines.length * 5 + 8;
          }
          
          // Invocación
          if (carta.guiaPractica.invocacion) {
            yPos = checkAndAddPage(20, yPos);
            pdf.setFontSize(10);
            pdf.setTextColor(139, 92, 246); // Morado
            pdf.setFont('helvetica', 'bold');
            pdf.text('Invocacion:', margin + 3, yPos);
            yPos += 6;
            
            const invocacionLines = pdf.splitTextToSize(`"${carta.guiaPractica.invocacion}"`, contentWidth - 18);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(9);
            pdf.text(invocacionLines, margin + 3, yPos);
            yPos += invocacionLines.length * 5 + 8;
          }
          
          // Acción de Confianza
          if (carta.guiaPractica.accionConfianza) {
            yPos = checkAndAddPage(20, yPos);
            pdf.setFontSize(10);
            pdf.setTextColor(59, 130, 246); // Azul
            pdf.setFont('helvetica', 'bold');
            pdf.text('Accion de Confianza:', margin + 3, yPos);
            yPos += 6;
            
            const accionLines = pdf.splitTextToSize(carta.guiaPractica.accionConfianza, contentWidth - 18);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.text(accionLines, margin + 3, yPos);
            yPos += accionLines.length * 5 + 8;
          }
          
          // Acción Consciente
          if (carta.guiaPractica.accionConsciente) {
            yPos = checkAndAddPage(20, yPos);
            pdf.setFontSize(10);
            pdf.setTextColor(139, 92, 246); // Morado
            pdf.setFont('helvetica', 'bold');
            pdf.text('Accion Consciente:', margin + 3, yPos);
            yPos += 6;
            
            const accionLines = pdf.splitTextToSize(carta.guiaPractica.accionConsciente, contentWidth - 18);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.text(accionLines, margin + 3, yPos);
            yPos += accionLines.length * 5 + 8;
          }
          
          // Acción Inspirada
          if (carta.guiaPractica.accionInspirada) {
            yPos = checkAndAddPage(20, yPos);
            pdf.setFontSize(10);
            pdf.setTextColor(212, 175, 55); // Dorado
            pdf.setFont('helvetica', 'bold');
            pdf.text('Accion Inspirada:', margin + 3, yPos);
            yPos += 6;
            
            const accionLines = pdf.splitTextToSize(carta.guiaPractica.accionInspirada, contentWidth - 18);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.text(accionLines, margin + 3, yPos);
            yPos += accionLines.length * 5 + 8;
          }
        }
        
        // Footer de página
        drawFooter(pdf, pageNum);
        pageNum++;
      }
    }
    
    // ===== PÁGINA FINAL: RESUMEN =====
    pdf.addPage();
    drawHeader(pdf, 'Resumen de tu Lectura', 50);
    
    yPos = 65;
    
    // Interpretación con diseño mejorado - con imagen del ángel
    const interpretacion = generateInterpretation(data);
    const angelWidth = 40; // Ancho del ángel
    const angelHeight = 50; // Alto del ángel
    const textStartX = margin + angelWidth + 8; // Texto empieza después del ángel
    const textWidth = pageWidth - textStartX - margin - 10; // Ancho disponible con margen adicional de seguridad
    const interpretacionLines = pdf.splitTextToSize(interpretacion, textWidth);
    const boxHeight = Math.max(angelHeight + 10, interpretacionLines.length * 5 + 22);
    const interpNeeded = boxHeight;
    yPos = checkAndAddPage(interpNeeded, yPos);
    
    const boxStartY = yPos - 3;

    // Fondo elegante
    pdf.setFillColor(252, 250, 255); // Fondo con tinte morado muy suave
    pdf.roundedRect(margin, boxStartY, contentWidth, boxHeight, 2, 2, 'F');

    // Agregar imagen del ángel
    try {
      const angelY = boxStartY + 5;
      pdf.addImage(angelElegante, 'PNG', margin + 5, angelY, angelWidth, angelHeight);
    } catch (error) {
      console.warn('No se pudo agregar imagen del angel:', error);
    }

    pdf.setTextColor(106, 13, 173); // Morado oscuro
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Interpretacion Angelical', textStartX, yPos + 3);
    yPos += 10;
    
    pdf.setTextColor(40, 40, 40);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(interpretacionLines, textStartX, yPos);
    yPos = boxStartY + boxHeight + 5;
    
    // Guía Práctica
    const guidance = generateGuidance(data.tema);
    const guideNeeded = guidance.length * 15 + 25;
    yPos = checkAndAddPage(guideNeeded, yPos);

    pdf.setTextColor(139, 92, 246); // Morado
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Guia Practica', margin, yPos);
    yPos += 10;
    
    pdf.setTextColor(40, 40, 40);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    guidance.forEach((item, index) => {
      const itemText = `${index + 1}. ${item}`;
      const itemLines = pdf.splitTextToSize(itemText, contentWidth - 18);
      const itemNeeded = itemLines.length * 5 + 8;
      yPos = checkAndAddPage(itemNeeded, yPos);
      
      // Viñeta decorativa
      pdf.setFillColor(212, 175, 55); // Dorado
      pdf.circle(margin + 2, yPos - 1, 1.5, 'F');
      
      pdf.text(itemLines, margin + 8, yPos);
      yPos += itemLines.length * 5 + 6;
    });
    
    yPos += 12;
    
    // Nueva sección: Guía para Integrar la Energía
    const energyGuide = generateEnergyIntegrationGuide(data.tema);
    const energyNeeded = energyGuide.length * 15 + 25;
    yPos = checkAndAddPage(energyNeeded, yPos);

    pdf.setTextColor(59, 130, 246); // Azul
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Guia Practica para Integrar la Energia', margin, yPos);
    yPos += 10;
    
    pdf.setTextColor(40, 40, 40);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    energyGuide.forEach((item, index) => {
      const itemText = `${index + 1}. ${item}`;
      const itemLines = pdf.splitTextToSize(itemText, contentWidth - 18);
      const itemNeeded = itemLines.length * 5 + 8;
      yPos = checkAndAddPage(itemNeeded, yPos);
      
      // Viñeta decorativa
      pdf.setFillColor(139, 92, 246); // Morado
      pdf.circle(margin + 2, yPos - 1, 1.5, 'F');
      
      pdf.text(itemLines, margin + 8, yPos);
      yPos += itemLines.length * 5 + 6;
    });
    
    yPos += 10;
    
    // Afirmación final con caja especial en amarillo claro
    const afirmacion = generateAffirmation(data.tema);
    const afirmacionLines = pdf.splitTextToSize(`"${afirmacion}"`, contentWidth - 25);
    const afirmNeeded = afirmacionLines.length * 6 + 28;
    yPos = checkAndAddPage(afirmNeeded, yPos);
    
    // Caja elegante con gradiente suave para afirmación
    const afirmBoxHeight = afirmacionLines.length * 6 + 20;

    // Gradiente muy suave morado-dorado
    for (let i = 0; i < afirmBoxHeight; i++) {
      const ratio = i / afirmBoxHeight;
      const r = Math.round(252 - (252 - 255) * ratio);  // Tonos muy claros
      const g = Math.round(250 - (250 - 253) * ratio);
      const b = Math.round(255 - (255 - 245) * ratio);
      pdf.setFillColor(r, g, b);
      pdf.rect(margin - 5, yPos - 3 + i, contentWidth + 10, 1, 'F');
    }

    // Borde dorado suave
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(1.5);
    pdf.roundedRect(margin - 5, yPos - 3, contentWidth + 10, afirmBoxHeight, 3, 3, 'S');

    pdf.setTextColor(212, 175, 55); // Dorado
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Afirmacion Angelical', pageWidth / 2, yPos + 4, { align: 'center' });
    yPos += 12;

    pdf.setTextColor(106, 13, 173); // Morado oscuro para legibilidad
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    pdf.text(afirmacionLines, pageWidth / 2, yPos, { align: 'center' });
    
    // Footer final
    drawFooter(pdf);
    
    // Guardar PDF
    const fileName = `Lectura-Angelical-${fecha.replace(/\s+/g, '-')}.pdf`;
    pdf.save(fileName);
    
    console.log('✅ PDF generado exitosamente:', fileName);
    return fileName;
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    throw error;
  }
};

// Función auxiliar para generar interpretación
function generateInterpretation(data) {
  const numCartas = data.cartas?.length || 0;
  const tema = data.tema?.nombre || 'tu vida';
  
  return `Esta lectura angelical en el area de ${tema} revela ${numCartas} mensajes divinos que iluminan tu camino. Los angeles te guian hacia una comprension mas profunda de tu situacion actual y te ofrecen sabiduria celestial para avanzar con confianza y amor.`;
}

// Función auxiliar para generar guía práctica
function generateGuidance(tema) {
  const baseGuidance = [
    'Dedica tiempo diario a la meditacion y conexion espiritual',
    'Manten un diario de gratitud para elevar tu vibracion',
    'Confia en tu intuicion y en las senales que recibes'
  ];
  
  const temaGuidance = {
    'Amor y Relaciones': 'Practica el amor incondicional contigo mismo y con los demas',
    'Trabajo y Abundancia': 'Visualiza tu exito y toma accion inspirada hacia tus metas',
    'Salud y Bienestar': 'Cuida tu cuerpo como el templo sagrado que es',
    'Crecimiento Espiritual': 'Busca momentos de conexion con tu ser superior',
    'Proposito y Mision': 'Escucha la voz de tu alma y sigue tu verdadero llamado'
  };
  
  if (tema?.nombre && temaGuidance[tema.nombre]) {
    return [...baseGuidance, temaGuidance[tema.nombre]];
  }
  
  return baseGuidance;
}

// Función para generar guía de integración de energía
function generateEnergyIntegrationGuide(tema) {
  const baseEnergyGuide = [
    'Crea un espacio sagrado en tu hogar dedicado a la conexion angelical',
    'Practica respiraciones conscientes al despertar y antes de dormir',
    'Usa cristales o elementos naturales para anclar la energia',
    'Escribe en tu diario las senales y sincronicidades que observes'
  ];
  
  const temaEnergyGuide = {
    'Amor y Relaciones': 'Medita con cuarzo rosa para abrir tu corazon y atraer relaciones armoniosas',
    'Trabajo y Abundancia': 'Visualiza una luz dorada rodeandote mientras trabajas en tus proyectos',
    'Salud y Bienestar': 'Conecta con la naturaleza diariamente para renovar tu energia vital',
    'Crecimiento Espiritual': 'Dedica 15 minutos al dia a la contemplacion silenciosa y la oracion',
    'Proposito y Mision': 'Pide guia angelical cada manana sobre los pasos a seguir en tu camino'
  };
  
  if (tema?.nombre && temaEnergyGuide[tema.nombre]) {
    return [...baseEnergyGuide, temaEnergyGuide[tema.nombre]];
  }
  
  return baseEnergyGuide;
}

// Función auxiliar para generar afirmación
function generateAffirmation(tema) {
  const affirmations = {
    'Amor y Relaciones': 'Soy un ser digno de amor incondicional y atraigo relaciones armoniosas a mi vida',
    'Trabajo y Abundancia': 'Estoy alineado con la abundancia universal y mi exito fluye naturalmente',
    'Salud y Bienestar': 'Mi cuerpo es un templo de luz divina, fuerte y radiante',
    'Crecimiento Espiritual': 'Estoy conectado con mi sabiduria interior y mi luz espiritual brilla con intensidad',
    'Proposito y Mision': 'Camino con confianza hacia mi proposito divino, guiado por los angeles'
  };
  
  return affirmations[tema?.nombre] || 'Estoy guiado por el amor angelical en cada paso de mi camino';
}

export default generateSimplePDF;
