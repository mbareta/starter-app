import { Exclude, Expose } from '@nestjs/class-transformer';

@Exclude()
export class CreateCourseDto {
  @Expose()
  sourceId: number;

  @Expose()
  uid: string;

  @Expose()
  name!: string;

  @Expose()
  description: string;

  @Expose()
  structure: object;
}
