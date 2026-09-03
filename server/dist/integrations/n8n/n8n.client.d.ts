export declare const n8n: {
    triggerLowStockWorkflow: (productId: string, productName: string, currentQuantity: number) => Promise<void>;
    triggerDemandPredictionWorkflow: (productId: string, productName: string, historicalData: any) => Promise<void>;
    triggerSupplierRecommendationWorkflow: (productId: string, currentSupplierId: string) => Promise<void>;
    triggerInventoryReportWorkflow: () => Promise<void>;
};
