import { Controller, Get, Post, Param, Inject } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(@Inject(AiService) private readonly aiService: AiService) {}

  @Get('providers')
  getProviders() {
    return this.aiService.getProviders();
  }

  @Post('providers/:id/toggle')
  toggleProvider(@Param('id') id: string) {
    return this.aiService.toggleProvider(id);
  }

  @Post('providers/:id/test')
  testProvider(@Param('id') id: string) {
    return this.aiService.testProvider(id);
  }

  @Get('models')
  getModels() {
    return this.aiService.getModels();
  }

  @Get('chats')
  getChats() {
    return this.aiService.getChats();
  }

  @Get('prompts')
  getPrompts() {
    return this.aiService.getPrompts();
  }

  @Get('logs')
  getLogs() {
    return this.aiService.getLogs();
  }

  @Get('agents')
  getAgents() {
    return this.aiService.getAgents();
  }

  @Post('agents/:id/restart')
  restartAgent(@Param('id') id: string) {
    return this.aiService.restartAgent(id);
  }

  @Get('memory')
  getMemory() {
    return this.aiService.getMemoryUsage();
  }

  @Get('analytics')
  getAnalytics() {
    return this.aiService.getAnalytics();
  }
}
