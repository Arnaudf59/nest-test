import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDto } from 'src/dtos/article.dto';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articlesRepository : Repository<ArticleEntity>
    ) {}

    getArticles() {
        return this.articlesRepository.find()
    }

    async getArticleById(articleId: number) {
        const article = await this.articlesRepository.findOne(articleId);
        if(article)
            return article;
        return null;
    }

    async createArticle(articleDto : ArticleDto) {
        const article = await this.articlesRepository.create(articleDto);
        return article;
    }

    async updateArticle(articleId: number, articleDto: ArticleDto){
        const article = await this.articlesRepository.findOne(articleId)
        if(!article)
            return null;
        await this.articlesRepository.update(articleId, articleDto);
        return await this.articlesRepository.findOne(articleId);
    }

    async removeArticle(articleId: number){
        const article = await this.articlesRepository.findOne(articleId)
        if(!article) 
            return null;
        this.articlesRepository.remove(article);
        return article;
    }
}
