import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      sessionId,
      bookingData,
      conversationHistory,
      chatMessages,
      sharedCards,
      duration
    } = req.body;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Header with gradient background (simulated)
    pdf.setFillColor(139, 92, 246); // Purple
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // Add sparkle icon (using text)
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('✨', margin, 25);
    
    // Title
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Consulta Angelical Online', margin + 15, 25);
    
    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Reporte de Sesión Espiritual', margin + 15, 35);
    
    yPosition = 60;

    // Session Information
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(139, 92, 246);
    pdf.text('Información de la Sesión', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);

    const sessionInfo = [
      ['ID de Sesión:', sessionId],
      ['Tipo:', bookingData?.type || 'Apertura Angelical'],
      ['Duración:', `${duration} minutos`],
      ['Fecha:', new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })],
      ['Hora:', new Date().toLocaleTimeString('es-ES')]
    ];

    sessionInfo.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, margin, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 40, yPosition);
      yPosition += 6;
    });

    yPosition += 10;
    checkPageBreak(30);

    // Shared Cards Section
    if (sharedCards && sharedCards.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 92, 246);
      pdf.text('Cartas Angélicas Compartidas', margin, yPosition);
      yPosition += 10;

      const cardsPerRow = 3;
      const cardWidth = (pageWidth - 2 * margin - 10) / cardsPerRow;
      const cardHeight = 50;

      sharedCards.forEach((card, index) => {
        const col = index % cardsPerRow;
        const row = Math.floor(index / cardsPerRow);
        
        const x = margin + col * (cardWidth + 5);
        const y = yPosition + row * (cardHeight + 5);

        checkPageBreak(cardHeight + 10);

        // Card background
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
        
        // Card border
        pdf.setDrawColor(139, 92, 246);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');

        // Card icon
        pdf.setFontSize(20);
        pdf.text(card.icon || '🌟', x + cardWidth / 2, y + 15, { align: 'center' });

        // Card name
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(60, 60, 60);
        const cardName = pdf.splitTextToSize(card.name || 'Carta Angelical', cardWidth - 10);
        pdf.text(cardName, x + cardWidth / 2, y + 25, { align: 'center' });

        // Card interpretation (if available)
        if (card.interpretation) {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          const interpretation = pdf.splitTextToSize(card.interpretation, cardWidth - 10);
          pdf.text(interpretation, x + cardWidth / 2, y + 35, { align: 'center', maxWidth: cardWidth - 10 });
        }
      });

      yPosition += Math.ceil(sharedCards.length / cardsPerRow) * (cardHeight + 5) + 10;
    }

    checkPageBreak(30);

    // Conversation Transcript Section
    if (conversationHistory && conversationHistory.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 92, 246);
      pdf.text('Transcripción de la Conversación', margin, yPosition);
      yPosition += 10;

      conversationHistory.forEach((entry, index) => {
        checkPageBreak(40);

        // Entry number
        pdf.setFillColor(139, 92, 246);
        pdf.circle(margin + 3, yPosition + 2, 3, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text((index + 1).toString(), margin + 3, yPosition + 3, { align: 'center' });

        // Timestamp
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(120, 120, 120);
        const timestamp = new Date(entry.timestamp).toLocaleTimeString('es-ES');
        pdf.text(timestamp, margin + 10, yPosition + 3);

        yPosition += 6;

        // Original text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const originalText = pdf.splitTextToSize(entry.original, pageWidth - 2 * margin - 10);
        pdf.text(originalText, margin + 10, yPosition);
        yPosition += originalText.length * 5;

        // Translation
        if (entry.translated && entry.translated !== entry.original) {
          yPosition += 2;
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(59, 130, 246); // Blue
          
          const langInfo = `[${entry.sourceLang.toUpperCase()} → ${entry.targetLang.toUpperCase()}]`;
          pdf.text(langInfo, margin + 10, yPosition);
          yPosition += 5;
          
          const translatedText = pdf.splitTextToSize(entry.translated, pageWidth - 2 * margin - 10);
          pdf.text(translatedText, margin + 10, yPosition);
          yPosition += translatedText.length * 4.5;
        }

        // Confidence indicator
        if (entry.confidence) {
          pdf.setFontSize(7);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Confianza: ${entry.confidence}%`, margin + 10, yPosition);
        }

        yPosition += 8;
      });
    }

    checkPageBreak(30);

    // Chat Messages Section
    if (chatMessages && chatMessages.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 92, 246);
      pdf.text('Mensajes de Chat', margin, yPosition);
      yPosition += 10;

      chatMessages.forEach((message) => {
        checkPageBreak(25);

        const isReader = message.sender === 'reader';
        
        // Message bubble background
        pdf.setFillColor(isReader ? 236, 72, 153 : 139, 92, 246);
        const messageWidth = 120;
        const messageX = isReader ? margin : pageWidth - margin - messageWidth;
        
        // Timestamp
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(120, 120, 120);
        const msgTime = new Date(message.timestamp).toLocaleTimeString('es-ES');
        pdf.text(msgTime, messageX, yPosition);
        yPosition += 4;

        // Message text
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const messageText = pdf.splitTextToSize(message.text, messageWidth - 10);
        
        const messageHeight = messageText.length * 5 + 6;
        pdf.roundedRect(messageX, yPosition, messageWidth, messageHeight, 2, 2, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.text(messageText, messageX + 5, yPosition + 5);
        yPosition += messageHeight;

        // Translated message
        if (message.translated) {
          yPosition += 2;
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(100, 100, 100);
          const translatedMsg = pdf.splitTextToSize(message.translated, messageWidth - 10);
          pdf.text(translatedMsg, messageX + 5, yPosition);
          yPosition += translatedMsg.length * 4;
        }

        yPosition += 6;
      });
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(150, 150, 150);
    pdf.text('Plataforma Angelical © 2025 - Consulta Espiritual Confidencial', pageWidth / 2, footerY, { align: 'center' });

    // Generate PDF buffer
    const pdfBuffer = pdf.output('arraybuffer');

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=consulta-angelical-${sessionId}.pdf`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Error generating PDF', details: error.message });
  }
}

