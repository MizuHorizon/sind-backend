import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateTwitterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  twitterId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}