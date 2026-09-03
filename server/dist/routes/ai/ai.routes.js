"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// AI placeholder routes - to be integrated with n8n later
router.post("/low-stock-analysis", (req, res) => {
    return res.status(200).json({
        status: "not_implemented",
        message: "AI functionality will be integrated through n8n.",
    });
});
router.post("/demand-prediction", (req, res) => {
    return res.status(200).json({
        status: "not_implemented",
        message: "AI functionality will be integrated through n8n.",
    });
});
router.post("/supplier-recommendation", (req, res) => {
    return res.status(200).json({
        status: "not_implemented",
        message: "AI functionality will be integrated through n8n.",
    });
});
router.post("/inventory-report", (req, res) => {
    return res.status(200).json({
        status: "not_implemented",
        message: "AI functionality will be integrated through n8n.",
    });
});
exports.default = router;
//# sourceMappingURL=ai.routes.js.map