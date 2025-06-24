import { Module } from '@nestjs/common';
import { DevDatabaseService } from './dev-database.service';

@Module({
  providers: [DevDatabaseService],
  exports: [DevDatabaseService],
})
export class DevDatabaseModule {}