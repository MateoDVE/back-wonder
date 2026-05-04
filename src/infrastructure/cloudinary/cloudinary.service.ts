import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

interface UploadOptions {
  folder?: string;
  resource_type?: 'image' | 'video' | 'auto';
  transformation?: any[];
  tags?: string[];
}

interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloudName = this.configService
      .get<string>('CLOUDINARY_CLOUD_NAME')
      ?.trim();
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY')?.trim();
    const apiSecret = this.configService
      .get<string>('CLOUDINARY_API_SECRET')
      ?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  /**
   * Sube un archivo a Cloudinary
   * @param file - Buffer o ruta del archivo
   * @param filename - Nombre del archivo
   * @param options - Opciones de upload
   */
  async uploadFile(
    file: Buffer | string,
    filename: string,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: filename,
          folder: options?.folder || 'tienda-wonder',
          tags: options?.tags || [],
          transformation: options?.transformation,
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.url,
              secureUrl: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          } else {
            reject(new Error('Upload failed: No result or error'));
          }
        },
      );

      if (typeof file === 'string') {
        uploadStream.end(Buffer.from(file));
      } else {
        uploadStream.end(file);
      }
    });
  }

  /**
   * Sube una imagen desde base64
   */
  async uploadBase64(
    base64: string,
    filename: string,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    return this.uploadFile(Buffer.from(base64, 'base64'), filename, options);
  }

  /**
   * Obtiene URL optimizada de una imagen
   */
  getOptimizedUrl(
    publicId: string,
    width?: number,
    height?: number,
    crop: 'fill' | 'fit' | 'scale' = 'fill',
  ): string {
    const transformation: any[] = [];

    if (width || height) {
      transformation.push({
        width,
        height,
        crop,
        quality: 'auto',
        fetch_format: 'auto',
      });
    }

    return cloudinary.url(publicId, {
      secure: true,
      transformation,
    });
  }

  /**
   * Obtiene URL thumbnail de una imagen
   */
  getThumbnailUrl(publicId: string, size = 200): string {
    return this.getOptimizedUrl(publicId, size, size, 'fill');
  }

  /**
   * Elimina un archivo de Cloudinary
   */
  async deleteFile(publicId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.result === 'ok');
        }
      });
    });
  }

  /**
   * Obtiene información de un recurso
   */
  async getResourceInfo(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.api.resource(publicId, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Genera URL de firma para uploads desde frontend
   */
  generateSignature(publicId: string, folder = 'tienda-wonder'): {
    signature: string;
    timestamp: number;
  } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&folder=${folder}&timestamp=${timestamp}${this.configService.get('CLOUDINARY_API_SECRET')}`;

    const crypto = require('crypto');
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    return { signature, timestamp };
  }
}
