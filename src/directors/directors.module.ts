import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';

@Module({
  providers: [DirectorsService]
})
export class DirectorsModule {}
