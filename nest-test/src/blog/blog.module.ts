import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { ArticleEntity } from './entities/article.entity';
import { CommentaireEntity } from './entities/commentaire.entity';
import { TagEntity } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, CommentaireEntity, TagEntity])
  ],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
