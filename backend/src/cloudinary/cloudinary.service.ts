import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary) {}

  async uploadImage(
    file: { buffer: Buffer },
    folder: string,
  ): Promise<{ url: string; publicId: string }> {
    const uploadResult = await new Promise<any>((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(file.buffer);
    });

    return {
      url: uploadResult.secure_url || uploadResult.url,
      publicId: uploadResult.public_id,
    };
  }
}
