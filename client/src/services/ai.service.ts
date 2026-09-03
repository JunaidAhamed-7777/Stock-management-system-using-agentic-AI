import authApi from "./api";

export interface AIAnalysisStatus {
  status: "not_implemented" | "success";
  message: string;
}

export interface DemandPredictionResult {
  status: "not_implemented" | "success";
  message: string;
  data?: any;
}

export const lowStockAnalysis = async (): Promise<AIAnalysisStatus> => {
  const response = await authApi().post("/ai/low-stock-analysis");
  return response.data as AIAnalysisStatus;
};

export const demandPrediction = async (): Promise<DemandPredictionResult> => {
  const response = await authApi().post("/ai/demand-prediction");
  return response.data as DemandPredictionResult;
};

export const supplierRecommendation = async (): Promise<AIAnalysisStatus> => {
  const response = await authApi().post("/ai/supplier-recommendation");
  return response.data as AIAnalysisStatus;
};

export const inventoryReport = async (): Promise<AIAnalysisStatus> => {
  const response = await authApi().post("/ai/inventory-report");
  return response.data as AIAnalysisStatus;
};