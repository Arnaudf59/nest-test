# nest-test

Test de création de blog

Bdd : ``SQL``
Base de données: ``test_nestjs`` 
## Installation 

dans le CMD, installer au global

```shell
npm install -g @nestjs/cli
```

Créer un nouveau projet

```shell
nest new my-nest-project
cd my-nest-project
npm run start:dev
```

## Création de module 

```shell
nest g module nomDuModule
```
## Création de controller 

```shell
nest g co nomDuController
```

## Création debut methode

**Get :**
```ts
@Get()
    getAll() {
        //Message afficher à chaque requête
        Logger.log('Récupérer tous les articles', 'BlogController');
        return [];
    }
```
**Get By Id:**
```ts
@Get(':articleId') 
    getById(@Param('articleId') articleId) {
        Logger.log('Récupére un article', 'BlogController');
        return 'Un article';
    }
```
**Post:**
```ts
@Post()
    create(@Body() articleDto) {
        Logger.log('Créer un article', 'BlogController');
        return 'Article créer';
    }
```
**Put:**
```ts
@Put(':articleId')
    update(@Param('articleId') articleId, @Body() articleDto) {
        Logger.log('Modifier un article', 'BlogController');
        return 'Article Modifier';
    }
```
**Delete:**
```ts
@Delete(':articleId')
    remove(@Param('articleId') articleId) {
        Logger.log('Supprimer un article', 'BlogController');
        return 'Article supprimé';
    }
```
## Connection à la bdd

Documentation : https://typeorm.io/#/

```shell
npm install --save @nestjs/typeorm typeorm mysql
```
où
```shell
npm i mysql @nestjs/typeorm typeorm
```
### Les Entity

Créer un dossier **``entities``**

puis un fichier pour chaque ``entity`` au format nomEntity.entity.ts

L'entity est une classe qui conrespond à une table de notre bdd

Cela se presente sous cette forme :

```ts
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    id: number;

    titre : string;

    contenu: string
}
```
``@PrimaryGeneratedColumn()`` permet de définir la clé primaire de la table.
il est possible de modifier le nom de l'id comme ceci:
``@PrimaryGeneratedColumn({name : 'nomId'})``
```ts
@Entity()
export class ArticleEntity {

    @PrimaryGeneratedColumn({name : 'article_id'})
    id: number;

    titre : string;

    contenu: string
}
```

Les autres son des colonnes, on utilise le ``@Column()``
il est posible de donner le *type* -> ``@Column({type: 'typeChoisi'})``
```ts
@Entity()
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre : string;

    @Column({type: 'text'})
    contenu: string
}
```
On peut aussi mettre une date
```ts
@CreateDateColumn()
dateCreation : Date;
```
Ou un boolean (par default, la valeur est à false)
```ts
@Column({type : 'boolean'})
publier : boolean;
```
Mais on peut modifier la valeur par default
```ts
@Column({type : 'boolean', default : true})
publier : boolean;
```
### Connection à la bdd

