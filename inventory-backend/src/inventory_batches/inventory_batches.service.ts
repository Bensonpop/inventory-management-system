import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryBatch } from './entities/inventory_batch.entity';
import { CreateInventoryDto } from './dto/create-inventory_batch.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryBatch)
    private readonly batchRepo: Repository<InventoryBatch>,
  ) {}

  async addInventory(dto: CreateInventoryDto): Promise<InventoryBatch> {
    if (dto.expiryDate && new Date(dto.expiryDate) < new Date(dto.purchaseDate)) {
      throw new BadRequestException(
        'Expiry date cannot be before purchase date',
      );
    }

    const batch = this.batchRepo.create({
      businessId: dto.businessId,
      productId: dto.productId,
      batchNo: dto.batchNo,
      quantity: dto.quantity,
      purchaseDate: new Date(dto.purchaseDate),
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      costPrice: dto.costPrice,
    });

    try {
      return await this.batchRepo.save(batch);
    } catch (error) {
      throw new BadRequestException(
        'Batch already exists for this product and business',
      );
    }
  }

  async getStockSummary(
  businessId: string,
  productId: string,
) {
  const batches = await this.batchRepo.find({
    where: { businessId, productId },
    order: { purchaseDate: 'ASC' },
  });

  const totalQuantity = batches.reduce(
    (sum, batch) => sum + batch.quantity,
    0,
  );

  return {
    businessId,
    productId,
    totalQuantity,
    batches: batches.map(b => ({
      batchNo: b.batchNo,
      quantity: b.quantity,
      purchaseDate: b.purchaseDate,
      expiryDate: b.expiryDate,
    })),
  };
}

}
