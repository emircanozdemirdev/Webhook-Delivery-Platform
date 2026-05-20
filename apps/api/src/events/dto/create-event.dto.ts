import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString, MaxLength, MinLength } from "class-validator";

export class CreateEventDto {
  @ApiProperty({ example: "user.created" })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  eventType!: string;

  @ApiProperty({ example: { id: 1, email: "user@example.com" } })
  @IsObject()
  payload!: Record<string, unknown>;
}
