import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Put } from '@nestjs/common';
import { ArticleDto } from 'src/dtos/article.dto';
import { CommentaireDto } from 'src/dtos/commentaire.dto';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
    
    constructor(
        private readonly blogService: BlogService
    ){}

    @Get()
        getAll() {
            Logger.log('Récupérer tous les articles', 'BlogController');
            return this.blogService.getArticles();
        }

    @Get(':articleId') 
        async getById(@Param('articleId') articleId) {
            Logger.log('Récupére un article', 'BlogController');
            const article = await this.blogService.getArticleById(articleId);
            if(article)
                return article;
            throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
        }

    @Post()
        async create(@Body() articleDto: ArticleDto) {
            Logger.log('Créer un article', 'BlogController');
            const article = await this.blogService.createArticle(articleDto);
            if(article)
                return article;
            throw new HttpException('Article non créer', HttpStatus.NOT_MODIFIED);
        }

    @Put(':articleId')
        async update(@Param('articleId') articleId, @Body() articleDto) {
            Logger.log('Modifier un article', 'BlogController');
            const article = await this.blogService.updateArticle(articleId, articleDto);
            if(article)
                return article;
            throw new HttpException('Article non modifié', HttpStatus.NOT_MODIFIED);
        }

    @Delete(':articleId')
        async remove(@Param('articleId') articleId) {
            Logger.log('Supprimer un article', 'BlogController');
            const article = await this.blogService.removeArticle(articleId);
            if(article)
                return article;
            throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
        }
    
    @Post('commentaire/:articleId')
        async addCommentaire(@Param('articleId') articleId, @Body() commentaireDto: CommentaireDto) {
            const commentaire = await this.blogService.addCommentaire(articleId, commentaireDto);
            if(commentaire)
                return commentaire;
            throw new HttpException('Commentaire non ajouté', HttpStatus.NOT_MODIFIED);
        }
    
    @Post('tag/:tagName')
        async addTag(@Param('tagName') tagName) {
            const tag = await this.blogService.addTag(tagName);
            if(tag)
                return tag;
            throw new HttpException('tag non ajouté', HttpStatus.NOT_MODIFIED);
        }
    
    @Patch(':articleId/tag/:tagId')
    async tagArticle(@Param('articleId') articleId: number, @Param('tagId') tagId: number) {
        const article = await this.blogService.tagArticle(articleId, tagId);
        if(article)
            return article;
        throw new HttpException('Non tagé', HttpStatus.NOT_MODIFIED);
    }
}
