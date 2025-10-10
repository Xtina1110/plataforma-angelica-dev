// Generador de PDF Profesional para Lecturas Angelicales
// Usa HTML renderizado con html2canvas para resultados profesionales

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createWatermarkedCardFront } from './watermarkUtils';

export class ProfessionalPDFGenerator {
  constructor() {
    this.template = this.getHTMLTemplate();
  }

  // Template HTML para página de introducción
  getIntroTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #2D3748;
            background: white;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }
        
        .container {
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: linear-gradient(135deg, #6a0dad 0%, #8B5CF6 50%, #e6e6fa 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            flex-shrink: 0;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2px, transparent 2px),
                              radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 2px, transparent 2px),
                              radial-gradient(circle at 40% 20%, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px, 60px 60px, 30px 30px;
        }
        
        .logo {
            width: 50px;
            height: 50px;
            margin: 0 auto 15px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 10px rgba(106,13,173,0.3);
            position: relative;
            z-index: 1;
        }
        
        .header .subtitle {
            font-size: 1rem;
            opacity: 0.9;
            font-weight: 300;
            position: relative;
            z-index: 1;
        }
        
        .date-info {
            background: rgba(255,255,255,0.15);
            padding: 12px 20px;
            border-radius: 12px;
            margin-top: 15px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
            font-size: 0.9rem;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .intro-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px;
        }
        
        .intro-title {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 600;
            color: #6a0dad;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .intro-info {
            background: linear-gradient(135deg, #e6e6fa 0%, #F5F3FF 100%);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            border-left: 4px solid #6a0dad;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(106, 13, 173, 0.1);
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #6a0dad;
        }
        
        .info-value {
            color: #2D3748;
        }
        
        .intro-quote {
            text-align: center;
            font-style: italic;
            color: #6B7280;
            margin-top: 30px;
            padding: 20px;
            background: rgba(106, 13, 173, 0.05);
            border-radius: 15px;
            font-size: 1rem;
        }
        
        .footer {
            background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
            color: white;
            padding: 20px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .footer-logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #6a0dad, #8B5CF6, #d4af37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .footer-text {
            font-size: 0.8rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">🕊️</div>
            <h1>Lectura Angelical Completa</h1>
            <p class="subtitle">Conectando con la Sabiduría Celestial</p>
            <div class="date-info">
                <strong>Fecha:</strong> {{fecha}}
            </div>
        </header>

        <main class="intro-content">
            <h2 class="intro-title">✨ Tu Lectura Angelical ✨</h2>
            <div class="intro-info">
                <div class="info-row">
                    <span class="info-label">Consultante:</span>
                    <span class="info-value">{{nombre}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tipo de Lectura:</span>
                    <span class="info-value">{{tipo_lectura}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tema de Consulta:</span>
                    <span class="info-value">{{tema_consulta}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Número de Cartas:</span>
                    <span class="info-value">{{num_cartas}}</span>
                </div>
            </div>
            <div class="intro-quote">
                <p>"Los ángeles susurran mensajes de amor y guía a aquellos que abren su corazón para escuchar. Esta lectura es un regalo divino para iluminar tu camino."</p>
            </div>
        </main>

        <footer class="footer">
            <div class="footer-logo">Plataforma Angélica</div>
            <p class="footer-text">Activando tu conexión espiritual</p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  // Template HTML para página de carta individual
  getCardTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #2D3748;
            background: white;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }
        
        .container {
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: linear-gradient(135deg, #6a0dad 0%, #8B5CF6 50%, #e6e6fa 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
            flex-shrink: 0;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 50px 50px;
        }
        
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 700;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
        }
        
        .card-number {
            font-size: 3rem;
            font-weight: 700;
            color: #6a0dad;
            margin-bottom: 20px;
        }
        
        .card-image {
            width: 350px;
            height: 500px;
            object-fit: contain;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(106, 13, 173, 0.3);
            margin-bottom: 25px;
        }
        
        .card-name {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 600;
            color: #6a0dad;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .card-meaning {
            font-size: 1.1rem;
            color: #4A5568;
            text-align: center;
            max-width: 600px;
            line-height: 1.8;
            font-style: italic;
        }
        
        .footer {
            background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
            color: white;
            padding: 15px;
            text-align: center;
            flex-shrink: 0;
            font-size: 0.8rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🃏 Carta Angelical 🃏</h1>
        </header>

        <main class="card-content">
            <div class="card-number">Carta {{numero}}</div>
            <img src="{{card_image}}" alt="{{nombre}}" class="card-image" />
            <h2 class="card-name">{{nombre}}</h2>
            <p class="card-meaning">{{significado}}</p>
        </main>

        <footer class="footer">
            <p>Plataforma Angélica • Tu guía espiritual</p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  // Template HTML para página de resumen
  getSummaryTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #2D3748;
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
        }
        
        .container {
            width: 100%;
            background: white;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #6a0dad 0%, #8B5CF6 50%, #e6e6fa 100%);
            color: white;
            padding: 25px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2px, transparent 2px);
            background-size: 50px 50px;
        }
        
        .logo {
            width: 40px;
            height: 40px;
            margin: 0 auto 10px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 5px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
        }
        
        .header .subtitle {
            font-size: 0.9rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.4rem;
            font-weight: 600;
            color: #6a0dad;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid;
            border-image: linear-gradient(90deg, #6a0dad, #d4af37, #e6e6fa) 1;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-icon {
            font-size: 1.2rem;
        }
        
        .interpretation {
            background: linear-gradient(135deg, #e6e6fa 0%, #F5F3FF 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            border-left: 4px solid #6a0dad;
            position: relative;
        }
        
        .interpretation::before {
            content: '✨';
            position: absolute;
            top: -8px;
            left: 15px;
            background: white;
            padding: 3px 8px;
            border-radius: 20px;
            font-size: 1rem;
        }
        
        .interpretation-text {
            font-size: 0.95rem;
            line-height: 1.7;
            color: #2D3748;
        }
        
        .guidance {
            background: linear-gradient(135deg, #e6e6fa 0%, #F5F3FF 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            border-left: 4px solid #d4af37;
            position: relative;
        }
        
        .guidance::before {
            content: '🌟';
            position: absolute;
            top: -8px;
            left: 15px;
            background: white;
            padding: 3px 8px;
            border-radius: 20px;
            font-size: 1rem;
        }
        
        .guidance-list {
            list-style: none;
            padding: 0;
        }
        
        .guidance-list li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            color: #2D3748;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .guidance-list li::before {
            content: '💫';
            position: absolute;
            left: 0;
            top: 8px;
        }
        
        .affirmations {
            background: linear-gradient(135deg, #e6e6fa 0%, #F5F3FF 100%);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            border-left: 4px solid #d4af37;
            text-align: center;
            position: relative;
        }
        
        .affirmations::before {
            content: '🔮';
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 3px 8px;
            border-radius: 20px;
            font-size: 1rem;
        }
        
        .affirmation-text {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: #6a0dad;
            font-style: italic;
            line-height: 1.5;
        }
        
        .footer {
            background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
            color: white;
            padding: 20px;
            text-align: center;
            margin-top: 30px;
        }
        
        .footer-logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 5px;
            background: linear-gradient(135deg, #6a0dad, #8B5CF6, #d4af37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .footer-text {
            font-size: 0.75rem;
            opacity: 0.8;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #6a0dad, #d4af37, #e6e6fa, transparent);
            margin: 15px 0;
            border-radius: 1px;
        }
        
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">🕊️</div>
            <h1>Resumen de tu Lectura</h1>
            <p class="subtitle">Interpretación y Guía Espiritual</p>
        </header>

        <main class="content">
            <section class="section">
                <h2 class="section-title">
                    <span class="section-icon">✨</span>
                    Interpretación Angelical
                </h2>
                <div class="interpretation">
                    <p class="interpretation-text">{{interpretacion}}</p>
                </div>
            </section>

            <div class="divider"></div>

            <section class="section">
                <h2 class="section-title">
                    <span class="section-icon">🌟</span>
                    Guía Práctica
                </h2>
                <div class="guidance">
                    <ul class="guidance-list">
                        {{guia_html}}
                    </ul>
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">
                    <span class="section-icon">🔮</span>
                    Afirmación Angelical
                </h2>
                <div class="affirmations">
                    <p class="affirmation-text">"{{afirmacion}}"</p>
                </div>
            </section>
        </main>

        <footer class="footer">
            <div class="footer-logo">Plataforma Angélica</div>
            <p class="footer-text">Activando tu conexión espiritual</p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  // Generar PDF profesional con múltiples páginas
  async generatePDF(data) {
    console.log('🎨 === INICIO GENERACIÓN PDF ===');
    console.log('📦 Datos recibidos:', data);
    
    try {
      console.log('🧹 Limpiando datos...');
      const cleanData = this.cleanData(data);
      console.log('✅ Datos limpiados:', {
        fecha: cleanData.fecha,
        nombre: cleanData.nombre,
        tipo: cleanData.tipo_lectura,
        tema: cleanData.tema_consulta,
        numCartas: cleanData.cartas.length
      });
      
      console.log('📄 Creando documento PDF...');
      const pdf = new jsPDF('p', 'mm', 'a4');
      console.log('✅ PDF creado');
      
      // Página 1: Introducción
      console.log('📄 === PÁGINA 1: INTRODUCCIÓN ===');
      try {
        await this.addIntroPage(pdf, cleanData);
        console.log('✅ Página de introducción completada');
      } catch (error) {
        console.error('❌ Error en página de introducción:', error);
        throw error;
      }
      
      // Páginas de cartas individuales
      console.log(`📄 === PÁGINAS 2-${cleanData.cartas.length + 1}: CARTAS ===`);
      for (let i = 0; i < cleanData.cartas.length; i++) {
        try {
          console.log(`\n🃏 Procesando carta ${i + 1}/${cleanData.cartas.length}...`);
          pdf.addPage();
          await this.addCardPage(pdf, cleanData.cartas[i], i + 1);
          console.log(`✅ Carta ${i + 1} completada`);
        } catch (error) {
          console.error(`❌ Error en carta ${i + 1}:`, error);
          throw error;
        }
      }
      
      // Página final: Resumen
      console.log(`\n📄 === PÁGINA ${cleanData.cartas.length + 2}: RESUMEN ===`);
      try {
        pdf.addPage();
        await this.addSummaryPage(pdf, cleanData);
        console.log('✅ Página de resumen completada');
      } catch (error) {
        console.error('❌ Error en página de resumen:', error);
        throw error;
      }
      
      const fileName = `Lectura-Angelical-${cleanData.tipo_lectura.replace(/\s+/g, '-')}-${cleanData.fecha_archivo}.pdf`;
      console.log('✅ === PDF COMPLETADO EXITOSAMENTE ===');
      console.log('📁 Nombre del archivo:', fileName);
      
      return {
        pdf: pdf,
        fileName: fileName,
        success: true
      };

    } catch (error) {
      console.error('❌ === ERROR FATAL EN GENERACIÓN PDF ===');
      console.error('❌ Mensaje:', error.message);
      console.error('❌ Stack:', error.stack);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Agregar página de introducción
  async addIntroPage(pdf, data) {
    const html = this.getIntroTemplate()
      .replace(/{{fecha}}/g, data.fecha)
      .replace(/{{nombre}}/g, data.nombre)
      .replace(/{{tipo_lectura}}/g, data.tipo_lectura)
      .replace(/{{tema_consulta}}/g, data.tema_consulta)
      .replace(/{{num_cartas}}/g, data.cartas.length);

    await this.renderHTMLToPDF(pdf, html);
  }

  // Agregar página de carta individual
  async addCardPage(pdf, carta, numero) {
    console.log(`🃏 Procesando carta ${numero}:`, carta.nombre);

    // Crear imagen con marca de agua
    let cardImage = carta.imagen || '';
    console.log(`🖼️ URL de imagen original: ${cardImage}`);

    if (cardImage) {
      try {
        console.log(`📸 Aplicando marca de agua a carta ${numero}...`);
        const watermarkedImage = await createWatermarkedCardFront(cardImage);
        cardImage = watermarkedImage;
        console.log(`✅ Marca de agua aplicada correctamente`);
      } catch (error) {
        console.error(`❌ Error aplicando marca de agua a carta ${numero}:`, error);
        // Continuar con la imagen original si falla la marca de agua
      }
    }

    const html = this.getCardTemplate()
      .replace(/{{numero}}/g, numero)
      .replace(/{{card_image}}/g, cardImage)
      .replace(/{{nombre}}/g, carta.nombre)
      .replace(/{{significado}}/g, carta.significado);

    console.log(`📄 Renderizando HTML a PDF para carta ${numero}...`);
    await this.renderHTMLToPDF(pdf, html);
    console.log(`✅ Carta ${numero} renderizada`);
  }

  // Agregar página de resumen
  async addSummaryPage(pdf, data) {
    const guiaHtml = data.guia_practica.map(item => `<li>${item}</li>`).join('');
    
    const html = this.getSummaryTemplate()
      .replace(/{{interpretacion}}/g, data.interpretacion)
      .replace(/{{guia_html}}/g, guiaHtml)
      .replace(/{{afirmacion}}/g, data.afirmacion);

    await this.renderHTMLToPDF(pdf, html);
  }

  // Renderizar HTML a PDF
  async renderHTMLToPDF(pdf, html) {
    console.log('🎨 Renderizando HTML a canvas...');
    
    return new Promise((resolve, reject) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '210mm';
      document.body.appendChild(tempDiv);
      console.log('✅ Elemento temporal agregado al DOM');

      // Esperar un poco para que se renderice el DOM
      setTimeout(async () => {
        try {
          console.log('⏳ Esperando fuentes...');
          await this.waitForFonts();
          console.log('✅ Fuentes cargadas');

          console.log('📸 Generando canvas con html2canvas...');
          const canvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 794,
            height: 1123,
            logging: false
          });
          console.log('✅ Canvas generado:', canvas.width, 'x', canvas.height);

          console.log('🖼️ Convirtiendo canvas a imagen...');
          const imgData = canvas.toDataURL('image/png');
          console.log('✅ Imagen convertida, tamaño:', imgData.length);
          
          pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
          console.log('✅ Imagen agregada al PDF');
          
          document.body.removeChild(tempDiv);
          console.log('✅ Elemento temporal removido del DOM');
          
          resolve();
        } catch (error) {
          console.error('❌ Error en renderizado:', error);
          document.body.removeChild(tempDiv);
          reject(error);
        }
      }, 100);
    });
  }

  // Limpiar datos de entrada
  cleanData(data) {
    const now = new Date();
    const fecha = data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : now.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const fechaArchivo = now.toISOString().split('T')[0];

    // Adaptarse al formato de TiradaAngelical
    const tipoTirada = data.tipoTirada || data.tipo_tirada || {};
    const tema = data.tema || {};
    const cartas = data.cartas || [];

    // Generar interpretación automática si no existe
    const interpretacion = data.interpretacion || this.generateInterpretation(cartas, tema);
    const guiaPractica = data.guia_practica || this.generateGuidance(tema);
    const afirmacion = data.afirmacion || this.generateAffirmation(tema);

    return {
      fecha: fecha,
      fecha_archivo: fechaArchivo,
      nombre: this.cleanText(data.nombre || 'Consultante Angelical'),
      tipo_lectura: this.cleanText(tipoTirada.nombre || data.tipo_lectura || 'Tirada Angelical'),
      tema_consulta: this.cleanText(tema.nombre || tema.title || 'Consulta General'),
      cartas: cartas.map((carta, index) => ({
        numero: (index + 1).toString(),
        nombre: this.cleanText(carta.nombre || carta.title || ''),
        significado: this.cleanText(carta.significado || carta.message || carta.descripcion || ''),
        imagen: carta.imagen || carta.imageSrc || carta.src || ''
      })),
      interpretacion: this.cleanText(interpretacion),
      guia_practica: guiaPractica.map(item => this.cleanText(item)),
      afirmacion: this.cleanText(afirmacion)
    };
  }

  // Generar interpretación automática basada en las cartas
  generateInterpretation(cartas, tema) {
    if (!cartas || cartas.length === 0) {
      return 'Los ángeles te envían un mensaje de amor y guía celestial. Esta lectura revela aspectos importantes de tu camino espiritual.';
    }

    const temaTexto = tema?.nombre ? `en el área de ${tema.nombre}` : 'en tu vida';
    return `Esta lectura angelical ${temaTexto} revela ${cartas.length} mensajes divinos que iluminan tu camino. Los ángeles te guían hacia una comprensión más profunda de tu situación actual y te ofrecen sabiduría celestial para avanzar con confianza y amor.`;
  }

  // Generar guía práctica basada en el tema
  generateGuidance(tema) {
    const baseGuidance = [
      'Dedica tiempo diario a la meditación y conexión espiritual',
      'Mantén un diario de gratitud para elevar tu vibración',
      'Confía en tu intuición y en las señales que recibes'
    ];

    const temaGuidance = {
      'Amor y Relaciones': 'Practica el amor incondicional contigo mismo y con los demás',
      'Trabajo y Abundancia': 'Visualiza tu éxito y toma acción inspirada hacia tus metas',
      'Salud y Bienestar': 'Cuida tu cuerpo como el templo sagrado que es',
      'Crecimiento Espiritual': 'Busca momentos de conexión con tu ser superior',
      'Propósito y Misión': 'Escucha la voz de tu alma y sigue tu verdadero llamado'
    };

    if (tema?.nombre && temaGuidance[tema.nombre]) {
      return [...baseGuidance, temaGuidance[tema.nombre]];
    }

    return baseGuidance;
  }

  // Generar afirmación basada en el tema
  generateAffirmation(tema) {
    const affirmations = {
      'Amor y Relaciones': 'Soy un ser digno de amor incondicional y atraigo relaciones armoniosas a mi vida',
      'Trabajo y Abundancia': 'Estoy alineado con la abundancia universal y mi éxito fluye naturalmente',
      'Salud y Bienestar': 'Mi cuerpo es un templo de luz divina, fuerte y radiante',
      'Crecimiento Espiritual': 'Estoy conectado con mi sabiduría interior y mi luz espiritual brilla con intensidad',
      'Propósito y Misión': 'Camino con confianza hacia mi propósito divino, guiado por los ángeles'
    };

    return affirmations[tema?.nombre] || 'Estoy guiado por el amor angelical en cada paso de mi camino';
  }

  // Limpiar texto de caracteres problemáticos
  cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/…/g, '...')
      .replace(/—/g, '-')
      .replace(/–/g, '-')
      .replace(/[^\w\s\.,;:!?¿¡áéíóúñüÁÉÍÓÚÑÜ\-()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Esperar a que las fuentes se carguen
  async waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    } else {
      // Fallback para navegadores que no soportan document.fonts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Descargar PDF
  downloadPDF(pdfResult) {
    if (pdfResult.success) {
      pdfResult.pdf.save(pdfResult.fileName);
      return true;
    }
    return false;
  }
}

// Función de uso fácil para Lovable - Compatible con código existente
export const generateAngelicalPDF = async (data) => {
  const generator = new ProfessionalPDFGenerator();
  const result = await generator.generatePDF(data);
  
  if (result.success) {
    generator.downloadPDF(result);
    return result.fileName;
  } else {
    throw new Error(result.error);
  }
};

// Mantener compatibilidad con código existente
export const generatePdf = generateAngelicalPDF;
export const generatePDF = generateAngelicalPDF;

export default generateAngelicalPDF;
