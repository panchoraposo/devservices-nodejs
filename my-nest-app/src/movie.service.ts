import movies from './data/movies.json';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async onModuleInit() {
    const count = await this.movieRepository.count();
    if (count === 0) {
      console.log('🎬 Insertando películas iniciales desde JSON...');
      await this.movieRepository.save(movies);
      console.log('✅ Películas iniciales insertadas');
    }
  }

  findAll() {
    return this.movieRepository.find();
  }

  create(movie: Partial<Movie>) {
    return this.movieRepository.save(movie);
  }
}