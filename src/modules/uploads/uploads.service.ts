import { Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class UploadsService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadImage(
    file: Express.Multer.File,
    type: 'producto' | 'categoria' | 'usuario' | 'otro',
  ) {
    const filename = `${type}-${Date.now()}`;

    const result = await this.cloudinaryService.uploadFile(
      file.buffer,
      filename,
      {
        folder: `tienda-wonder/${type}s`,
        tags: [type, 'tienda-wonder'],
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
    );

    return {
      success: true,
      data: {
        url: result.secureUrl,
        thumbnail: this.cloudinaryService.getThumbnailUrl(result.publicId),
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        type,
      },
    };
  }

  async uploadVideo(
    file: Express.Multer.File,
    type: string,
  ) {
    const filename = `${type}-${Date.now()}`;

    const result = await this.cloudinaryService.uploadFile(
      file.buffer,
      filename,
      {
        folder: `tienda-wonder/videos/${type}`,
        tags: ['video', type, 'tienda-wonder'],
        resource_type: 'video',
      },
    );

    return {
      success: true,
      data: {
        url: result.secureUrl,
        publicId: result.publicId,
        type: 'video',
      },
    };
  }

  async deleteFile(publicId: string) {
    const success = await this.cloudinaryService.deleteFile(publicId);

    return {
      success,
      message: success
        ? 'File deleted successfully'
        : 'Failed to delete file',
    };
  }

  generateSignature() {
    return this.cloudinaryService.generateSignature(
      `upload-${Date.now()}`,
      'tienda-wonder',
    );
  }
}
