import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateAppDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}
