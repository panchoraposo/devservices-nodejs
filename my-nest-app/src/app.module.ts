import { Module, Injectable } from '@nestjs/common';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Movie],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class AppModule {}

@Injectable()
export class DevDatabaseService {
  private container: StartedTestContainer;
  private _host: string;
  private _port: number;

  private readonly _username = 'testuser';
  private readonly _password = 'testpass';
  private readonly _database = 'testdb';

  async start() {
    this.container = await new GenericContainer('postgres:15-alpine')
      .withEnvironment({
        POSTGRES_USER: this._username,
        POSTGRES_PASSWORD: this._password,
        POSTGRES_DB: this._database,
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
      .start();

    this._host = this.container.getHost();
    this._port = this.container.getMappedPort(5432);

    console.log(`🚀 PostgreSQL started at ${this._host}:${this._port}`);
  }

  // getters públicos para exponer las propiedades necesarias

  get host(): string {
    return this._host;
  }

  get port(): number {
    return this._port;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get database(): string {
    return this._database;
  }

}
