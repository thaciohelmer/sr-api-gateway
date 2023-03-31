import { Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  private logger = new Logger(AwsService.name);

  public async fileUpload(id: string, file: any) {
    const AWS_BUCKET_NAME = this.configService.get<string>('AWS_BUCKET_NAME');
    const AWS_REGION = this.configService.get<string>('AWS_REGION');
    const AWS_ACCESS_KEY_ID =
      this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileName = `${id}${file.originalname.match(/\..+/g)}`;
    this.logger.log(`file name: ${fileName}`);

    const params = {
      Body: file.buffer,
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: 'image/png',
      ACL: 'public-read',
    };

    try {
      const data = await s3.send(new PutObjectCommand(params));
      return {
        url: `https://amazon-clone-course.s3.amazonaws.com/${fileName}`,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
