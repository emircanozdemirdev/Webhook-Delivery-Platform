import { ApiPropertyOptional } from "@nestjs/swagger";
import { DeliveryStatus } from "@webhook-delivery-platform/shared";
import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

const DELIVERY_STATUS_VALUES = Object.values(DeliveryStatus);

export class ListDeliveriesQueryDto {
  @ApiPropertyOptional({ enum: DELIVERY_STATUS_VALUES })
  @IsOptional()
  @IsIn(DELIVERY_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({ description: "ISO 8601 start date (inclusive)" })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ description: "ISO 8601 end date (inclusive)" })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: "Cursor (delivery attempt id) for pagination" })
  @IsOptional()
  @IsString()
  cursor?: string;
}
