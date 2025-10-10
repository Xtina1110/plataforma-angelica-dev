import React from 'react';

const PageWatermark = ({ showWatermark = false, logoOnly = false }) => {
  if (!showWatermark) return null;

  return (
    <>
      {!logoOnly && (
        <>
          {/* Watermarks de texto distribuidos sutiles pero visibles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            {Array.from({ length: 40 }).map((_, index) => {
              const row = Math.floor(index / 8);
              const col = index % 8;
              return (
                <div
                  key={index}
                  className="absolute select-none"
                  style={{
                    left: `${col * 12 + 6}%`,
                    top: `${row * 20 + 10}%`,
                    color: 'rgba(76, 29, 149, 0.4)',
                    fontSize: '24px',
                    fontFamily: 'Arial, sans-serif',
                    transform: 'rotate(-35deg)',
                    fontWeight: '600',
                  }}
                >
                  el angelólogo
                </div>
              );
            })}
          </div>

          {/* Watermarks adicionales en diagonal opuesta */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            {Array.from({ length: 25 }).map((_, index) => {
              const row = Math.floor(index / 5);
              const col = index % 5;
              return (
                <div
                  key={`diag-${index}`}
                  className="absolute select-none"
                  style={{
                    left: `${col * 20 + 10}%`,
                    top: `${row * 25 + 15}%`,
                    color: 'rgba(88, 28, 135, 0.35)',
                    fontSize: '20px',
                    fontFamily: 'Arial, sans-serif',
                    transform: 'rotate(35deg)',
                    fontWeight: '500',
                  }}
                >
                  el angelólogo
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Solo logos en las esquinas con morado más fuerte */}
      <div className="fixed top-4 left-4 pointer-events-none select-none" style={{ color: 'rgba(68, 20, 130, 0.45)', fontSize: '20px', zIndex: 1, fontWeight: '600' }}>
        © el angelólogo
      </div>
      <div className="fixed top-4 right-4 pointer-events-none select-none" style={{ color: 'rgba(68, 20, 130, 0.45)', fontSize: '20px', zIndex: 1, fontWeight: '600' }}>
        © el angelólogo
      </div>
      <div className="fixed bottom-4 left-4 pointer-events-none select-none" style={{ color: 'rgba(68, 20, 130, 0.45)', fontSize: '20px', zIndex: 1, fontWeight: '600' }}>
        © el angelólogo
      </div>
      <div className="fixed bottom-4 right-4 pointer-events-none select-none" style={{ color: 'rgba(68, 20, 130, 0.45)', fontSize: '20px', zIndex: 1, fontWeight: '600' }}>
        © el angelólogo
      </div>

      {/* Protección CSS adicional */}
      <style jsx>{`
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        input, textarea, [contenteditable] {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }

        img {
          pointer-events: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        @media print {
          .fixed {
            position: absolute !important;
          }
        }
      `}</style>
    </>
  );
};

export default PageWatermark;