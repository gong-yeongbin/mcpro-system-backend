import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { DeveloperService } from './developer.service';

@Controller()
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get('/config')
  async getConfig() {
    return await this.developerService.getConfig();
  }

  @Post('/config')
  async createConfig(@Body() body: { name: string }) {
    await this.developerService.createConfig(body);
  }

  @Put('/config')
  async putConfig(@Body() body: { name: string }) {
    await this.developerService.putConfig(body);
  }
}
