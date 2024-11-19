import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseAssistantServiceMock {
  async respond(): Promise<any> {
    return Promise.resolve();
  }

  async uploadFile(): Promise<any> {
    return Promise.resolve({ id: '' });
  }

  async deleteFile(): Promise<any> {
    return Promise.resolve();
  }
}
