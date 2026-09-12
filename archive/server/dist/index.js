"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const order_routes_js_1 = __importDefault(require("./routes/order.routes.js"));
const stock_routes_js_1 = __importDefault(require("./routes/stock.routes.js"));
const ai_routes_js_1 = __importDefault(require("./routes/ai/ai.routes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/products", product_routes_js_1.default);
app.use("/api/orders", order_routes_js_1.default);
app.use("/api/stock", stock_routes_js_1.default);
app.use("/api/ai", ai_routes_js_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map