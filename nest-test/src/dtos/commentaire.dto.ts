import { ApiProperty } from "@nestjs/swagger";

export class CommentaireDto {

    @ApiProperty()
    message : string;
}