Création d'un fichier ``ormconfig.json``
il sagit d'un objet:
qui contient le type de connection,
```json
{
    "type" : "mysql"
}
```
le host (par default pour mysql c'est ``localhost``),
```json
{
    "host": "localhost"
}
```
le port (par default pour mysql c'est ``3306``),
```json
{
    "port": 3306
}
```
le username,
```json
{
    "username": "root"
}
```
le password,
```json
{
    "password": "password"
}
```
la database,
```json
{
    "database": "nomBdd"
}
```
la synchronisation automatique,
```json
{
    "synchronize": true
}
```
on peut afficher les requête que l'on execute,
```json
{
    "logging": true
}
```
et enfin l'entities (pour lui dire qu'elle fichier correspond à la bdd)
```json 
{
    "entities" : ["scr/**/**.entity.{ts,js}"]
}
```
Ici, on lui dit que qu'importe longueur du dossier, tout les fichier qui on comme racine ``**.entity.ts`` ou ``**.entity.js`` comme fichier bdd

exemple de fichier pour connection à mysql 
```json
{
    "type" : "mysql",
    "username" : "root",
    "password" : "",
    "database" : "blog",
    "synchronize" : true,
    "logging" : true,
    "entities" : ["src/**/**.entity.{ts,js}"]
}
```
## Création de services
 Pour créer un service il faut saisir la commande
 ```shell
 nest g service blog
 ```
Dans le service, il faut appeler nos dépendance 
```ts
constructor(
    @InjectRepository(EntitéUtilisé)
    private readonly articlesRepository : Repository<EntitéUtilisé>
) {}
```
ensuite, on peut créer nos méthode
```ts
getArticles() {
        return this.articlesRepository.find()
}
```
Ensuite dans le controller:

Il faut d'abord l'injecter
```ts
constructor(
    private readonly blogService: BlogService
){}
```
et modifier les methodes 
```ts
@Get()
    getAll() {
        Logger.log('Récupérer tous les articles', 'BlogController');
        return this.blogService.getArticles();
    }
```

Ensuite, la methode GetById
Dans le services
1er, d'abord faire la méthode
```ts
getArticleById(articleId: number) {
    return this.articlesRepository.findOne(articleId)
}
```
2eme dans le controller, modifier le return
```ts
getById(@Param('articleId') articleId) {
    Logger.log('Récupére un article', 'BlogController');
    return this.blogService.getArticleById(articleId);
}
```
3eme Gérer le cas si l'article n'existe pas 
D'abord, comme on recupère un promise, on rajoute ``async`` et ``await`` 
puis on verifie si l'article existe
```ts
async getArticleById(articleId: number) {
    const article = await this.articlesRepository.findOne(articleId);
    if(article)
        return article;
    return null;
}
```
4eme Remodifier le controller 
```ts
async getById(@Param('articleId') articleId) {
    Logger.log('Récupére un article', 'BlogController');
    const article = await this.blogService.getArticleById(articleId);
    if(article)
        return article;
    throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
}
```
Methode Post
Dans le service
```ts
    async createArticle(articleDto : ArticleDto) {
        const article = await this.articlesRepository.create(articleDto);
        return article;
    }
```
Dans le controller
```ts
async create(@Body() articleDto: ArticleDto) {
    Logger.log('Créer un article', 'BlogController');
    const article = await this.blogService.createArticle(articleDto);
    if(article)
        return article;
    throw new HttpException('Article non créer', HttpStatus.NOT_MODIFIED);
}
```
Methode Put:
Dans le service
```ts
async updateArticle(articleId: number, articleDto: ArticleDto){
    const article = await this.articlesRepository.findOne(articleId)
    if(!article)
        return null;
    await this.articlesRepository.update(articleId, articleDto);
    return await this.articlesRepository.findOne(articleId);
}
```
Puis dans le controller
```ts
async update(@Param('articleId') articleId, @Body() articleDto) {
    Logger.log('Modifier un article', 'BlogController');
    const article = await this.blogService.updateArticle(articleId, articleDto);
    if(article)
        return article;
    throw new HttpException('Article non modifié', HttpStatus.NOT_MODIFIED);
}
```
## Many-to-One and One-to-Many
Commençons par créer une nouvelle entité.

Commentaires :

```ts
@Entity('commentaire')
export class  CommentaireEntity {
    
    @PrimaryGeneratedColumn({name : 'commentaire_id'})
    id: number;

    @Column({type : 'text'})
    message : string;

    @CreateDateColumn()
    DateCreation : Date;
}
```
Un commentaire et ratacher à un article, il faut donc rajouter une clé étrangère à la table commentaire

Pour cela, dans le ``article.entity.ts`` mettre:
```ts
@OneToMany(type => CommentaireEntity, commentaire => commentaire.article)
commentaires : CommentaireEntity[];
```

Et dans le fichier ``commentaire.entity.ts`` mettre:
```ts
@ManyToOne(type => ArticleEntity, article => article.commentaires)
article : ArticleEntity;
```

Et l'on créait notre fichier ``commentaire.dto.ts``
```ts
export class CommentaireDto {
    message : string;
}
```
### Ajouter un commentaire

Dans blog.service.ts créons la methode pour ajouter un commentaire

Mais avant, il faut injecter notre commentaire.entity dans ``le constructor``
```ts
@InjectRepository(CommentaireEntity)
private readonly CommentaireRepository : Repository<CommentaireEntity>
```
Dans **``blog.module``**, il faut indiqué que l'on va utiliser une autre entity
```ts
imports: [
    TypeOrmModule.forFeature([ArticleEntity, CommentaireEntity])
]
```
Maintenant, on peut créer notre méthode pour ajouter un commentaire
```ts
async addCommentaire(articleId, commentaireDto: CommentaireDto) {
    const article = await this.articlesRepository.findOne(articleId, {relations: ['commentaires']});
```
on recupere notre article qui va être commenté

``{relations: ['commentaires']}`` permet d'afficher les commentaire relier à l'article

on créer une const commentaire qui contient les information de notre commentaire
```ts
async addCommentaire(articleId, commentaireDto: CommentaireDto) {
    const article = await this.articlesRepository.findOne(articleId, {relations: ['commentaires']});
    if(!article)
        return null;
    const comment = new CommentaireEntity();
    comment.message = commentaireDto.message
    comment.article = article;
    return this.CommentaireRepository.save(comment);
}
```
Dans le controller de notre blog, on peut créer notre methode **``POST``**
```ts
@Post('commentaire/:articleId')
    async addCommentaire(@Param('articleId') articleId, @Body() commentaireDto: CommentaireDto) {
        const commentaire = await this.blogService.addCommentaire(articleId, commentaireDto);
        if(commentaire)
            return commentaire;
        throw new HttpException('Commentaire non ajouté', HttpStatus.NOT_MODIFIED);
    }
```
### Modification de la méthode delete
Comme l'on a rajouté une clé etrangère dans la table commentaire, il ne faut pas oublier de rajouter une option pour faire la suppression en cascade et permettre lors de la suppression d'un article, de supprimer les commentaire attaché a cette article
Dans commentaire.entity.ts modifier le **``ManyToOne``** et rejouter l'option ``onDelete``

```ts
@ManyToOne(type => ArticleEntity, article => article.commentaires, {onDelete: 'CASCADE'})
article : ArticleEntity;
```
## ManyToMany

``ManyToMany`` permet la création de table de liaison 

Pour cela, il faut d'abord créer un ``tag.entity.ts`` pour créer une table tag
```ts
@Entity('tags')
export class TagEntity {

    @PrimaryGeneratedColumn({name: 'tag_id'})
    id: number;

    @Column()
    name: string;
}
```
et l'importer dans le ``blog.module.ts``
```ts
imports: [
    TypeOrmModule.forFeature([ArticleEntity, CommentaireEntity, TagEntity])
]
```
Pour créer un table de liaison, il faut la declarer dans les deux entités, ``article`` et ``tag``

D'abord dans article
```ts
@ManyToMany(type => TagEntity)
tags: TagEntity[];
```
Puis dans tag
```ts
@ManyToMany(type => ArticleEntity)
articles: ArticleEntity[];
```
Ensuite, il faut créer la table de jointure dans le fichier qui est principale, dans notre cas, dans l'entité article
```ts
@ManyToMany(type => TagEntity)
@JoinTable({name : 'articles_tags'})
tags: TagEntity[];
```
Après la création de nos tables ``tags`` et ``articles_tags``, l'on peut créer nos requettes.

D'abord, on va ajouter un tag, et pour cela ,il faut d'abord l'injecter dans le constructeur
```ts
@InjectRepository(TagEntity)
private readonly TagsRepository : Repository<TagEntity>
```
puis on ajoute notre méthode d'ajout de tag
```ts
async addTag(name: string) {
    let tag  = new TagEntity();
    tag.name = name;
    tag = await this.TagsRepository.save(tag);
    if(tag)
        return tag;
    return null;
}
```
puis on l'appel dans notre controller
```ts
@Post('tag/:tagName')
    async addTag(@Param('tagName') tagName) {
        const tag = await this.blogService.addTag(tagName);
        if(tag)
            return tag;
        throw new HttpException('tag non ajouté', HttpStatus.NOT_MODIFIED);
    }
```
Après avoir ajouter des tags, il nous reste à lié un tag à un article. d'abord dans le service:
```ts
async tagArticle(articleId, tagId) {
    const article = await this.articlesRepository.findOne(articleId, {relations: ['tags']});
    if(!article)
        return null;
    const tag = await this.TagsRepository.findOne(tagId);
    if(!tag)
        return null;
    article.tags.push(tag);
    await this.articlesRepository.save(article);
    return this.articlesRepository.findOne(articleId, {relations: ['tags', 'commentaires']});
}
```
Puis dans le controller pour l'envoyer dans la bdd
```ts
@Patch(':articleId/tag/:tagId')
    async tagArticle(@Param('articleId') articleId: number, @Param('tagId') tagId: number) {
        const article = await this.blogService.tagArticle(articleId, tagId);
        if(article)
            return article;
        throw new HttpException('Non tagé', HttpStatus.NOT_MODIFIED);
    }
```
## Swagger 
installation:

```shell
npm i @nestjs/swagger swagger-ui-express
```

Ensuite dans ``main.ts`` rajouter le code de config
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog app')
    .setDescription('Api Blog')
    .setVersion('1.0')
    .addTag('news')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
```
Ensuite, il est possible d'y accéder sur l'URL: ``localhost:3000/api/``

Toutes les requêtes sans parametre sont fonctionnelle. Par contre les requête avec des parametres ne fonctionne pas encore, pour ça, dans le controler il faut dire à swagger qu'il y a un parametre. Pour cela, il faut rajouter: 
```ts
@ApiParam({name: 'articleId'})
```
L'on peut aussi lui donner un titre avec :
```ts
@ApiOperation({summary: 'Récupéré un article par id'})
```
Au final cela nous donne:
```ts
@Get(':articleId')
@ApiParam({name: 'articleId'})
@ApiOperation({summary: 'Récupéré un article par id'})
    async getById(@Param('articleId') articleId) {
        Logger.log('Récupére un article', 'BlogController');
        const article = await this.blogService.getArticleById(articleId);
        if(article)
            return article;
        throw new HttpException('Article non trouvé', HttpStatus.NOT_FOUND);
    }
```
Swagger permet aussi la visualisation des schema, pour cela il faut rajouter dans nos fichier dto : 
```ts
export class CommentaireDto {

    @ApiProperty()
    message : string;
}
```
