import { Injectable } from '@nestjs/common';
import { diskStorage, File as MulterFile } from 'multer';
import { join } from 'path';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  // Return Multer storage configuration for local uploads
  getStorage(destination: string) {
    return diskStorage({
      destination,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtName}`);
      },
    });
  }

  // Optional: filter files by mimetype
  imageFileFilter(req: any, file: MulterFile, cb: Function) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }

  // Move file from temp-uploads to uploads folder
  async moveFileToUploads(filename: string): Promise<string> {
    const tempPath = join(process.cwd(), 'uploads', filename);
    const uploadPath = join(process.cwd(), 'uploads', filename);

    // Check if file exists in temp-uploads
    if (!fs.existsSync(tempPath)) {
      throw new Error(`File "${filename}" does not exist in temp-uploads`);
    }

    // Ensure uploads folder exists
    if (!fs.existsSync(join(process.cwd(), 'uploads'))) {
      fs.mkdirSync(join(process.cwd(), 'uploads'));
    }

    return new Promise((resolve, reject) => {
      fs.rename(tempPath, uploadPath, (err) => {
        if (err) return reject(err);
        resolve(uploadPath); // returns the new path
      });
    });
  }

}
