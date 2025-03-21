import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as mysql from 'mysql2/promise';

// Load environment variables from .env file
config();

async function createDatabase(): Promise<void> {
  const configService = new ConfigService();

  const connection = await mysql.createConnection({
    host: configService.get<string>('DATABASE_HOST'),
    user: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
  });

  const databaseName: string =
    configService.get<string>('DATABASE_NAME') || 'hicabs_db';

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  await connection.end();
}

createDatabase()
  .then(() => {
    console.log('Database checked/created successfully');
  })
  .catch((err: Error) => {
    console.error('Error creating database:', err);
  });
