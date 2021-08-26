import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { ArticleEntity } from './entities/article.entity';
import { CommentaireEntity } from './entities/commentaire.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, CommentaireEntity])
  ],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
