import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createWatermarkedCardFront } from './watermarkUtils';

export class SessionPDFGenerator {
  constructor() {
    this.doc = null;
    this.pageHeight = 297; // A4 height in mm
    this.pageWidth = 210;  // A4 width in mm
    this.margin = 20;
    this.currentY = this.margin;
  }

  async generateSessionReport(sessionData) {
    try {
      this.doc = new jsPDF('p', 'mm', 'a4');
      this.currentY = this.margin;

      // Add header
      this.addHeader(sessionData);
      
      // Add session overview
      this.addSessionOverview(sessionData);
      
      // Add interpretation section
      if (sessionData.interpretation) {
        this.addInterpretation(sessionData.interpretation);
      }
      
      // Add transcription section
      if (sessionData.transcription) {
        this.addTranscription(sessionData.transcription);
      }
      
      // Add quality metrics
      if (sessionData.metrics) {
        this.addQualityMetrics(sessionData.metrics);
      }
      
      // Add cards used
      if (sessionData.cards) {
        await this.addCardsSection(sessionData.cards);
      }
      
      // Add footer
      this.addFooter();
      
      return this.doc;
    } catch (error) {
      console.error('Error generating session PDF:', error);
      throw error;
    }
  }

  addHeader(sessionData) {
    // Main title
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 0, 130); // Purple color
    this.doc.text('REPORTE DE SESIÓN ANGÉLICA', this.pageWidth / 2, this.currentY, { align: 'center' });
    
    this.currentY += 15;
    
    // Decorative line
    this.doc.setDrawColor(75, 0, 130);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    
    this.currentY += 10;
    
    // Session info
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    const sessionInfo = [
      `Fecha: ${new Date(sessionData.date).toLocaleDateString('es-ES')}`,
      `Duración: ${this.formatDuration(sessionData.duration)}`,
      `Cliente: ${sessionData.clientName || 'No especificado'}`,
      `Lector: ${sessionData.readerName || 'No especificado'}`,
      `ID de Sesión: ${sessionData.sessionId}`
    ];
    
