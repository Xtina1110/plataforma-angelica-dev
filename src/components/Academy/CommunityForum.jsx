import React, { useState } from 'react';
import { 
  MessageCircle, ThumbsUp, Reply, Send, Search, Filter,
  TrendingUp, Star, Users, Clock, Award, Pin, Flag,
  Heart, Bookmark, Share2, MoreVertical, CheckCircle
} from 'lucide-react';

const CommunityForum = ({ courseId, user }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '¿Cómo saber si estoy conectando realmente con mi ángel guardián?',
      content: 'Llevo 3 semanas practicando las meditaciones del curso pero no estoy segura si las sensaciones que experimento son reales o solo mi imaginación. ¿Alguien más ha pasado por esto?',
      author: {
        name: 'María González',
        avatar: '👩',
        level: 8,
        badge: 'Estudiante Activa'
      },
      category: 'Preguntas',
      likes: 24,
      replies: 12,
      views: 156,
      isPinned: true,
      isResolved: false,
      createdAt: '2025-10-25T10:30:00',
      tags: ['meditación', 'conexión', 'ángeles']
    },
    {
      id: 2,
      title: 'Experiencia increíble en la lección 5 🌟',
      content: 'Quiero compartir que durante la meditación guiada de la lección 5 tuve una experiencia muy profunda. Sentí una presencia cálida y vi destellos de luz dorada. ¡Estoy emocionada!',
      author: {
        name: 'Ana Luz',
        avatar: '👩‍🦰',
        level: 12,
        badge: 'Maestra en Entrenamiento'
      },
      category: 'Experiencias',
      likes: 45,
      replies: 18,
      views: 234,
      isPinned: false,
      isResolved: false,
      createdAt: '2025-10-24T15:20:00',
      tags: ['experiencia', 'meditación', 'luz']
    },
    {
      id: 3,
      title: 'Grupo de estudio para practicar juntos',
      content: 'Hola a todos! Estoy organizando un grupo de estudio virtual para practicar las técnicas del curso. Nos reuniríamos los martes y jueves a las 7 PM (hora de Madrid). ¿Quién se apunta?',
      author: {
        name: 'Carlos Vidente',
        avatar: '👨',
        level: 15,
        badge: 'Mentor Certificado'
      },
      category: 'Grupos de Estudio',
      likes: 38,
      replies: 25,
      views: 189,
      isPinned: false,
      isResolved: false,
      createdAt: '2025-10-23T09:15:00',
      tags: ['grupo', 'práctica', 'comunidad']
    },
    {
      id: 4,
      title: 'Duda sobre la jerarquía angelical',
      content: 'En la lección 3 se menciona que los arcángeles están en un nivel superior a los ángeles guardianes. ¿Esto significa que no podemos contactar directamente con arcángeles como Miguel o Rafael?',
      author: {
        name: 'Pedro Espiritual',
        avatar: '👨‍🦱',
        level: 6,
        badge: 'Aprendiz'
      },
      category: 'Preguntas',
      likes: 19,
      replies: 8,
      views: 98,
      isPinned: false,
      isResolved: true,
      createdAt: '2025-10-22T14:45:00',
      tags: ['arcángeles', 'jerarquía', 'teoría']
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todos', icon: MessageCircle, count: 156 },
    { id: 'questions', name: 'Preguntas', icon: HelpCircle, count: 45 },
    { id: 'experiences', name: 'Experiencias', icon: Star, count: 38 },
    { id: 'study-groups', name: 'Grupos de Estudio', icon: Users, count: 12 },
    { id: 'resources', name: 'Recursos', icon: Bookmark, count: 24 }
  ];

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleNewPost = () => {
    if (newPostTitle && newPostContent) {
      const newPost = {
        id: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        author: {
          name: user?.user_metadata?.first_name || 'Usuario',
          avatar: '👤',
          level: 10,
          badge: 'Estudiante'
        },
        category: 'Preguntas',
        likes: 0,
        replies: 0,
        views: 0,
        isPinned: false,
        isResolved: false,
        createdAt: new Date().toISOString(),
        tags: []
      };
      setPosts([newPost, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hace 1 día';
    return `Hace ${diffInDays} días`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Comunidad de Aprendizaje 💬</h1>
              <p className="text-purple-100 text-lg">Conecta, comparte y aprende junto a otros estudiantes</p>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:shadow-xl transition-all flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Nueva Publicación</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">2,450</div>
              <div className="text-purple-100 text-sm">Miembros Activos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">156</div>
              <div className="text-purple-100 text-sm">Discusiones</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">892</div>
              <div className="text-purple-100 text-sm">Respuestas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">12</div>
              <div className="text-purple-100 text-sm">Grupos de Estudio</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      activeTab === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      activeTab === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-200'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Top Contributors */}
              <div className="mt-8">
                <h3 className="font-bold text-gray-800 mb-4">Top Contribuidores</h3>
                <div className="space-y-3">
                  {[
                    { name: 'María Luz', posts: 45, avatar: '👩‍🏫' },
                    { name: 'Carlos V.', posts: 38, avatar: '👨‍🏫' },
                    { name: 'Ana Cristal', posts: 32, avatar: '👩' }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-2xl">{contributor.avatar}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{contributor.name}</div>
                        <div className="text-xs text-gray-500">{contributor.posts} publicaciones</div>
                      </div>
                      <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4 shadow-lg flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en las discusiones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtrar</span>
              </button>
            </div>

            {/* New Post Modal */}
            {showNewPost && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Nueva Publicación</h2>
                    <button onClick={() => setShowNewPost(false)}>
                      <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="¿Cuál es tu pregunta o tema?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Describe tu pregunta o comparte tu experiencia..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setShowNewPost(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleNewPost}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>Publicar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-3xl">{post.author.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-gray-800">{post.author.name}</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Nivel {post.author.level}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {post.author.badge}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{getTimeAgo(post.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.views} vistas</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.isPinned && (
                      <Pin className="w-5 h-5 text-purple-600" />
                    )}
                    {post.isResolved && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Post Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-purple-600 cursor-pointer">
                  {post.title}
                </h3>

                {/* Post Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex items-center space-x-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Reply className="w-5 h-5" />
                      <span className="font-medium">{post.replies} respuestas</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-purple-600">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityForum;

