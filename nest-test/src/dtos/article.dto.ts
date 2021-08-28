import { ApiProperty } from "@nestjs/swagger";

export class ArticleDto {

    @ApiProperty()
    titre: string;

    @ApiProperty()
    contenu: string;
}