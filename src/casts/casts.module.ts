import { Module } from '@nestjs/common';
import { CastsService } from './casts.service';

@Module({
  providers: [CastsService]
})
export class CastsModule {}
