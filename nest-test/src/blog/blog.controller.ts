import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { ArticleDto } from 'src/dtos/article.dto';
import { CommentaireDto } from 'src/dtos/commentaire.dto';
import { BlogService } from './blog.service';
@Controller('blog')
export class BlogController {
    
    constructor(
        private readonly blogService: BlogService
    ){}

    @Get()
    @ApiOperation({summary: 'Récupérer des articles'})
        getAll() {
            Logger.log('Récupérer tous les articles', 'BlogController');
            return this.blogService.getArticles();
        }

    @Get(':articleId')
    @ApiParam({name: 'articleId'})
    @ApiOperation({summary: 'Récupérer un article par id'})
        async getById(@Param('articleId') articleId) {
            Logger.log('Récupérer un article', 'BlogController');
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
    @ApiParam({name: 'articleId'})
    @ApiOperation({summary: 'Modifié un article'})
        async update(@Param('articleId') articleId, @Body() articleDto) {
            Logger.log('Modifier un article', 'BlogController');
            const article = await this.blogService.updateArticle(articleId, articleDto);
            if(article)
                return article;
            throw new HttpException('Article non modifié', HttpStatus.NOT_MODIFIED);
        }

    @Delete(':articleId')
    @ApiParam({name: 'articleId'})
    @ApiOperation({summary: 'Supprimer un article'})
        async remove(@Param('articleId') articleId) {
            Logger.log('Supprimer un article', 'BlogController');
            const article = await this.blogService.removeArticle(articleId);
            if(article)
                return article;
            throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
        }
    
    @Post('commentaire/:articleId')
    @ApiParam({name: 'articleId'})
    @ApiOperation({summary: 'Enregistrer un commentaire'})
        async addCommentaire(@Param('articleId') articleId, @Body() commentaireDto: CommentaireDto) {
            const commentaire = await this.blogService.addCommentaire(articleId, commentaireDto);
            if(commentaire)
                return commentaire;
            throw new HttpException('Commentaire non ajouté', HttpStatus.NOT_MODIFIED);
        }
    
    @Post('tag/:tagName')
    @ApiParam({name: 'tagName'})
    @ApiOperation({summary: 'Enregister un Tag'})
        async addTag(@Param('tagName') tagName) {
            const tag = await this.blogService.addTag(tagName);
            if(tag)
                return tag;
            throw new HttpException('tag non ajouté', HttpStatus.NOT_MODIFIED);
        }
    
    @Patch(':articleId/tag/:tagId')
    @ApiParam({name: 'articleId'})
    @ApiParam({name: 'tagId'})
    @ApiOperation({summary: 'Associer un tag à un article'})
    async tagArticle(@Param('articleId') articleId: number, @Param('tagId') tagId: number) {
        const article = await this.blogService.tagArticle(articleId, tagId);
        if(article)
            return article;
        throw new HttpException('Non tagé', HttpStatus.NOT_MODIFIED);
    }
}

