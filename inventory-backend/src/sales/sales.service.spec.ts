import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDeduction } from './entities/sale-deduction.entity';
import { StrategyFactory } from 'src/inventory_batches/strategies/strategy.factory';    
import { BusinessService } from '../business/business.service';
import { DataSource } from 'typeorm';

describe('SalesService', () => {
  let service: SalesService;

  const mockSaleRepo = {
    findOne: jest.fn(),
  };

  const mockDeductionRepo = {
    find: jest.fn(),
  };

  const mockStrategy = {
    deductStock: jest.fn(),
  };

  const mockStrategyFactory = {
    getStrategy: jest.fn(() => mockStrategy),
  };

  const mockBusinessService = {
    findById: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(cb => cb({
      create: jest.fn(),
      save: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        { provide: getRepositoryToken(Sale), useValue: mockSaleRepo },
        { provide: getRepositoryToken(SaleDeduction), useValue: mockDeductionRepo },
        { provide: StrategyFactory, useValue: mockStrategyFactory },
        { provide: BusinessService, useValue: mockBusinessService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });


  //   -- Test Case 1 — Successful Sale (FIFO/FEFO)

it('should create a sale and deduct stock', async () => {
  mockSaleRepo.findOne.mockResolvedValue(null);
  mockBusinessService.findById.mockResolvedValue({ outMode: 'FIFO' });

  mockStrategy.deductStock.mockResolvedValue({
    deductions: [
      { batchId: 'b1', batchNo: 'BATCH-01', quantity: 10 },
      { batchId: 'b2', batchNo: 'BATCH-02', quantity: 5 },
    ],
  });

  const result = await service.createSale({
    businessId: 'biz1',
    productId: 'prod1',
    quantity: 15,
    saleReference: 'SALE-001',
  });

  expect(mockStrategy.deductStock).toHaveBeenCalled();
  expect(result.sale_id).toBeDefined();
  expect(result.deductions.length).toBe(2);
});
    

//   -- Test Case 2 — Idempotent Sale Creation

it('should return existing sale if saleReference already exists', async () => {
  mockSaleRepo.findOne.mockResolvedValue({ id: 'sale1' });
  mockDeductionRepo.find.mockResolvedValue([
    { batchNo: 'BATCH-01', quantity: 10 },
  ]);

  const result = await service.createSale({
    businessId: 'biz1',
    productId: 'prod1',
    quantity: 10,
    saleReference: 'SALE-001',
  });

  expect(result.sale_id).toBe('sale1');
  expect(result.deductions.length).toBe(1);
});

//   -- Test Case 3 — Insufficient Stock Handling

it('should fail if strategy throws insufficient stock error', async () => {
  mockSaleRepo.findOne.mockResolvedValue(null);
  mockBusinessService.findById.mockResolvedValue({ outMode: 'FIFO' });

  mockStrategy.deductStock.mockRejectedValue(
    new Error('Insufficient stock'),
  );

  await expect(
    service.createSale({
      businessId: 'biz1',
      productId: 'prod1',
      quantity: 100,
      saleReference: 'SALE-002',
    }),
  ).rejects.toThrow('Insufficient stock');
});


//--  -- Test Case 4 — Transaction Rollback on Failure

it('should fail in BATCH mode if batchNo is missing', async () => {
  mockSaleRepo.findOne.mockResolvedValue(null);
  mockBusinessService.findById.mockResolvedValue({ outMode: 'BATCH' });

  mockStrategy.deductStock.mockRejectedValue(
    new Error('batch_no is required'),
  );

  await expect(
    service.createSale({
      businessId: 'biz1',
      productId: 'prod1',
      quantity: 5,
      saleReference: 'SALE-003',
    }),
  ).rejects.toThrow();
});

});