/**
 * Página de Ejemplos de Notificaciones
 * Muestra todos los tipos de notificaciones disponibles
 */

import React from 'react';
import { useNotifications } from '../components/AngelicalNotifications';
import { 
  Check, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Sparkles,
  ShoppingCart,
  Trash2,
  Heart,
  Star
} from 'lucide-react';

const NotificationExamples = () => {
  const { toast, alert, confirm } = useNotifications();

  const examples = [
    {
      category: 'Toast Notifications',
      items: [
        {
          title: 'Success Toast',
          description: 'Operación exitosa',
          icon: <Check className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-500',
          action: () => toast.success('¡Operación completada exitosamente!')
        },
        {
          title: 'Error Toast',
          description: 'Mensaje de error',
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'from-red-500 to-pink-500',
          action: () => toast.error('Ocurrió un error al procesar tu solicitud')
        },
        {
          title: 'Warning Toast',
          description: 'Advertencia importante',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'from-yellow-500 to-orange-500',
          action: () => toast.warning('Tu sesión expirará en 5 minutos')
        },
        {
          title: 'Info Toast',
          description: 'Información general',
          icon: <Info className="w-5 h-5" />,
          color: 'from-blue-500 to-indigo-500',
          action: () => toast.info('Nueva actualización disponible')
        },
        {
          title: 'Angelical Toast',
          description: 'Mensaje angelical especial',
          icon: <Sparkles className="w-5 h-5" />,
          color: 'from-purple-500 via-pink-500 to-purple-500',
          action: () => toast.angelical('Los ángeles te envían su bendición ✨')
        }
      ]
    },
    {
      category: 'Toast con Título y Acción',
      items: [
        {
          title: 'Producto Agregado',
          description: 'Con botón de acción',
          icon: <ShoppingCart className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-500',
          action: () => toast.success('Producto agregado al carrito', {
            title: '¡Agregado!',
            action: {
              label: 'Ver Carrito',
              onClick: () => console.log('Ir al carrito')
            }
          })
        },
        {
          title: 'Favorito Agregado',
          description: 'Con título personalizado',
          icon: <Heart className="w-5 h-5" />,
          color: 'from-pink-500 to-red-500',
          action: () => toast.success('Agregado a tus favoritos', {
            title: '❤️ ¡Me Gusta!',
            duration: 3000
          })
        }
      ]
    },
    {
      category: 'Modales de Alerta',
      items: [
        {
          title: 'Success Alert',
          description: 'Modal de éxito',
          icon: <Check className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-500',
          action: () => alert.success('Tu pedido ha sido confirmado', {
            title: '¡Pedido Confirmado!',
            confirmLabel: 'Ver Pedido'
          })
        },
        {
          title: 'Error Alert',
          description: 'Modal de error',
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'from-red-500 to-pink-500',
          action: () => alert.error('No se pudo procesar tu solicitud', {
            title: 'Error',
            confirmLabel: 'Reintentar'
          })
        },
        {
          title: 'Warning Alert',
          description: 'Modal de advertencia',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'from-yellow-500 to-orange-500',
          action: () => alert.warning('Esta acción no se puede deshacer', {
            title: 'Advertencia'
          })
        },
        {
          title: 'Info Alert',
          description: 'Modal informativo',
          icon: <Info className="w-5 h-5" />,
          color: 'from-blue-500 to-indigo-500',
          action: () => alert.info('Recuerda completar tu perfil', {
            title: 'Información'
          })
        },
        {
          title: 'Angelical Alert',
          description: 'Modal angelical',
          icon: <Sparkles className="w-5 h-5" />,
          color: 'from-purple-500 via-pink-500 to-purple-500',
          action: () => alert.angelical('Has completado tu primera lectura angelical', {
            title: 'Bendición Angelical ✨',
            confirmLabel: 'Continuar'
          })
        }
      ]
    },
    {
      category: 'Confirmaciones',
      items: [
        {
          title: 'Confirm Delete',
          description: 'Confirmación de eliminación',
          icon: <Trash2 className="w-5 h-5" />,
          color: 'from-red-500 to-pink-500',
          action: async () => {
            const confirmed = await confirm(
              '¿Estás seguro de que deseas eliminar este elemento?',
              {
                title: 'Confirmar Eliminación',
                type: 'warning',
                confirmLabel: 'Sí, Eliminar',
                cancelLabel: 'No, Cancelar'
              }
            );
            
            if (confirmed) {
              toast.success('Elemento eliminado correctamente');
            } else {
              toast.info('Eliminación cancelada');
            }
          }
        },
        {
          title: 'Confirm Purchase',
          description: 'Confirmación de compra',
          icon: <ShoppingCart className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-500',
          action: async () => {
            const confirmed = await confirm(
              '¿Deseas proceder con la compra?',
              {
                title: 'Confirmar Compra',
                type: 'info',
                confirmLabel: 'Sí, Comprar',
                cancelLabel: 'Cancelar'
              }
            );
            
            if (confirmed) {
              toast.angelical('¡Compra realizada! Los ángeles bendicen tu adquisición ✨');
            }
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Notificaciones Angelicales
          </h1>
          <p className="text-gray-600 text-lg">
            Ejemplos de todos los tipos de notificaciones disponibles
          </p>
        </div>

        {/* Categories */}
        {examples.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category.category}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      bg-gradient-to-r ${item.color}
                      rounded-lg p-3 text-white
                      group-hover:scale-110 transition-transform
                    `}>
                      {item.icon}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Click para probar →
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Code Example */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Ejemplo de Código</h3>
          <pre className="text-sm overflow-x-auto">
            <code>{`import { useNotifications } from '../components/AngelicalNotifications';

function MiComponente() {
  const { toast, alert, confirm } = useNotifications();

  // Toast simple
  toast.success('¡Operación exitosa!');

  // Toast con opciones
  toast.success('Producto agregado', {
    title: '¡Agregado!',
    action: {
      label: 'Ver Carrito',
      onClick: () => navigate('/carrito')
    }
  });

  // Alert
  alert.angelical('Bendición recibida ✨', {
    title: 'Mensaje Angelical'
  });

  // Confirmación
  const handleDelete = async () => {
    const confirmed = await confirm('¿Eliminar?');
    if (confirmed) {
      // Eliminar
    }
  };
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default NotificationExamples;

