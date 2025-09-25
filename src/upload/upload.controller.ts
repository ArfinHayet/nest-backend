import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { UploadService } from './upload.service';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', UploadController.getMulterOptions(new UploadService())),
  )

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async uploadFile(@UploadedFile() file: MulterFile) {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      return sendResponse(
        {
          filename: file.filename,
          path: file.path,
        },
        'File uploaded successfully',
        201,
      );
    } catch (error) {
      console.error('Upload error:', error);

      return sendResponse(
        { error: error || 'Unknown error occurred' },
        'File upload failed',
        500,
      );
    }
  }

  // Factory function that calls service methods
  private static getMulterOptions(service: UploadService) {
    return {
      storage: service.getStorage('./temp-uploads'),
      fileFilter: service.imageFileFilter.bind(service),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    };
  }
}
