"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
    if (!token || !process.env.JWT_SECRET) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof payload !== "object" || typeof payload.userId !== "number" || typeof payload.role !== "string") {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = { userId: payload.userId, role: payload.role };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
//# sourceMappingURL=auth.js.map