import React, { useState } from 'react';
import { 
  Award, Download, Share2, CheckCircle, ExternalLink,
  Shield, QrCode, Copy, Check, Star, Trophy, Crown,
  Linkedin, Twitter, Facebook, Mail, Link as LinkIcon
} from 'lucide-react';

const CertificateSystem = ({ user }) => {
  const [certificates, setCertificates] = useState([
    {
      id: 'CERT-2025-001',
      courseName: 'Fundamentos de Comunicación Angelical',
      instructor: 'María Luz Angelical',
      completedDate: '2025-10-15',
      issueDate: '2025-10-16',
      blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      verified: true,
      grade: 'Excelente',
      score: 95,
      hours: 8,
      skills: ['Meditación Angelical', 'Interpretación de Mensajes', 'Conexión Divina'],
      credentialUrl: 'https://academy.angelica.com/verify/CERT-2025-001'
    },
    {
      id: 'CERT-2025-002',
      courseName: 'Tarot Angelical Completo',
      instructor: 'Carlos Vidente',
      completedDate: '2025-10-20',
      issueDate: '2025-10-21',
      blockchainHash: '0x8a1bfde2d1e68b8bg77bc5fbe8afde2d1e68b8bg77bc5fbe8d3d3fc8c22b02496',
      verified: true,
      grade: 'Sobresaliente',
      score: 98,
      hours: 12,
      skills: ['Lectura de Tarot', 'Interpretación Angelical', 'Guía Espiritual'],
      credentialUrl: 'https://academy.angelica.com/verify/CERT-2025-002'
    },
    {
      id: 'CERT-2025-003',
      courseName: 'Cristales y Sanación Energética',
      instructor: 'Ana Cristal',
      completedDate: '2025-10-25',
      issueDate: '2025-10-26',
      blockchainHash: '0x9b2cgef3e2f79c9ch88cd6gce9bgef3e2f79c9ch88cd6gce9e4e4gd9d33c13507',
      verified: true,
      grade: 'Excelente',
      score: 92,
      hours: 6,
      skills: ['Cristaloterapia', 'Sanación Energética', 'Equilibrio de Chakras'],
      credentialUrl: 'https://academy.angelica.com/verify/CERT-2025-003'
    }
  ]);

  const [selectedCert, setSelectedCert] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = (cert) => {
    // En producción, esto generaría y descargaría un PDF
    console.log('Descargando certificado:', cert.id);
    alert(`Descargando certificado ${cert.id}...`);
  };

  const handleShare = (cert) => {
    setSelectedCert(cert);
    setShowShareModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToLinkedIn = (cert) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cert.credentialUrl)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = (cert) => {
    const text = `¡Acabo de obtener mi certificado en ${cert.courseName}! 🎓✨`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(cert.credentialUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = (cert) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cert.credentialUrl)}`;
    window.open(url, '_blank');
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'Sobresaliente': return 'text-purple-600 bg-purple-100';
      case 'Excelente': return 'text-blue-600 bg-blue-100';
      case 'Bueno': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeIcon = (grade) => {
    switch(grade) {
      case 'Sobresaliente': return <Crown className="w-5 h-5" />;
      case 'Excelente': return <Trophy className="w-5 h-5" />;
      case 'Bueno': return <Star className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mis Certificados 🏆</h1>
              <p className="text-purple-100 text-lg">Certificados verificables en blockchain</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{certificates.length}</div>
              <div className="text-purple-100">Certificados Obtenidos</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{certificates.reduce((sum, cert) => sum + cert.hours, 0)}h</div>
              <div className="text-purple-100 text-sm">Horas Certificadas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length)}%</div>
              <div className="text-purple-100 text-sm">Promedio General</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-purple-100 text-sm">Verificados</div>
            </div>
          </div>
        </div>

        {/* Blockchain Verification Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Certificación Blockchain</h3>
              <p className="text-gray-600 leading-relaxed">
                Todos tus certificados están registrados en la blockchain de Ethereum, garantizando su autenticidad y 
                permitiendo que cualquier empleador o institución pueda verificar su validez de forma instantánea e inmutable.
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Verificación Instantánea</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Inmutable y Seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">Código QR Único</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div 
              key={cert.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-purple-300"
            >
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-8 h-8" />
                    <div>
                      <div className="text-sm text-purple-100">Certificado de Finalización</div>
                      <div className="font-mono text-xs text-purple-200">{cert.id}</div>
                    </div>
                  </div>
                  {cert.verified && (
                    <div className="flex items-center space-x-1 bg-green-500 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Verificado</span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">{cert.courseName}</h3>
                <p className="text-purple-100">Instructor: {cert.instructor}</p>
              </div>

              {/* Certificate Body */}
              <div className="p-6">
                {/* Grade and Score */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getGradeColor(cert.grade)}`}>
                    {getGradeIcon(cert.grade)}
                    <span className="font-bold">{cert.grade}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">{cert.score}%</div>
                    <div className="text-sm text-gray-500">Calificación Final</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fecha de Finalización:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(cert.completedDate).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Horas de Curso:</span>
                    <span className="font-medium text-gray-800">{cert.hours} horas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fecha de Emisión:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(cert.issueDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">Habilidades Certificadas:</div>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blockchain Hash */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Hash Blockchain:</span>
                    <button
                      onClick={() => copyToClipboard(cert.blockchainHash)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-gray-800 break-all">
                    {cert.blockchainHash}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDownload(cert)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar</span>
                  </button>
                  <button
                    onClick={() => handleShare(cert)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Compartir</span>
                  </button>
                  <button
                    onClick={() => window.open(cert.credentialUrl, '_blank')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Verificar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share Modal */}
        {showShareModal && selectedCert && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Compartir Certificado</h2>
                <button onClick={() => setShowShareModal(false)}>
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => shareToLinkedIn(selectedCert)}
                  className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Linkedin className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">LinkedIn</div>
                    <div className="text-sm text-gray-500">Añadir a tu perfil profesional</div>
                  </div>
                </button>

                <button
                  onClick={() => shareToTwitter(selectedCert)}
                  className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Twitter className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Twitter</div>
                    <div className="text-sm text-gray-500">Compartir tu logro</div>
                  </div>
                </button>

                <button
                  onClick={() => shareToFacebook(selectedCert)}
                  className="w-full flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
                >
                  <Facebook className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Facebook</div>
                    <div className="text-sm text-gray-500">Compartir con amigos</div>
                  </div>
                </button>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">O copia el enlace:</div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedCert.credentialUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedCert.credentialUrl)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CertificateSystem;

