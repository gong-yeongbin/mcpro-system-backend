import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppClusterService } from './app-cluster/app-cluster.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: false, //엔티티 데코레이터에 없는 프로퍼티 값은 무조건 거름
      // forbidNonWhitelisted: true, //엔티티 데코레이터에 없는 값 인입시 그 값에 대한 에러메세지 알려줌
      transform: true, //컨트롤러가 값을 받을때 컨트롤러에 정의한 타입으로 형변환
    }),
  );

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

// AppClusterService.clusterize(bootstrap);
bootstrap();
