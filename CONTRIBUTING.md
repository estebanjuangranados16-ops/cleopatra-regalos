# 🤝 Guía de Contribución - Cleopatra Regalos

## 📋 Antes de Empezar

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Instala** las dependencias: `npm install`
4. **Inicia** el servidor de desarrollo: `npm start`

## 🛠️ Configuración del Entorno

### Requisitos
- Node.js 16+
- npm 8+
- Git

### Instalación
```bash
git clone https://github.com/tu-usuario/cleopatra-regalos.git
cd cleopatra-regalos
npm install
npm start
```

## 🔄 Flujo de Trabajo

### 1. Crear una Rama
```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 2. Hacer Cambios
- Sigue las convenciones de código existentes
- Usa TypeScript para nuevos componentes
- Mantén la responsividad en todos los componentes
- Prueba en móviles y desktop

### 3. Commit
```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

### 4. Push y Pull Request
```bash
git push origin feature/nueva-funcionalidad
```

## 📝 Convenciones de Commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Cambios de estilo/formato
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests

## 🎨 Estándares de Código

### React/TypeScript
- Usa componentes funcionales con hooks
- Implementa TypeScript estricto
- Usa Tailwind CSS para estilos
- Implementa Framer Motion para animaciones

### Estructura de Componentes
```tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  // Props tipadas
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Lógica del componente
  
  return (
    <motion.div
      // Animaciones
      className="responsive-classes"
    >
      {/* JSX */}
    </motion.div>
  );
};

export default Component;
```

## 🧪 Testing

- Prueba en Chrome, Firefox, Safari
- Verifica responsividad (móvil, tablet, desktop)
- Prueba funcionalidades de autenticación
- Verifica el sistema de temas (gifts/tech)

## 📱 Responsividad

Usa las clases de Tailwind:
- `sm:` (640px+) - Tablets pequeñas
- `md:` (768px+) - Tablets
- `lg:` (1024px+) - Desktop
- `xl:` (1280px+) - Desktop grande

## 🎯 Áreas de Contribución

### 🔥 Prioridad Alta
- Sistema de pagos real
- Optimización de performance
- Tests automatizados
- Integración con APIs reales

### 🚀 Funcionalidades Nuevas
- Sistema de cupones
- Chat en vivo
- Notificaciones push
- Analytics avanzados

### 🐛 Bugs y Mejoras
- Correcciones de UI/UX
- Optimización de imágenes
- Mejoras de accesibilidad
- Refactorización de código

## 📞 Contacto

- **Issues**: Usa GitHub Issues para reportar bugs
- **Discusiones**: GitHub Discussions para ideas
- **Email**: dev@cleopatraregalos.com

## 🏆 Reconocimientos

Todos los contribuidores serán reconocidos en el README principal.

¡Gracias por contribuir a Cleopatra Regalos! 🎁✨