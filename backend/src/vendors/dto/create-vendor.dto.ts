import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  website?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
