import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { BusinessService } from '../business/business.service';
import { Sale } from './entities/sale.entity';
import { SaleDeduction } from './entities/sale-deduction.entity';
import { StrategyFactory } from 'src/inventory_batches/strategies/strategy.factory';

@Injectable()
export class SalesService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,

    @InjectRepository(SaleDeduction)
    private readonly deductionRepo: Repository<SaleDeduction>,

    private readonly businessService: BusinessService,
    private readonly strategyFactory: StrategyFactory,
  ) {}

  async createSale(dto: CreateSaleDto) {
    // ✅ Idempotency check
    const existingSale = await this.saleRepo.findOne({
      where: { saleReference: dto.saleReference },
    });

    if (existingSale) {
      const deductions = await this.deductionRepo.find({
        where: { saleId: existingSale.id },
      });

      return {
        sale_id: existingSale.id,
        deductions: deductions.map(d => ({
          batch_no: d.batchNo,
          quantity: d.quantity,
        })),
      };
    }

    const business = await this.businessService.findById(dto.businessId);

    // ✅ Transaction starts
    return await this.dataSource.transaction(async manager => {
      const strategy = this.strategyFactory.getStrategy(business.outMode);

      const { deductions } = await strategy.deductStock({
        businessId: dto.businessId,
        productId: dto.productId,
        quantity: dto.quantity,
        batchNo: dto.batchNo,
      });

      const sale = manager.create(Sale, {
        businessId: dto.businessId,
        productId: dto.productId,
        quantity: dto.quantity,
        saleReference: dto.saleReference,
      });

      await manager.save(sale);

      for (const d of deductions) {
        await manager.save(
          manager.create(SaleDeduction, {
            saleId: sale.id,
            batchId: d.batchId,
            batchNo: d.batchNo,
            quantity: d.quantity,
          }),
        );
      }

      return {
        sale_id: sale.id,
        deductions: deductions.map(d => ({
          batch_no: d.batchNo,
          quantity: d.quantity,
        })),
      };
    });
  }
}
