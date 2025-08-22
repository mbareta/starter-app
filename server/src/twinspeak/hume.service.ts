import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

const BASE_URL = 'https://api.hume.ai/v0';

const HUME_API_URLS = {
  BATCH_JOBS: `${BASE_URL}/batch/jobs`,
  JOB: (jobId: string) => `${BASE_URL}/batch/jobs/${jobId}`,
  JOB_PREDICTIONS: (jobId: string) => `${BASE_URL}/batch/jobs/${jobId}/predictions`,
} as const;

@Injectable()
export class HumeService {
  constructor(protected configService: ConfigService) { }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(url, {
      headers: {
        'X-Hume-Api-Key': this.configService.get('HUME_API_KEY'),
        ...options.headers,
      },
      ...options,
    });
    return response.json();
  }

  private async getJob(jobId: string): Promise<any> {
    return this.makeRequest(HUME_API_URLS.JOB(jobId), {
      method: 'GET',
    });
  }

  private async waitJob(jobId: string): Promise<any> {
    const job = await this.getJob(jobId);
    if (job.status === 'COMPLETED') return job;
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.waitJob(jobId);
  }

  async upload(buffer: Buffer): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([buffer]);
    formData.append('file', blob);
    const { job_id } = await this.makeRequest(HUME_API_URLS.BATCH_JOBS, {
      method: 'POST',
      body: formData,
    });

    return job_id;
  }

  async getJobPredictions(jobId: string): Promise<any> {
    await this.waitJob(jobId);
    return this.makeRequest(HUME_API_URLS.JOB_PREDICTIONS(jobId), {
      method: 'GET',
    });
  }
}
