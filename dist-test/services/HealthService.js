"use strict";
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
exports.healthService = exports.HealthService = void 0;
var HealthRepository_1 = require("../repositories/HealthRepository");
var UserRepository_1 = require("../repositories/UserRepository");
var Repository_1 = require("../repositories/Repository");
var HealthService = /** @class */ (function () {
    function HealthService() {
        this._repo = null;
        this._userRepo = null;
    }
    Object.defineProperty(HealthService.prototype, "repo", {
        get: function () {
            if (!this._repo) {
                this._repo = new HealthRepository_1.HealthRepository(Repository_1.database.getDb());
            }
            return this._repo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HealthService.prototype, "userRepo", {
        get: function () {
            if (!this._userRepo) {
                this._userRepo = new UserRepository_1.UserRepository(Repository_1.database.getDb());
            }
            return this._userRepo;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the health profile
     */
    HealthService.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var healthProfile, userProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repo.getProfile()];
                    case 1:
                        healthProfile = _a.sent();
                        if (healthProfile)
                            return [2 /*return*/, healthProfile];
                        return [4 /*yield*/, this.userRepo.getProfile()];
                    case 2:
                        userProfile = _a.sent();
                        if (userProfile) {
                            return [2 /*return*/, {
                                    id: 'current_user',
                                    nome: userProfile.nome,
                                    peso: userProfile.peso || undefined,
                                    altura: userProfile.altura || undefined,
                                    meta_peso: userProfile.meta_peso || undefined,
                                    sexo: userProfile.sexo || undefined,
                                    updated_at: userProfile.updated_at
                                }];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Save/Update user profile
     */
    HealthService.prototype.saveProfile = function (profile) {
        return __awaiter(this, void 0, void 0, function () {
            var weight, height, saved, userProfile, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weight = profile.peso || profile.weight;
                        height = profile.altura || profile.height;
                        return [4 /*yield*/, this.repo.saveProfile(__assign(__assign({}, profile), { peso: weight, weight: weight, altura: height, height: height }))];
                    case 1:
                        saved = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.userRepo.getProfile()];
                    case 3:
                        userProfile = _a.sent();
                        if (!userProfile) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userRepo.saveProfile(__assign(__assign({}, userProfile), { peso: weight || userProfile.peso, altura: height || userProfile.altura, meta_peso: profile.meta_peso || userProfile.meta_peso, sexo: (profile.sexo || profile.gender || userProfile.sexo), updated_at: new Date().toISOString() }))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.error("Error syncing profile", e_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, saved];
                }
            });
        });
    };
    HealthService.prototype.addMetric = function (metric) {
        return __awaiter(this, void 0, void 0, function () {
            var newMetric;
            return __generator(this, function (_a) {
                newMetric = __assign(__assign({}, metric), { created_at: new Date().toISOString() });
                return [2 /*return*/, this.repo.addMetric(newMetric)];
            });
        });
    };
    HealthService.prototype.getMetrics = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repo.getMetrics(type)];
            });
        });
    };
    // --- Exercise Reports ---
    HealthService.prototype.saveExerciseReport = function (report) {
        return __awaiter(this, void 0, void 0, function () {
            var fullReport;
            return __generator(this, function (_a) {
                fullReport = __assign(__assign({ id: Date.now().toString() }, report), { created_at: new Date().toISOString() });
                return [2 /*return*/, this.repo.saveExerciseReport(fullReport)];
            });
        });
    };
    HealthService.prototype.calculateCalories = function (exercise, durationMin) {
        // Basic MET based calculation
        var met = 5;
        var lowerEx = exercise.toLowerCase();
        var metMap = {
            'caminha': 3.5,
            'corrida': 8,
            'correr': 8,
            'pedal': 6,
            'bicicleta': 6,
            'musculação': 5,
            'academia': 5,
            'natação': 7,
            'futebol': 9,
            'crossfit': 10,
            'yoga': 2.5,
            'pilates': 3
        };
        for (var _i = 0, _a = Object.entries(metMap); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (lowerEx.includes(key)) {
                met = value;
                break;
            }
        }
        // Formula: (MET * weight * 3.5) / 200 * duration
        // We'll use a default weight of 75 if not found
        var weight = 75;
        return Math.round((met * weight * 3.5) / 200 * durationMin);
    };
    HealthService.prototype.generateWorkoutSuggestion = function (lastReport) {
        var options = [
            "Treino de musculação focado em membros superiores e 20 min de cardio.",
            "Treino de musculação focado em membros inferiores e abdômen.",
            "Treino HIIT de 30 minutos para queima de gordura.",
            "Caminhada leve de 45 minutos ou natação recreativa.",
            "Treino Full Body focado em força e resistência."
        ];
        return options[Math.floor(Math.random() * options.length)];
    };
    // --- Health Metrics & Calculations ---
    HealthService.prototype.calculateBMI = function (weight, heightCm) {
        var heightM = heightCm / 100;
        if (heightM === 0)
            return 0;
        return parseFloat((weight / (heightM * heightM)).toFixed(1));
    };
    HealthService.prototype.getBMICategory = function (bmi) {
        if (bmi < 18.5)
            return 'Abaixo do peso';
        if (bmi < 24.9)
            return 'Peso normal';
        if (bmi < 29.9)
            return 'Sobrepeso';
        return 'Obesidade';
    };
    HealthService.prototype.calculateBMR = function (weight, heightCm, age, gender) {
        if (gender === 'female') {
            return Math.round(447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age));
        }
        else {
            return Math.round(88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age));
        }
    };
    HealthService.prototype.calculateTDEE = function (bmr, activityLevel) {
        var multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        return Math.round(bmr * (multipliers[activityLevel] || 1.2));
    };
    HealthService.prototype.getActivityLevelLabel = function (level) {
        var labels = {
            'sedentary': 'Sedentário',
            'light': 'Levemente Ativo',
            'moderate': 'Moderado',
            'active': 'Muito Ativo',
            'very_active': 'Extremamente Ativo'
        };
        return labels[level] || 'Desconhecido';
    };
    HealthService.prototype.calculateWaterGoal = function (weight) {
        return Math.round(weight * 35);
    };
    // --- Exams ---
    HealthService.prototype.saveExam = function (filename, analysis) {
        return __awaiter(this, void 0, void 0, function () {
            var exam;
            return __generator(this, function (_a) {
                exam = {
                    id: Date.now().toString(),
                    filename: filename,
                    analysis: analysis,
                    date: new Date().toISOString().split('T')[0],
                    created_at: new Date().toISOString()
                };
                return [2 /*return*/, this.repo.saveExam(exam)];
            });
        });
    };
    // --- Diet Planning ---
    HealthService.prototype.generateWeeklyDiet = function (params) {
        var days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        var diet = "Aqui está sua sugestão de dieta semanal:\n\n";
        days.forEach(function (day, index) {
            if (index === 6) { // Domingo - Refeição Livre
                diet += "\uD83D\uDCC5 **".concat(day, "**: Dia de Refei\u00E7\u00E3o Livre! Aproveite com modera\u00E7\u00E3o.\n");
            }
            else {
                diet += "\uD83D\uDCC5 **".concat(day, "**:\n");
                diet += "- Caf\u00E9: Ovos mexidos e fruta\n";
                diet += "- Almo\u00E7o: Prote\u00EDna grelhada, arroz integral e salada\n";
                diet += "- Lanche: Iogurte com aveia\n";
                diet += "- Jantar: Omelete ou Sopa de legumes com frango\n\n";
            }
        });
        diet += "\n*Meta di\u00E1ria:* ".concat(params.tdee, " kcal | P: ").concat(params.macros.protein, "g | C: ").concat(params.macros.carb, "g | G: ").concat(params.macros.fat, "g");
        return diet;
    };
    // --- Chat ---
    HealthService.prototype.saveMessage = function (text_1, sender_1) {
        return __awaiter(this, arguments, void 0, function (text, sender, type, metadata) {
            var message;
            if (type === void 0) { type = 'text'; }
            return __generator(this, function (_a) {
                message = {
                    id: Date.now().toString(),
                    text: text,
                    sender: sender,
                    timestamp: new Date().toISOString(),
                    type: type,
                    metadata: metadata
                };
                return [2 /*return*/, this.repo.saveMessage(message)];
            });
        });
    };
    HealthService.prototype.getChatHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repo.getChatHistory()];
            });
        });
    };
    HealthService.prototype.clearChat = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.repo.clearChat()];
            });
        });
    };
    HealthService.prototype.sanitizeHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var history, hasStaleData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getChatHistory()];
                    case 1:
                        history = _a.sent();
                        hasStaleData = history.some(function (msg) {
                            return msg.text.includes('Recebi: "Dica de dieta"') ||
                                msg.text.includes('1.78m') ||
                                (msg.sender === 'ai' && msg.text.includes('fake'));
                        });
                        if (!hasStaleData) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.clearChat()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.saveMessage('Atualizei meu sistema para uma nova versão de Inteligência Artificial. Agora sou mais inteligente e proativo! Como posso te ajudar hoje?', 'ai')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    return HealthService;
}());
exports.HealthService = HealthService;
exports.healthService = new HealthService();
