import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Add frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3001; // ✅ Use Render's assigned port
  await app.listen(port, '0.0.0.0'); // ✅ Bind to 0.0.0.0 to allow external connections
  console.log(`Server is running on port ${port}`);
}

bootstrap();

