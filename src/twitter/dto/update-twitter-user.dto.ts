import { PartialType } from '@nestjs/mapped-types';
import { CreateTwitterUserDto } from './create-twitter-user.dto';

export class UpdateTwitterUserDto extends PartialType(CreateTwitterUserDto) {}