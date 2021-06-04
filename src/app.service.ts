import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!!';
  }
}
