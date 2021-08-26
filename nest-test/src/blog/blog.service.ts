import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDto } from 'src/dtos/article.dto';
import { CommentaireDto } from 'src/dtos/commentaire.dto';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CommentaireEntity } from './entities/commentaire.entity';

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articlesRepository : Repository<ArticleEntity>,
        @InjectRepository(CommentaireEntity)
        private readonly CommentaireRepository : Repository<CommentaireEntity>
    ) {}

    getArticles() {
        return this.articlesRepository.find({relations : ['commentaires']})
    }

    async getArticleById(articleId: number) {
        const article = await this.articlesRepository.findOne(articleId);
        if(article)
            return article;
        return null;
    }

    async createArticle(articleDto : ArticleDto) {
        const article = await this.articlesRepository.save(articleDto);
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

    async addCommentaire(articleId, commentaireDto: CommentaireDto) {
        const article = await this.articlesRepository.findOne(articleId, {relations: ['commentaires']});
        if(!article)
            return null;
        const comment = new CommentaireEntity();
        comment.message = commentaireDto.message
        comment.article = article;
        return this.CommentaireRepository.save(comment);
    }
}
