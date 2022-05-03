import { Injectable, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Injectable()
export class AppService {

  @Inject(ConfigService)
  public config: ConfigService;

  getHello(): string {
    return 'Hello World!';
  }
}