    sessionInfo.forEach(info => {
      this.doc.text(info, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 10;
  }

  addSessionOverview(sessionData) {
    this.addSectionHeader('RESUMEN DE LA SESIÓN');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    
    const overview = [
      `Tipo de consulta: ${sessionData.consultationType || 'General'}`,
      `Pregunta principal: "${sessionData.question || 'Consulta general'}"`,
      `Método utilizado: ${sessionData.method || 'Tirada angelical'}`,
      `Calidad de conexión: ${this.getConnectionQuality(sessionData.connectionQuality)}`,
      `Estado de grabación: ${sessionData.recordingStatus || 'No grabado'}`
    ];
    
    overview.forEach(item => {
      this.doc.text(item, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 10;
  }

  addInterpretation(interpretation) {
    this.addSectionHeader('INTERPRETACIÓN ANGÉLICA');
    
    // Style and AI model info
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(10);
    this.doc.text(`Estilo: ${interpretation.style} | Modelo: ${interpretation.model} | Profundidad: ${interpretation.depth}`, 
                  this.margin, this.currentY);
    this.currentY += 8;
    
    // Interpretation text
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    
    const interpretationText = this.wrapText(interpretation.text, this.pageWidth - 2 * this.margin);
    interpretationText.forEach(line => {
      if (this.currentY > this.pageHeight - 30) {
        this.doc.addPage();
        this.currentY = this.margin;
      }
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    });
    
    // Affirmation
    if (interpretation.affirmation) {
      this.currentY += 5;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('AFIRMACIÓN PERSONAL:', this.margin, this.currentY);
      this.currentY += 6;
      
      this.doc.setFont('helvetica', 'italic');
      const affirmationLines = this.wrapText(`"${interpretation.affirmation}"`, this.pageWidth - 2 * this.margin);
      affirmationLines.forEach(line => {
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 5;
      });
    }
    
    // Suggestions
    if (interpretation.suggestions && interpretation.suggestions.length > 0) {
      this.currentY += 8;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('SUGERENCIAS ANGÉLICAS:', this.margin, this.currentY);
      this.currentY += 6;
      
      this.doc.setFont('helvetica', 'normal');
      interpretation.suggestions.forEach((suggestion, index) => {
        const suggestionText = `${index + 1}. ${suggestion}`;
        const lines = this.wrapText(suggestionText, this.pageWidth - 2 * this.margin - 5);
        lines.forEach(line => {
          this.doc.text(line, this.margin + 5, this.currentY);
          this.currentY += 5;
        });
      });
    }
    
    this.currentY += 10;
  }

  addTranscription(transcription) {
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
    
    this.addSectionHeader('TRANSCRIPCIÓN DE LA SESIÓN');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    
    // Add note about transcription
    this.doc.setFont('helvetica', 'italic');
    this.doc.text('(Transcripción generada automáticamente por IA - Puede contener errores menores)', 
                  this.margin, this.currentY);
    this.currentY += 8;
    
    this.doc.setFont('helvetica', 'normal');
    
    const transcriptionLines = this.wrapText(transcription.text || transcription, this.pageWidth - 2 * this.margin);
    transcriptionLines.forEach(line => {
      if (this.currentY > this.pageHeight - 30) {
        this.doc.addPage();
        this.currentY = this.margin;
      }
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 4;
    });
    
    this.currentY += 10;
  }

  addQualityMetrics(metrics) {
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
    
    this.addSectionHeader('MÉTRICAS DE CALIDAD');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    
    const metricsData = [
      `Calidad de audio: ${this.formatQualityScore(metrics.audioQuality)}`,
      `Estabilidad de conexión: ${this.formatQualityScore(metrics.connectionStability)}`,
      `Claridad de interpretación: ${this.formatQualityScore(metrics.interpretationClarity)}`,
      `Satisfacción del cliente: ${metrics.clientSatisfaction ? this.formatQualityScore(metrics.clientSatisfaction) : 'No evaluado'}`,
      `Tiempo de respuesta promedio: ${metrics.avgResponseTime || 'No medido'}`
    ];
    
    metricsData.forEach(metric => {
      this.doc.text(metric, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    // Add quality chart if available
    if (metrics.qualityChart) {
      this.currentY += 5;
      this.doc.text('Gráfico de calidad durante la sesión:', this.margin, this.currentY);
      this.currentY += 10;
      // Here you could add a simple chart representation
      this.addQualityChart(metrics.qualityChart);
    }
    
    this.currentY += 10;
  }

  async addCardsSection(cards) {
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
    
    this.addSectionHeader('CARTAS UTILIZADAS');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    
    for (const card of cards) {
      // Card name
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${card.nombre || card.name}`, this.margin, this.currentY);
      this.currentY += 6;
      
      // Card description
      this.doc.setFont('helvetica', 'normal');
      const descriptionLines = this.wrapText(card.descripcion || card.description, this.pageWidth - 2 * this.margin);
      descriptionLines.forEach(line => {
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += 5;
      });
      
      this.currentY += 8;
      
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 40) {
        this.doc.addPage();
        this.currentY = this.margin;
      }
    }
  }

  addQualityChart(chartData) {
    // Simple quality representation using rectangles
    const chartWidth = 120;
    const chartHeight = 30;
    const barWidth = chartWidth / chartData.length;
    
    chartData.forEach((value, index) => {
      const barHeight = (value / 100) * chartHeight;
      const x = this.margin + index * barWidth;
      const y = this.currentY;
      
      // Bar color based on quality
      if (value >= 80) {
        this.doc.setFillColor(0, 150, 0); // Green
      } else if (value >= 60) {
        this.doc.setFillColor(255, 165, 0); // Orange
      } else {
        this.doc.setFillColor(255, 0, 0); // Red
      }
      
      this.doc.rect(x, y + chartHeight - barHeight, barWidth - 1, barHeight, 'F');
    });
    
    this.currentY += chartHeight + 10;
  }

  addSectionHeader(title) {
    if (this.currentY > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 0, 130);
    this.doc.text(title, this.margin, this.currentY);
    
    this.currentY += 8;
    
    // Underline
    this.doc.setDrawColor(75, 0, 130);
    this.doc.line(this.margin, this.currentY, this.margin + this.doc.getTextWidth(title), this.currentY);
    
    this.currentY += 8;
    this.doc.setTextColor(0, 0, 0);
  }

  addFooter() {
    const totalPages = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(200, 200, 200);
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
      
      // Footer text
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      
      const footerText = 'Reporte generado por Plataforma Angélica - Confidencial y privado';
      this.doc.text(footerText, this.margin, this.pageHeight - 10);
      
      const pageText = `Página ${i} de ${totalPages}`;
      this.doc.text(pageText, this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' });
      
      const dateText = `Generado: ${new Date().toLocaleString('es-ES')}`;
      this.doc.text(dateText, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }
  }

  // Utility methods
  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = this.doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  formatQualityScore(score) {
    if (typeof score === 'number') {
      if (score >= 90) return `${score}% (Excelente)`;
      if (score >= 80) return `${score}% (Muy bueno)`;
      if (score >= 70) return `${score}% (Bueno)`;
      if (score >= 60) return `${score}% (Regular)`;
      return `${score}% (Necesita mejora)`;
    }
    return score || 'No evaluado';
  }

  getConnectionQuality(quality) {
    const qualityMap = {
      excellent: 'Excelente',
      good: 'Buena',
      fair: 'Regular',
      poor: 'Pobre'
    };
    return qualityMap[quality] || quality || 'No evaluada';
  }

  // Export methods
  save(filename) {
    const timestamp = new Date().toISOString().split('T')[0];
    this.doc.save(filename || `reporte_sesion_${timestamp}.pdf`);
  }

  getBlob() {
    return this.doc.output('blob');
  }

  getDataUrl() {
    return this.doc.output('dataurlstring');
  }
}

// Usage example:
/*
const generator = new SessionPDFGenerator();
const sessionData = {
  sessionId: 'ses_123456',
  date: new Date(),
  duration: 3600,
  clientName: 'María González',
  readerName: 'Ana López',
  consultationType: 'Amor y relaciones',
  question: '¿Cómo puedo mejorar mi relación actual?',
  interpretation: {
    style: 'traditional',
    model: 'gpt-4',
    depth: 'deep',
    text: 'Tu interpretación aquí...',
    affirmation: 'Soy merecedora de amor verdadero',
    suggestions: ['Meditar diariamente', 'Practicar gratitud']
  },
  transcription: { text: 'Transcripción de la sesión...' },
  metrics: {
    audioQuality: 85,
    connectionStability: 92,
    interpretationClarity: 88,
    qualityChart: [80, 85, 90, 88, 92]
  },
  cards: [
    { name: 'Arcángel Miguel', description: 'Protección y fortaleza' }
  ]
};

generator.generateSessionReport(sessionData).then(() => {
  generator.save('mi_sesion_angelical.pdf');
});
*/

export default SessionPDFGenerator;