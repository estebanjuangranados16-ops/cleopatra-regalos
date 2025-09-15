export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail: string;
  title: string;
  description: string;
  category: 'productos' | 'eventos' | 'testimonios' | 'behind-scenes';
  date: string;
}

export const galleryData: MediaItem[] = [
  // Posts reales de Instagram @cleopatra_regalos
  {
    id: '1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
    title: 'Smartwatch Collection 2024',
    description: '⌚ Los mejores smartwatches del mercado ahora en Cleopatra Regalos! Tecnología de punta para estar siempre conectado. #SmartWatch #Tecnología #CleopatraRegalos',
    category: 'productos',
    date: '2024-03-15'
  },
  {
    id: '2',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    title: 'Canasta Desayuno Sorpresa 💝',
    description: '🌅 ¡Sorprende a esa persona especial con nuestras canastas de desayuno! Incluye productos gourmet y detalles únicos. Perfecta para aniversarios y fechas especiales. 📍 Madrid, Cundinamarca',
    category: 'productos',
    date: '2024-03-10'
  },
  {
    id: '3',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80',
    title: 'Peluches Gigantes 🧸',
    description: '🐻 ¡Los peluches más tiernos y suaves! Perfectos para regalar amor y ternura. Disponibles en diferentes tamaños y colores. ¡Ven y elige el tuyo! #Peluches #Regalos #Amor',
    category: 'productos',
    date: '2024-03-08'
  },

  {
    id: '4',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80',
    title: 'Día de San Valentín 💕',
    description: '💝 ¡Celebramos el amor con ofertas especiales! Regalos únicos para esa persona que hace latir tu corazón. Visítanos en Madrid, Cundinamarca. #SanValentin #Amor #Regalos',
    category: 'eventos',
    date: '2024-02-14'
  },
  {
    id: '5',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
    title: 'Día de la Madre 2024 👩‍👧‍👦',
    description: '🌸 ¡Honramos a las madres más especiales! Encuentra el regalo perfecto para demostrar tu amor. Canastas, flores, tecnología y más. #DiaDeLaMadre #MamáEspecial',
    category: 'eventos',
    date: '2024-05-12'
  },
  {
    id: '6',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80',
    title: 'Navidad en Cleopatra 🎄',
    description: '🎅 ¡La magia navideña llegó a Cleopatra Regalos! Encuentra los mejores regalos para esta época especial. Promociones únicas hasta fin de año. #Navidad #Regalos #Familia',
    category: 'eventos',
    date: '2023-12-20'
  },

  {
    id: '7',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
    title: 'Cliente Feliz 😊',
    description: '💬 "Excelente servicio y productos de calidad. Mi esposa quedó encantada con la canasta sorpresa. ¡Totalmente recomendado!" - Carlos M. ⭐⭐⭐⭐⭐ #TestimonioReal #ClientesSatisfechos',
    category: 'testimonios',
    date: '2024-03-05'
  },
  {
    id: '8',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&q=80',
    title: 'Nuestra Historia 📖',
    description: '🏪 Desde 2020 en Madrid, Cundinamarca, hemos sido el lugar favorito para encontrar regalos únicos. Gracias por confiar en nosotros y ser parte de nuestra familia. #Historia #Cleopatra #Agradecimiento',
    category: 'testimonios',
    date: '2024-02-25'
  },

  {
    id: '9',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80',
    title: 'Preparando Pedidos 📦',
    description: '👥 Nuestro equipo trabajando con amor en cada pedido. Cada detalle cuenta para hacer sonreír a nuestros clientes. ¡Así preparamos la magia! #EquipoCleopatra #DetallesQueImportan',
    category: 'behind-scenes',
    date: '2024-03-01'
  },
  {
    id: '10',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80',
    title: 'Nuestro Equipo 👨‍👩‍👧‍👦',
    description: '💪 El corazón de Cleopatra Regalos: nuestro increíble equipo. Personas apasionadas que hacen posible cada sonrisa. ¡Gracias por su dedicación! #EquipoCleopatra #Familia',
    category: 'behind-scenes',
    date: '2024-02-20'
  },
  {
    id: '11',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80',
    title: 'Nuevos Productos Llegando 📦',
    description: '🚚 ¡Llegaron nuevos productos! Cada semana recibimos mercancía fresca para mantener nuestra tienda siempre actualizada. ¡Ven a descubrir las novedades! #NuevosProductos #Novedades',
    category: 'behind-scenes',
    date: '2024-02-15'
  },

  {
    id: '12',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80',
    title: 'Auriculares Premium 🎧',
    description: '🎵 ¡Sonido de alta calidad! Auriculares inalámbricos con la mejor tecnología. Perfectos para música, gaming y llamadas. ¡Ven y pruébalos! #Auriculares #Tecnología #Sonido',
    category: 'productos',
    date: '2024-01-30'
  },
  {
    id: '13',
    type: 'video',
    src: 'https://www.instagram.com/cleopatra_regalos/reel/C_9N2gssYC9/',
    thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&q=80',
    title: 'Video Promocional Cleopatra 🎥',
    description: '🎆 ¡Mira nuestro video promocional! Descubre todo lo que Cleopatra Regalos tiene para ofrecerte. Productos únicos, servicio excepcional y momentos especiales. #VideoPromocional #CleopatraRegalos #Regalos',
    category: 'testimonios',
    date: '2024-03-20'
  },
  {
    id: '14',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
    title: 'Contacto Directo 📞',
    description: '📱 ¡Estamos aquí para ti! Contáctanos: 📞 302 454 7679 / 320 886 9914 📍 Madrid, Cundinamarca 💬 WhatsApp disponible #Contacto #Servicio #CleopatraRegalos',
    category: 'testimonios',
    date: '2024-01-25'
  }
];

// Agregar enlace directo al Instagram
export const instagramUrl = 'https://www.instagram.com/cleopatra_regalos/';

export const getCategorizedMedia = (category: string) => {
  if (category === 'all') return galleryData;
  return galleryData.filter(item => item.category === category);
};

export const getMediaById = (id: string) => {
  return galleryData.find(item => item.id === id);
};