//import './setup-testcontainers';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DevDatabaseService } from './dev-database/dev-database.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let devDbService: DevDatabaseService;

async function bootstrap() {
  /*if (process.env.NODE_ENV === 'development') {
    console.log('🟢 Modo desarrollo: arrancando contenedor de base de datos...');
    devDbService = new DevDatabaseService();
    await devDbService.start();
    console.log('🟢 Contenedor de base de datos listo');
  }*/

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API para gestión de películas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 Aplicación corriendo en http://localhost:3000`);
}

async function shutdown() {
  console.log('\n🧹 Cerrando aplicación...');
  /*if (devDbService) {
    await devDbService.stop();
  }*/
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
