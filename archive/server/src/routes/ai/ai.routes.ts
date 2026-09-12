import { Router, Request, Response } from "express";

const router = Router();

// AI placeholder routes - to be integrated with n8n later

router.post("/low-stock-analysis", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "not_implemented",
    message: "AI functionality will be integrated through n8n.",
  });
});

router.post("/demand-prediction", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "not_implemented",
    message: "AI functionality will be integrated through n8n.",
  });
});

router.post("/supplier-recommendation", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "not_implemented",
    message: "AI functionality will be integrated through n8n.",
  });
});

router.post("/inventory-report", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "not_implemented",
    message: "AI functionality will be integrated through n8n.",
  });
});

export default router;