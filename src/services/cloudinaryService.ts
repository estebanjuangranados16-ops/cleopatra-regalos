// Servicio de Cloudinary para almacenamiento en la nube
export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
}

// Configuración de Cloudinary desde variables de entorno
const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dxhhdmcbw',
  uploadPreset: 'gallery_uploads',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
};

export class CloudinaryService {
  private config: CloudinaryConfig;

  constructor(config: CloudinaryConfig = CLOUDINARY_CONFIG) {
    this.config = config;
  }

  // Subir archivo a Cloudinary
  async uploadFile(file: File): Promise<{ url: string; publicId: string; thumbnail?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);
    
    // Para videos, especificar resource_type
    if (file.type.startsWith('video/')) {
      formData.append('resource_type', 'video');
    }

    try {
      console.log('Uploading to Cloudinary:', {
        cloudName: this.config.cloudName,
        preset: this.config.uploadPreset,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/${file.type.startsWith('video/') ? 'video' : 'image'}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Cloudinary response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        throw new Error(`Cloudinary error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Cloudinary success:', data.public_id);
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        thumbnail: data.eager?.[0]?.secure_url || data.secure_url
      };
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
    }
  }

  // Eliminar archivo de Cloudinary
  async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
    try {
      // Nota: Para eliminar archivos necesitas configurar el backend
      // Por ahora solo retornamos true
      console.log(`Archivo ${publicId} marcado para eliminación`);
      return true;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', String(error).substring(0, 100));
      return false;
    }
  }

  // Optimizar URL de imagen
  optimizeImageUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}): string {
    if (!url.includes('cloudinary.com')) return url;

    const { width = 800, height = 600, quality = 80, format = 'auto' } = options;
    
    // Insertar transformaciones en la URL de Cloudinary
    const transformations = `c_fill,w_${width},h_${height},q_${quality},f_${format}`;
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  // Generar URL de video con poster
  getVideoWithPoster(url: string): { videoUrl: string; posterUrl: string } {
    if (!url.includes('cloudinary.com')) {
      return { videoUrl: url, posterUrl: url };
    }

    const posterUrl = url.replace('/video/upload/', '/image/upload/').replace(/\.[^.]+$/, '.jpg');
    return {
      videoUrl: url,
      posterUrl: posterUrl
    };
  }
}

export const cloudinaryService = new CloudinaryService();