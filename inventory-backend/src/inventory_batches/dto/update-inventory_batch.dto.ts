import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory_batch.dto';

export class UpdateInventoryBatchDto extends PartialType(CreateInventoryDto) {}
