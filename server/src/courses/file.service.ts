import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';

const isTest = process.env.NODE_ENV === 'test';

const BASE = isTest ? 'test_data/repository' : 'repository';
const getData = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

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

  getCatalog() {
    const bucket = this.configService.get('S3_TAILOR_BUCKET');
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: `${BASE}/index.json`
    });
    return this.client
      .send(command)
      .then((res) => res.Body.transformToString())
      .then((data) => JSON.parse(data));
  }
}
