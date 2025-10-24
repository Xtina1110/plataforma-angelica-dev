// API para generar PDF de lectura angelical
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      cards,
      interpretation,
      spreadType,
      spreadName,
      question,
      user
    } = req.body;

    const date = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Generar HTML para el PDF
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Georgia', serif;
      color: #333;
      line-height: 1.8;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #9333ea;
    }
    .header h1 {
      color: #9333ea;
      font-size: 32px;
      margin: 0 0 10px 0;
    }
    .header .subtitle {
      color: #666;
      font-size: 18px;
      font-style: italic;
    }
    .header .date {
      color: #999;
      font-size: 14px;
      margin-top: 10px;
    }
    .question-box {
      background: linear-gradient(135deg, #f3e7ff 0%, #e9d5ff 100%);
      padding: 20px;
      border-radius: 10px;
      margin: 30px 0;
      border-left: 5px solid #9333ea;
    }
    .question-box .label {
      font-weight: bold;
      color: #9333ea;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .question-box .text {
      font-size: 18px;
      font-style: italic;
      color: #555;
      margin-top: 10px;
    }
    .section {
      margin: 40px 0;
      page-break-inside: avoid;
    }
    .section-title {
      color: #9333ea;
      font-size: 24px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e9d5ff;
    }
    .overview {
      font-size: 16px;
      text-align: justify;
      margin: 20px 0;
    }
    .card {
      margin: 30px 0;
      padding: 20px;
      background: #fafafa;
      border-radius: 10px;
      border-left: 5px solid #3b82f6;
      page-break-inside: avoid;
    }
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    .card-number {
      background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
      margin-right: 15px;
    }
    .card-title {
      flex: 1;
    }
    .card-position {
      color: #9333ea;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .card-name {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
    .card-content {
      margin: 15px 0;
    }
    .card-content h4 {
      color: #9333ea;
      font-size: 14px;
      margin: 15px 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .card-content p {
      margin: 8px 0;
      text-align: justify;
    }
    .synthesis {
      background: linear-gradient(135deg, #f3e7ff 0%, #e9d5ff 100%);
      padding: 25px;
      border-radius: 10px;
      margin: 30px 0;
      text-align: justify;
    }
    .recommendations {
      margin: 30px 0;
    }
    .recommendation-item {
      padding: 15px;
      margin: 10px 0;
      background: #f9fafb;
      border-left: 4px solid #10b981;
      border-radius: 5px;
    }
    .recommendation-item::before {
      content: "✨ ";
      color: #10b981;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e9d5ff;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .footer .logo {
      color: #9333ea;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✨ Lectura Angelical ✨</h1>
    <div class="subtitle">${spreadName}</div>
    <div class="date">${date}</div>
  </div>

  ${question ? `
  <div class="question-box">
    <div class="label">Tu Pregunta</div>
    <div class="text">"${question}"</div>
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">🌟 Visión General</h2>
    <div class="overview">${interpretation.overview}</div>
  </div>

  <div class="section">
    <h2 class="section-title">🔮 Interpretación de las Cartas</h2>
    ${interpretation.cardInterpretations.map((card, idx) => `
      <div class="card">
        <div class="card-header">
          <div class="card-number">${idx + 1}</div>
          <div class="card-title">
            <div class="card-position">${card.position}</div>
            <div class="card-name">${card.card}</div>
          </div>
        </div>
        <div class="card-content">
          <h4>Interpretación</h4>
          <p>${card.interpretation}</p>
          
          <h4>💜 Mensaje Angelical</h4>
          <p>${card.angelicMessage}</p>
          
          ${card.guidance ? `
            <h4>💡 Guía Práctica</h4>
            <p>${card.guidance}</p>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2 class="section-title">📖 Síntesis de tu Lectura</h2>
    <div class="synthesis">${interpretation.synthesis}</div>
  </div>

  ${interpretation.recommendations && interpretation.recommendations.length > 0 ? `
  <div class="section">
    <h2 class="section-title">✨ Recomendaciones Angelicales</h2>
    <div class="recommendations">
      ${interpretation.recommendations.map(rec => `
        <div class="recommendation-item">${rec}</div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <div class="logo">✨ Plataforma Angélica ✨</div>
    <div>Esta lectura fue generada con amor y luz divina</div>
    <div>Que los ángeles guíen tu camino</div>
  </div>
</body>
</html>
    `;

    // TODO: Implementar generación real de PDF con puppeteer o similar
    // Por ahora, retornamos el HTML
    
    /* 
    Implementación con puppeteer:
    
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Lectura-Angelical-${date}.pdf"`);
    return res.send(pdf);
    */

    // Por ahora, retornamos el HTML para que el navegador lo renderice
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);

  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ 
      error: 'Error al generar PDF',
      details: error.message 
    });
  }
}

