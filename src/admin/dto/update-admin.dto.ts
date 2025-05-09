import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAdminUserDto } from './create-admin.dto';


export class UpdateAdminUserDto extends PartialType(
  OmitType(CreateAdminUserDto, ['password'] as const),
) {}