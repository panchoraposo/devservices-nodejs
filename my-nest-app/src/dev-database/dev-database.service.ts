import { Injectable } from '@nestjs/common';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { Client } from 'pg';

@Injectable()
export class DevDatabaseService {
  private container: StartedTestContainer;
  private readonly username = 'testuser';
  private readonly password = 'testpass';
  private readonly database = 'testdb';

  async start() {
    this.container = await new GenericContainer('postgres:15-alpine')
      .withEnvironment({
        POSTGRES_USER: this.username,
        POSTGRES_PASSWORD: this.password,
        POSTGRES_DB: this.database,
      })
      .withExposedPorts(5432)
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections')
      )
      .start();

    const host = this.container.getHost();
    const port = this.container.getMappedPort(5432);

    console.log(`🚀 PostgreSQL started at ${host}:${port}`);
    await this.waitForDatabase(host, port);

    process.env.DB_HOST = host;
    process.env.DB_PORT = port.toString();
    process.env.DB_USERNAME = this.username;
    process.env.DB_PASSWORD = this.password;
    process.env.DB_NAME = this.database;

    console.log('🟢 Contenedor de base de datos listo');
  }

  async stop() {
    if (this.container) {
      await this.container.stop();
      console.log('🛑 Contenedor PostgreSQL detenido');
    }
  }

  private async waitForDatabase(host: string, port: number) {
    const maxAttempts = 10;
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let i = 1; i <= maxAttempts; i++) {
      try {
        console.log(`⏳ Esperando conexión a PostgreSQL (intento ${i})...`);

        const client = new Client({
          host,
          port,
          user: this.username,
          password: this.password,
          database: this.database,
        });

        await client.connect();
        await client.end();

        console.log('✅ Conexión a PostgreSQL verificada');
        return;
      } catch (e) {
        await delay(3000);
      }
    }

    console.error('❌ No se pudo conectar a PostgreSQL después de varios intentos');
    await this.stop();
    process.exit(1);
  }
}