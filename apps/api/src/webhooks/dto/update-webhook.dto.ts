import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsUrl } from "class-validator";

export class UpdateWebhookDto {
  @ApiPropertyOptional({ example: "https://example.com/hook" })
  @IsOptional()
  @IsUrl({ protocols: ["http", "https"], require_protocol: true })
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
