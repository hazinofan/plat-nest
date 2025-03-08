import { PartialType } from '@nestjs/mapped-types';
import { CreatePlatUserDto } from './create-plat_user.dto';

export class UpdatePlatUserDto extends PartialType(CreatePlatUserDto) {}
