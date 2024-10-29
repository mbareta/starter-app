import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  client: S3Client;
  bucket: string;
  tailorBucket: string;

  constructor(protected configService: ConfigService) {
    this.tailorBucket = this.configService.get('S3_TAILOR_BUCKET');
    this.bucket = this.configService.get('S3_BUCKET');
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY')
      },
      region: this.configService.get('S3_REGION')
    });
  }

  private getRawData(path: string): Promise<any> {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.tailorBucket,
      Key: `repository/${path}`
    });
    return this.client.send(command);
  }

  private getAsset(path: string): Promise<Uint8Array> {
    return this.getRawData(path).then((res) => res.Body.transformToByteArray());
  }

  private putData(path: string, data: Uint8Array): Promise<any> {
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `repository/${path}`,
      Body: data
    });
    return this.client.send(command);
  }

  getJsonData(path: string): Promise<any> {
    return this.getRawData(path)
      .then((res) => res.Body.transformToString())
      .then((data) => JSON.parse(data));
  }

  getAssetUrl(path: string): Promise<string> {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: `repository/assets/${path}`
    });
    return getSignedUrl(this.client, command);
  }

  transferAssets(paths: string[]): Promise<any> {
    return Promise.all(
      paths.map(async (path) => {
        const data: Uint8Array = await this.getAsset(path);
        return this.putData(path, data);
      })
    );
  }
}
