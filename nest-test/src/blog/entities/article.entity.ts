import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentaireEntity } from "./commentaire.entity";
import { TagEntity } from "./tag.entity";

@Entity('articles')
export class ArticleEntity {

    @PrimaryGeneratedColumn({name : 'article_id'})
    id: number;

    @Column()
    titre : string;

    @Column({type: 'text'})
    contenu: string;

    @CreateDateColumn()
    dateCreation : Date;

    @Column({type : 'boolean', default: true})
    publier : boolean;

    @Column({type : 'int', default : 0})
    likes: number;

    @OneToMany(type => CommentaireEntity, commentaire => commentaire.article)
    commentaires : CommentaireEntity[];

    @ManyToMany(type => TagEntity)
    @JoinTable({name : 'articles_tags'})
    tags: TagEntity[];
}