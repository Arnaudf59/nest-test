import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticleEntity } from "./article.entity";

@Entity('commentaire')
export class  CommentaireEntity {
    
    @PrimaryGeneratedColumn({name : 'commentaire_id'})
    id: number;

    @Column({type : 'text'})
    message : string;

    @CreateDateColumn()
    DateCreation : Date;

    @ManyToOne(type => ArticleEntity, article => article.commentaires, {onDelete: 'CASCADE'})
    article : ArticleEntity;
}