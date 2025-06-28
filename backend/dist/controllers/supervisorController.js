"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supervisorDashboard = void 0;
const supervisorService_1 = require("../services/supervisorService");
const supervisorDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supervisorId = req.user.userId;
        const result = yield (0, supervisorService_1.getSupervisorDashboard)(supervisorId);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.supervisorDashboard = supervisorDashboard;
