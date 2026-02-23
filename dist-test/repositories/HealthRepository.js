"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRepository = void 0;
var Repository_1 = require("./Repository");
var HealthRepository = /** @class */ (function (_super) {
    __extends(HealthRepository, _super);
    function HealthRepository(db) {
        return _super.call(this, db, 'health_profile') || this; // Default table, but we'll override for specific calls
    }
    // --- Profile ---
    HealthRepository.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, results, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM health_profile LIMIT 1";
                        return [4 /*yield*/, this.executeQuery(sql)];
                    case 1:
                        results = _a.sent();
                        if (results.length === 0)
                            return [2 /*return*/, null];
                        row = results[0];
                        // Ensure both naming conventions are present
                        return [2 /*return*/, __assign(__assign({}, row), { peso: row.weight, altura: row.height, sexo: row.gender, data_nascimento: row.birthDate || row.data_nascimento })];
                }
            });
        });
    };
    HealthRepository.prototype.saveProfile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            var existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProfile()];
                    case 1:
                        existing = _a.sent();
                        if (!existing) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateProfile(existing.id, profile)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.createProfile(profile)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HealthRepository.prototype.createProfile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, weight, height, gender;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        sql = "\n            INSERT INTO health_profile (id, weight, height, birthDate, gender, activityLevel, waterGoal, updated_at, meta_peso, last_monthly_checkin)\n            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n        ";
                        weight = (_b = (_a = profile.weight) !== null && _a !== void 0 ? _a : profile.peso) !== null && _b !== void 0 ? _b : null;
                        height = (_d = (_c = profile.height) !== null && _c !== void 0 ? _c : profile.altura) !== null && _d !== void 0 ? _d : null;
                        gender = (_f = (_e = profile.gender) !== null && _e !== void 0 ? _e : profile.sexo) !== null && _f !== void 0 ? _f : null;
                        return [4 /*yield*/, this.executeStatement(sql, [
                                profile.id,
                                weight,
                                height,
                                profile.data_nascimento || null,
                                gender,
                                profile.activityLevel || null,
                                profile.waterGoal || null,
                                profile.updated_at,
                                profile.meta_peso || null,
                                profile.last_monthly_checkin || null
                            ])];
                    case 1:
                        _g.sent();
                        return [2 /*return*/, __assign(__assign({}, profile), { weight: weight, height: height, gender: gender })];
                }
            });
        });
    };
    HealthRepository.prototype.updateProfile = function (id, profile) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, existing, merged, weight, height, gender;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        sql = "\n            UPDATE health_profile \n            SET weight = ?, height = ?, birthDate = ?, gender = ?, activityLevel = ?, waterGoal = ?, updated_at = ?, meta_peso = ?, last_monthly_checkin = ?\n            WHERE id = ?\n        ";
                        return [4 /*yield*/, this.getProfile()];
                    case 1:
                        existing = _g.sent();
                        if (!existing)
                            throw new Error('Profile not found');
                        merged = __assign(__assign(__assign({}, existing), profile), { updated_at: new Date().toISOString() });
                        weight = (_b = (_a = merged.weight) !== null && _a !== void 0 ? _a : merged.peso) !== null && _b !== void 0 ? _b : null;
                        height = (_d = (_c = merged.height) !== null && _c !== void 0 ? _c : merged.altura) !== null && _d !== void 0 ? _d : null;
                        gender = (_f = (_e = merged.gender) !== null && _e !== void 0 ? _e : merged.sexo) !== null && _f !== void 0 ? _f : null;
                        return [4 /*yield*/, this.executeStatement(sql, [
                                weight,
                                height,
                                merged.data_nascimento || null,
                                gender,
                                merged.activityLevel || null,
                                merged.waterGoal || null,
                                merged.updated_at,
                                merged.meta_peso || null,
                                merged.last_monthly_checkin || null,
                                id
                            ])];
                    case 2:
                        _g.sent();
                        return [2 /*return*/, __assign(__assign({}, merged), { weight: weight, height: height, gender: gender })];
                }
            });
        });
    };
    // --- Metrics ---
    HealthRepository.prototype.addMetric = function (metric) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n            INSERT INTO health_metrics (id, type, value, unit, date, notes, created_at)\n            VALUES (?, ?, ?, ?, ?, ?, ?)\n        ";
                        return [4 /*yield*/, this.executeStatement(sql, [
                                metric.id,
                                metric.type,
                                metric.value,
                                metric.unit,
                                metric.date,
                                metric.notes || null,
                                metric.created_at
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, metric];
                }
            });
        });
    };
    HealthRepository.prototype.getMetrics = function (type_1) {
        return __awaiter(this, arguments, void 0, function (type, limit) {
            var sql;
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                sql = "SELECT * FROM health_metrics WHERE type = ? ORDER BY date DESC LIMIT ?";
                return [2 /*return*/, this.executeQuery(sql, [type, limit])];
            });
        });
    };
    // --- Exercise Reports ---
    HealthRepository.prototype.saveExerciseReport = function (report) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n            INSERT INTO health_exercise_reports (id, exercises, duration, calories, date, created_at)\n            VALUES (?, ?, ?, ?, ?, ?)\n        ";
                        return [4 /*yield*/, this.executeStatement(sql, [
                                report.id,
                                report.exercises,
                                report.duration,
                                report.calories,
                                report.date,
                                report.created_at
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, report];
                }
            });
        });
    };
    HealthRepository.prototype.getExerciseReports = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var sql;
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                sql = "SELECT * FROM health_exercise_reports ORDER BY date DESC LIMIT ?";
                return [2 /*return*/, this.executeQuery(sql, [limit])];
            });
        });
    };
    // --- Health Exams ---
    HealthRepository.prototype.saveExam = function (exam) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n            INSERT INTO health_exams (id, filename, analysis, date, created_at)\n            VALUES (?, ?, ?, ?, ?)\n        ";
                        return [4 /*yield*/, this.executeStatement(sql, [
                                exam.id,
                                exam.filename,
                                exam.analysis,
                                exam.date,
                                exam.created_at
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, exam];
                }
            });
        });
    };
    HealthRepository.prototype.getExams = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var sql;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                sql = "SELECT * FROM health_exams ORDER BY date DESC LIMIT ?";
                return [2 /*return*/, this.executeQuery(sql, [limit])];
            });
        });
    };
    // --- Chat History ---
    HealthRepository.prototype.saveMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n            INSERT INTO health_chat_history (id, text, sender, timestamp, type, metadata)\n            VALUES (?, ?, ?, ?, ?, ?)\n        ";
                        return [4 /*yield*/, this.executeStatement(sql, [
                                message.id,
                                message.text,
                                message.sender,
                                message.timestamp,
                                message.type,
                                message.metadata ? JSON.stringify(message.metadata) : null
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, message];
                }
            });
        });
    };
    HealthRepository.prototype.getChatHistory = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var sql, innerSql, results;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM health_chat_history ORDER BY timestamp ASC LIMIT ?";
                        innerSql = "SELECT * FROM health_chat_history ORDER BY timestamp DESC LIMIT ?";
                        return [4 /*yield*/, this.executeQuery(innerSql, [limit])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.map(function (row) { return (__assign(__assign({}, row), { metadata: row.metadata ? JSON.parse(row.metadata) : undefined })); }).reverse()];
                }
            });
        });
    };
    HealthRepository.prototype.clearChat = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.executeStatement('DELETE FROM health_chat_history')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return HealthRepository;
}(Repository_1.Repository));
exports.HealthRepository = HealthRepository;
