import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ExecutionService } from './execution.service';

@Controller('execution')
export class ExecutionController {
  constructor(@Inject(ExecutionService) private readonly executionService: ExecutionService) {}

  @Get('epics')
  getEpics() {
    return this.executionService.getEpics();
  }

  @Get('approvals')
  getApprovals() {
    return this.executionService.getApprovals();
  }

  @Post('approvals/:id/action')
  processApproval(
    @Param('id') id: string,
    @Body() body: { action: 'APPROVED' | 'REJECTED'; user: string }
  ) {
    return this.executionService.processApproval(id, body.action, body.user || 'shaikh.jnas');
  }

  @Get('queue')
  getQueue() {
    return this.executionService.getQueue();
  }

  @Get('deployments')
  getDeployments() {
    return this.executionService.getDeployments();
  }

  @Get('compliance')
  getCompliance() {
    return this.executionService.getComplianceLogs();
  }

  @Get('quotas')
  getQuotas() {
    return this.executionService.getQuotas();
  }

  @Get('report')
  getReport() {
    return this.executionService.getExecutiveReport();
  }
}
