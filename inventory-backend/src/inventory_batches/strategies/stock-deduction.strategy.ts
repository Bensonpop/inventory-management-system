export interface StockDeductionStrategy {
  deductStock(params: {
    businessId: string;
    productId: string;
    quantity: number;
    batchNo?: string;
  }): Promise<{
    deductions: {
      batchId: string;
      batchNo: string;
      quantity: number;
    }[];
  }>;
}


export interface StockDeduction {
  batchId: string;
  batchNo: string;
  quantity: number;
}
