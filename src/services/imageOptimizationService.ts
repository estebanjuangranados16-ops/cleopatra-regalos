// Servicio de optimización de imágenes local
export const imageOptimizationService = {
  // Comprimir imagen a base64 optimizado
  async compressToBase64(file: File, maxWidth = 400, maxHeight = 300, quality = 0.6): Promise<string> {
    return new Promise((resolve, reject) => {
      // Timeout de 5 segundos
      const timeout = setTimeout(() => {
        reject(new Error('Timeout: La imagen tardó mucho en procesarse'));
      }, 5000);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        clearTimeout(timeout);
        reject(new Error('No se pudo crear el contexto del canvas'));
        return;
      }

      img.onload = () => {
        clearTimeout(timeout);
        
        let { width, height } = img;
        
        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con calidad optimizada
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Error al cargar la imagen'));
      };

      // Crear URL temporal para la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Error al leer el archivo'));
      };
      reader.readAsDataURL(file);
    });
  },

  // Validar archivo de imagen
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Verificar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Solo se permiten archivos de imagen' };
    }

    // Verificar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo es muy grande. Máximo 5MB' };
    }

    // Verificar formatos soportados
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      return { valid: false, error: 'Formato no soportado. Use JPG, PNG o WebP' };
    }

    return { valid: true };
  },

  // Generar placeholder mientras carga
  generatePlaceholder(width = 400, height = 300, text = 'Cargando...'): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = width;
    canvas.height = height;
    
    // Fondo gris
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Texto centrado
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL('image/png');
  },

  // Crear thumbnail rápido
  async createThumbnail(imageUrl: string, size = 100): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        reject(new Error('No se pudo crear el contexto del canvas'));
        return;
      }

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        
        // Dibujar imagen cuadrada (crop center)
        const minDimension = Math.min(img.width, img.height);
        const x = (img.width - minDimension) / 2;
        const y = (img.height - minDimension) / 2;
        
        ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => {
        reject(new Error('Error al crear thumbnail'));
      };

      img.src = imageUrl;
    });
  }
};