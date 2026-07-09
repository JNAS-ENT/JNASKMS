import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(@Inject(KnowledgeService) private readonly knowledgeService: KnowledgeService) {}

  @Get('documents')
  getDocuments() {
    return this.knowledgeService.getDocuments();
  }

  @Post('ingest')
  ingestDocument(@Body() body: { title: string; type: string; source: string }) {
    return this.knowledgeService.ingestDocument(body.title, body.type, body.source);
  }

  @Get('graph')
  getGraph() {
    return this.knowledgeService.getGraph();
  }

  @Get('insights')
  getInsights() {
    return this.knowledgeService.getInsights();
  }

  @Get('search-history')
  getSearchHistory() {
    return this.knowledgeService.getSearchHistory();
  }

  @Post('ask')
  askAssistant(@Body() body: { query: string }) {
    return this.knowledgeService.askAssistant(body.query);
  }

  @Get('search')
  searchKnowledge(@Query('q') query: string) {
    const results = this.knowledgeService.getDocuments().filter(doc =>
      doc.title.toLowerCase().includes((query || '').toLowerCase()) ||
      doc.type.toLowerCase().includes((query || '').toLowerCase())
    );
    return {
      results,
      query,
      timestamp: new Date().toISOString(),
    };
  }
}
