import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { AiModule } from './ai/ai.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { ExecutionModule } from './execution/execution.module';

@Module({
  imports: [
    SystemModule,
    AiModule,
    KnowledgeModule,
    ExecutionModule,
  ],
})
export class AppModule {}
