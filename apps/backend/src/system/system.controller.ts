import { Controller, Get, Inject } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(@Inject(SystemService) private readonly systemService: SystemService) {}

  @Get('health')
  getHealth() {
    this.systemService.addLog('SystemAPI', 'INFO', 'Health check dispatched.');
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: this.systemService.getUptime(),
      services: {
        database: 'ONLINE',
        ai_engine: 'ONLINE',
        gateway: 'ONLINE',
      },
    };
  }

  @Get('status')
  getStatus() {
    this.systemService.addLog('SystemAPI', 'INFO', 'Detailed status telemetry fetched.');
    return {
      uptimeSeconds: this.systemService.getUptime(),
      os: osInfo(),
      git: this.systemService.getGitStatus(),
      postgres: this.systemService.getPostgresStatus(),
      providers: {
        gemini: { status: 'ONLINE', latency: '45ms' },
        openai: { status: 'DEGRADED', latency: '220ms' },
        grok: { status: 'ONLINE', latency: '110ms' },
      },
    };
  }

  @Get('services')
  getServices() {
    return this.systemService.getServicesHealth();
  }

  @Get('metrics')
  getMetrics() {
    return this.systemService.getMetrics();
  }

  @Get('logs')
  getLogs(): any[] {
    return this.systemService.getLogs();
  }

  @Get('uptime')
  getUptimeStats() {
    return {
      availabilityPercentage: 99.98,
      downtimeEvents: [],
      recoveryEvents: [],
      history: {
        last24Hours: Array.from({ length: 24 }).map((_, i) => ({
          hour: i,
          status: 'ONLINE',
        })),
        last7Days: Array.from({ length: 7 }).map((_, i) => ({
          day: i,
          status: 'ONLINE',
        })),
        last30Days: Array.from({ length: 30 }).map((_, i) => ({
          day: i,
          status: 'ONLINE',
        })),
      },
    };
  }
}

function osInfo() {
  const os = require('os');
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
  };
}
