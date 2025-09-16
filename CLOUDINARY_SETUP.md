# 🚀 Configuración de Cloudinary para Producción

## 📋 Pasos para configurar Cloudinary

### 1. **Crear cuenta gratuita**
- Ve a [cloudinary.com](https://cloudinary.com)
- Regístrate gratis (10GB de almacenamiento)
- Anota tu **Cloud Name**

### 2. **Configurar Upload Preset**
```bash
# En tu dashboard de Cloudinary:
1. Ve a Settings → Upload
2. Scroll hasta "Upload presets"
3. Clic en "Add upload preset"
4. Nombre: gallery_uploads
5. Signing Mode: Unsigned
6. Folder: cleopatra-gallery
7. Save
```

### 3. **Actualizar configuración**
```typescript
// En src/services/cloudinaryService.ts
const CLOUDINARY_CONFIG = {
  cloudName: 'TU_CLOUD_NAME_AQUI', // ← Cambiar
  uploadPreset: 'gallery_uploads',
};
```

### 4. **Variables de entorno (opcional)**
```bash
# .env
REACT_APP_CLOUDINARY_CLOUD_NAME=tu_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=gallery_uploads
```

## 🎯 Beneficios en Producción

### ✅ **Espacio ilimitado**
- 10GB gratis (suficiente para miles de imágenes)
- Escalable según necesidades

### ✅ **Optimización automática**
- Compresión inteligente
- Formatos modernos (WebP, AVIF)
- Redimensionado dinámico

### ✅ **CDN global**
- Carga rápida mundial
- Cache automático
- Transformaciones en tiempo real

### ✅ **Múltiples usuarios**
- Cada usuario puede subir contenido
- Sin límites de localStorage
- Sincronización automática

## 🔧 Funcionalidades implementadas

### 📱 **Desarrollo (localStorage)**
- Límite: 25 archivos, 8MB total
- Videos: 5MB máximo
- Imágenes: 1MB máximo

### 🌐 **Producción (Cloudinary)**
- Límite: 50 archivos
- Videos: Sin límite de tamaño
- Imágenes: Sin límite de tamaño
- Optimización automática

## 🚀 Deployment

### **Vercel/Netlify**
```bash
# Build para producción
npm run build

# Las variables de entorno se configuran automáticamente
NODE_ENV=production
```

### **Variables requeridas**
```bash
REACT_APP_CLOUDINARY_CLOUD_NAME=tu_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=gallery_uploads
```

## 📊 Monitoreo

### **Dashboard de Cloudinary**
- Uso de almacenamiento
- Ancho de banda
- Transformaciones
- Estadísticas de uso

### **Límites gratuitos**
- 25,000 transformaciones/mes
- 25GB ancho de banda/mes
- 10GB almacenamiento

## 🔒 Seguridad

### **Upload Preset Unsigned**
- Seguro para frontend
- Sin exposición de API keys
- Configuración de carpetas

### **Validaciones**
- Tipos de archivo permitidos
- Tamaños máximos
- Filtros de contenido

## 🛠️ Troubleshooting

### **Error: Upload preset not found**
```bash
Solución: Verificar que el upload preset esté configurado como "Unsigned"
```

### **Error: Invalid cloud name**
```bash
Solución: Verificar el cloud name en la configuración
```

### **Error: File too large**
```bash
Solución: Configurar límites en el upload preset
```

## 📞 Soporte

- **Documentación**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Comunidad**: [community.cloudinary.com](https://community.cloudinary.com)
- **Soporte**: Disponible en plan gratuito