import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Inventory Management System')
    .setDescription('FIFO / FEFO / BATCH based inventory deduction')
    .setVersion('1.0')
    .addTag('Business')
    .addTag('Inventory')
    .addTag('Sales')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
    console.log('Application is running on http://localhost:3000');

}
bootstrap();
