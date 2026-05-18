import { IsArray, IsEnum, IsString, ArrayNotEmpty } from 'class-validator';
import { IncidenceType } from '@prisma/client';

export class CreateIncidenceDto {
  @IsEnum(IncidenceType)
  type!: IncidenceType;

  @IsString()
  areaId!: string;

  @IsString()
  responsibleName!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  equipments!: string[];
}