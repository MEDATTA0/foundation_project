import { PartialType } from '@nestjs/swagger';
import { CreateResourceDto } from './create-resource.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @IsString()
  @IsNotEmpty()
  resource: string;
}
