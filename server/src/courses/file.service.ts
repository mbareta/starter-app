import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

// get catalog
// get assets
// store assets

@Injectable()
export class FileService {
  client: S3Client;

  constructor(protected configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY')
      },
      region: this.configService.get('S3_REGION')
    });
  }

  getData(path) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('S3_TAILOR_BUCKET'),
      Key: `repository/${path}`
    });
    return this.client
      .send(command)
      .then((res) => res.Body.transformToString())
      .then((data) => JSON.parse(data));
  }

  getCatalog() {
    return this.getData('index.json');
  }
}
