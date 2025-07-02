"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.submitSurvey = void 0;
const surveyDto_1 = require("../dtos/surveyDto");
const surveyService = __importStar(require("../services/surveyService"));
const zod_1 = require("zod");
const submitSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Log the incoming request body for debugging
        console.log('Received survey submission body:', JSON.stringify(req.body, null, 2));
        const surveyData = surveyDto_1.CreateSurveyDtoSchema.parse(req.body);
        const uploadedById = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!uploadedById) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Optionally, enforce at least one floor-wise assessment if required
        // if (!surveyData.residentialPropertyAssessments?.length && !surveyData.nonResidentialPropertyAssessments?.length) {
        //   return res.status(400).json({ message: 'At least one floor-wise assessment is required.' });
        // }
        const newSurvey = yield surveyService.createSurvey(surveyData, uploadedById);
        res.status(201).json(newSurvey);
    }
    catch (error) {
        // Enhanced logging for all error types
        console.log('CATCH BLOCK REACHED');
        console.log('Error type:', (_b = error === null || error === void 0 ? void 0 : error.constructor) === null || _b === void 0 ? void 0 : _b.name);
        console.log('Error object:', error);
        if (error instanceof zod_1.z.ZodError) {
            // Log the full Zod error details
            console.log('Zod validation error:', JSON.stringify(error.errors, null, 2));
            return res.status(400).json({ message: 'Invalid request body', errors: error.errors });
        }
        if (error instanceof Error) {
            let errors;
            try {
                errors = JSON.parse(error.message);
            }
            catch (_c) {
                errors = error.message;
            }
            // Log generic error
            console.log('Error submitting survey:', errors);
            return res.status(400).json({ message: 'Invalid request body', errors });
        }
        // Fallback for unknown error types
        console.log('Unknown error:', error);
        res.status(500).json({ message: 'Error submitting survey', error });
    }
});
exports.submitSurvey = submitSurvey;
