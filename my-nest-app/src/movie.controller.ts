import { Controller, Get, Post, Body } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getAll() {
    return this.movieService.findAll();
  }

  @Post()
  create(@Body() movieData: { title: string; description?: string }) {
    return this.movieService.create(movieData);
  }
}