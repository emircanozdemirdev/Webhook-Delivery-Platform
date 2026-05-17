import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsUrl } from "class-validator";

export class CreateWebhookDto {
  @ApiProperty({ example: "https://example.com/hook" })
  @IsUrl({ protocols: ["http", "https"], require_protocol: true })
  url!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
