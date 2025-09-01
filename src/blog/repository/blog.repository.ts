import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class BlogRepository extends BaseRepository<Blog> {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {
    super(blogRepo);
  }


}
