# nest-test

Test de création de blog
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
