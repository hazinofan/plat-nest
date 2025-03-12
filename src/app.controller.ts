import { Controller, Get, Param, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Public } from './is-public.decorator';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor() {}

  @Get('public/files/:filename')
  @Public()
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public/files', filename);

    // ✅ Check if file exists before attempting to read it
    if (!existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const file = createReadStream(filePath);
    file.pipe(res);
  }

  @Post('/upload')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const filePath = `${req.protocol}://${req.get('host')}/public/files/${file.filename}`;
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: filePath, // Full URL to the file
    };
  }

  @Post('/upload/multiple')
  @Public()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: 'public/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname); // Save the file with its original name
        },
      }),
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    return files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      path: `${req.protocol}://${req.get('host')}/public/files/${file.filename}`, // Full URL to each file
    }));
  }
}
