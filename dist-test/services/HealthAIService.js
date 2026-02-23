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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthAIService = exports.HealthAIService = void 0;
var HealthService_1 = require("./HealthService");
var compromise_1 = __importDefault(require("compromise"));
/**
 * HealthAIService
 * An Offline NLP AI Engine for health assistance using 'compromise'.
 */
var HealthAIService = /** @class */ (function () {
    function HealthAIService() {
    }
    /**
     * Proactive check: If profile is missing data, ask for it.
     * Also handle monthly check-in.
     */
    HealthAIService.prototype.checkIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var profile, now, history_1, lastMsg, text, lastCheckin, oneMonthAgo, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 1:
                        profile = _a.sent();
                        now = new Date();
                        if (!(!profile || !profile.peso || !profile.altura)) return [3 /*break*/, 4];
                        return [4 /*yield*/, HealthService_1.healthService.getChatHistory()];
                    case 2:
                        history_1 = _a.sent();
                        lastMsg = history_1[history_1.length - 1];
                        if (lastMsg && lastMsg.sender === 'ai' && lastMsg.text.includes('?'))
                            return [2 /*return*/, null];
                        text = "Olá! Notei que ainda não tenho seus dados de peso e altura. Para que eu possa calcular seu IMC e metas de água, por favor me informe. Exemplo: 'tenho 70kg e 175cm'.";
                        return [4 /*yield*/, HealthService_1.healthService.saveMessage(text, 'ai', 'text')];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        lastCheckin = profile.last_monthly_checkin ? new Date(profile.last_monthly_checkin) : null;
                        oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                        if (!(!lastCheckin || lastCheckin < oneMonthAgo)) return [3 /*break*/, 6];
                        text = "Olá! Já faz um tempo desde nossa última atualização. Mudou alguma coisa no seu peso, altura ou nível de atividade física?";
                        return [4 /*yield*/, HealthService_1.healthService.saveMessage(text, 'ai', 'text', {
                                actionType: 'monthly_checkin',
                                options: [
                                    { label: 'Sim', value: 'yes' },
                                    { label: 'Não', value: 'no' }
                                ]
                            })];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    HealthAIService.prototype.processMessage = function (userText) {
        return __awaiter(this, void 0, void 0, function () {
            var userMsg, lowerText, history, lastAiMsg, lastActionType, responseText, actionType, metadata, profile, durationMatch, duration, calories, suggestion, profile, profile, age, bmr, tdee, macros, doc, duration, hasExercises, calories, suggestion, profile, profile, age, bmr, tdee, bmi, category, carb, sugar, level;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, HealthService_1.healthService.saveMessage(userText, 'user', 'text')];
                    case 1:
                        userMsg = _b.sent();
                        // 2. Artificial Delay (Thinking...) - 1s
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 2:
                        // 2. Artificial Delay (Thinking...) - 1s
                        _b.sent();
                        lowerText = userText.toLowerCase().trim();
                        return [4 /*yield*/, HealthService_1.healthService.getChatHistory()];
                    case 3:
                        history = _b.sent();
                        lastAiMsg = history.reverse().find(function (m) { return m.sender === 'ai'; });
                        lastActionType = (_a = lastAiMsg === null || lastAiMsg === void 0 ? void 0 : lastAiMsg.metadata) === null || _a === void 0 ? void 0 : _a.actionType;
                        responseText = '';
                        actionType = 'text';
                        metadata = {};
                        if (!(lastActionType === 'monthly_checkin')) return [3 /*break*/, 9];
                        if (!(lowerText === 'não' || lowerText === 'nao' || lowerText === 'no')) return [3 /*break*/, 7];
                        responseText = "Entendido! Vamos continuar com seus dados atuais. Como posso te ajudar hoje?";
                        return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 4:
                        profile = _b.sent();
                        if (!profile) return [3 /*break*/, 6];
                        return [4 /*yield*/, HealthService_1.healthService.saveProfile(__assign(__assign({}, profile), { last_monthly_checkin: new Date().toISOString() }))];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        responseText = "Tudo bem! O que mudou? Pode me falar seu novo peso, altura ou nível de atividade.";
                        _b.label = 8;
                    case 8: return [3 /*break*/, 31];
                    case 9:
                        if (!(lastActionType === 'exercise_report' && (lastAiMsg === null || lastAiMsg === void 0 ? void 0 : lastAiMsg.text.includes('quais exercícios')))) return [3 /*break*/, 12];
                        durationMatch = lowerText.match(/(\d+)\s*(min|m|hora|h)/);
                        duration = durationMatch ? parseInt(durationMatch[1]) : 30;
                        calories = HealthService_1.healthService.calculateCalories(userText, duration);
                        suggestion = HealthService_1.healthService.generateWorkoutSuggestion();
                        return [4 /*yield*/, HealthService_1.healthService.saveExerciseReport({
                                exercises: userText,
                                duration: duration,
                                calories: calories,
                                date: new Date().toISOString().split('T')[0]
                            })];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 11:
                        profile = _b.sent();
                        if (profile && (!profile.activityLevel || profile.activityLevel === 'sedentary')) {
                            // Proactively suggest updating activity level
                            metadata = { actionType: 'suggest_activity_update' };
                            responseText = "Excelente! Voc\u00EA queimou aproximadamente **".concat(calories, " calorias**. No seu pr\u00F3ximo treino, sugiro focar em: **").concat(suggestion, "**.\n\nNotei que voc\u00EA est\u00E1 se exercitando! Quer que eu atualize seu n\u00EDvel de atividade f\u00EDsica para calcular suas metas com mais precis\u00E3o?");
                        }
                        else {
                            responseText = "Excelente! Voc\u00EA queimou aproximadamente **".concat(calories, " calorias**. No seu pr\u00F3ximo treino, sugiro focar em: **").concat(suggestion, "**.");
                        }
                        return [3 /*break*/, 31];
                    case 12:
                        if (!(lastActionType === 'weekly_diet' && (lastAiMsg === null || lastAiMsg === void 0 ? void 0 : lastAiMsg.text.includes('o que você tem em casa')))) return [3 /*break*/, 14];
                        return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 13:
                        profile = _b.sent();
                        if (profile && profile.peso && profile.altura) {
                            age = 30;
                            bmr = HealthService_1.healthService.calculateBMR(profile.peso, profile.altura, age, profile.sexo || 'male');
                            tdee = HealthService_1.healthService.calculateTDEE(bmr, profile.activityLevel || 'moderate');
                            macros = { protein: profile.peso * 2, fat: profile.peso * 0.8, carb: (tdee - (profile.peso * 2 * 4) - (profile.peso * 0.8 * 9)) / 4 };
                            responseText = HealthService_1.healthService.generateWeeklyDiet({
                                macros: macros,
                                tdee: tdee - 500, // Suggesting 500 caloric deficit for weight loss
                                goal: 'loss',
                                inventory: userText
                            });
                        }
                        else {
                            responseText = "Para gerar sua dieta, preciso antes atualizar suas métricas. Me informe seu peso e altura.";
                        }
                        return [3 /*break*/, 31];
                    case 14:
                        doc = (0, compromise_1.default)(userText);
                        if (!doc.match('(oi|olá|hello|hi|bom dia|boa tarde|boa noite)').found) return [3 /*break*/, 15];
                        responseText = this.getRandomResponse('greeting');
                        return [3 /*break*/, 31];
                    case 15:
                        if (!(doc.match('(relatório|exercício|treino|fiz|malhei|corri|pedalei|treinei)').found || this.isExerciseContext(lowerText))) return [3 /*break*/, 20];
                        duration = this.extractDuration(lowerText);
                        hasExercises = doc.match('(corrida|caminhada|musculação|academia|treino|futebol|natação|pedal|bicicleta)').found || lowerText.length > 20 || this.isExerciseContext(lowerText);
                        if (!(duration && hasExercises)) return [3 /*break*/, 18];
                        calories = HealthService_1.healthService.calculateCalories(userText, duration);
                        suggestion = HealthService_1.healthService.generateWorkoutSuggestion();
                        return [4 /*yield*/, HealthService_1.healthService.saveExerciseReport({
                                exercises: userText,
                                duration: duration,
                                calories: calories,
                                date: new Date().toISOString().split('T')[0]
                            })];
                    case 16:
                        _b.sent();
                        responseText = "Registro feito! Voc\u00EA queimou cerca de **".concat(calories, " calorias**. No seu pr\u00F3ximo treino, sugiro: **").concat(suggestion, "**.");
                        return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 17:
                        profile = _b.sent();
                        if (profile && (!profile.activityLevel || profile.activityLevel === 'sedentary')) {
                            responseText += "\n\nNotei que voc\u00EA est\u00E1 se exercitando! Quer que eu considere isso para ajustar seu n\u00EDvel de atividade f\u00EDsica?";
                            metadata = { actionType: 'suggest_activity_update' };
                        }
                        return [3 /*break*/, 19];
                    case 18:
                        responseText = "Que bom que você treinou! Quais exercícios você fez e por quanto tempo aproximadamente?";
                        actionType = 'text';
                        metadata = { actionType: 'exercise_report' };
                        _b.label = 19;
                    case 19: return [3 /*break*/, 31];
                    case 20:
                        if (!(lowerText.includes('métricas de saúde') || doc.match('(métricas|status|meu corpo|calorias|macros)').found)) return [3 /*break*/, 22];
                        return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 21:
                        profile = _b.sent();
                        if (profile && profile.peso && profile.altura) {
                            age = 30;
                            bmr = HealthService_1.healthService.calculateBMR(profile.peso, profile.altura, age, profile.sexo || 'male');
                            tdee = HealthService_1.healthService.calculateTDEE(bmr, profile.activityLevel || 'moderate');
                            bmi = HealthService_1.healthService.calculateBMI(profile.peso, profile.altura);
                            category = HealthService_1.healthService.getBMICategory(bmi);
                            carb = Math.round(((tdee - 500) - (profile.peso * 2 * 4) - (Math.round(profile.peso * 0.8) * 9)) / 4);
                            sugar = Math.round(((tdee - 500) * 0.05) / 4);
                            responseText = "Suas m\u00E9tricas atuais:\n\n" +
                                "- **IMC:** ".concat(bmi, " (").concat(category, ")\n") +
                                "- **TMB (Calorias em repouso):** ".concat(bmr, " kcal\n") +
                                "- **Gasto Di\u00E1rio (TDEE):** ".concat(tdee, " kcal\n") +
                                "- **Deficit Sugerido:** ".concat(tdee - 500, " kcal\n\n") +
                                "Sugest\u00E3o de ingest\u00E3o di\u00E1ria (Meta de Perda de Peso):\n" +
                                "- **\u00C1gua:** ".concat(HealthService_1.healthService.calculateWaterGoal(profile.peso), "ml\n") +
                                "- **Prote\u00EDna:** ".concat(profile.peso * 2, "g\n") +
                                "- **Carboidratos:** ".concat(carb, "g\n") +
                                "- **Gordura:** ".concat(Math.round(profile.peso * 0.8), "g\n") +
                                "- **A\u00E7\u00FAcar M\u00E1ximo:** ".concat(sugar, "g");
                            actionType = 'text';
                            metadata = { actionType: 'health_metrics' };
                        }
                        else {
                            responseText = "Para calcular suas métricas, preciso saber seu peso e altura. Pode me informar?";
                        }
                        return [3 /*break*/, 31];
                    case 22:
                        if (!(lowerText.includes('dieta semanal') || doc.match('(dieta|comer|cardápio|alimentação)').found)) return [3 /*break*/, 23];
                        responseText = "Com certeza! Para eu montar sua dieta, o que você tem em casa hoje e o que pode comprar para a semana?";
                        actionType = 'text';
                        metadata = { actionType: 'weekly_diet' };
                        return [3 /*break*/, 31];
                    case 23:
                        if (!(lowerText.includes('analisar exame') || doc.match('(exame|laboratório|resultado|sangue)').found)) return [3 /*break*/, 24];
                        responseText = "Por favor, anexe seu exame em PDF clicando no botão de anexo. Vou analisar os dados para você.\n\n*Lembre-se: Minha análise não substitui a de um médico.*";
                        actionType = 'text';
                        metadata = { actionType: 'analyze_exam' };
                        return [3 /*break*/, 31];
                    case 24:
                        if (!this.containsProfileData(lowerText)) return [3 /*break*/, 26];
                        return [4 /*yield*/, this.handleProfileUpdate(lowerText)];
                    case 25:
                        responseText = _b.sent();
                        return [3 /*break*/, 31];
                    case 26:
                        if (!(doc.match('(nível|nivel|atividade|frequencia|frequência|exercito|treino)').found && doc.match('(física|dia|semana|sedentario|ativo)').found)) return [3 /*break*/, 30];
                        level = this.detectActivityLevel(lowerText);
                        if (!level) return [3 /*break*/, 28];
                        return [4 /*yield*/, this.handleProfileUpdate(lowerText)];
                    case 27:
                        responseText = _b.sent();
                        return [3 /*break*/, 29];
                    case 28:
                        responseText = "Para eu entender melhor seu nível de atividade, me diga: com que frequência você se exercita por semana? (Ex: 3 vezes por semana, todo dia, ou se é sedentário).";
                        _b.label = 29;
                    case 29: return [3 /*break*/, 31];
                    case 30:
                        if (!this.isHealthRelated(userText)) {
                            responseText = "Sou uma IA focada em saúde, bem-estar, exercícios e dieta. Sinto muito, mas ainda não fui treinada para falar sobre esse assunto. Como posso te apoiar na sua jornada de saúde hoje?";
                        }
                        // FALLBACK
                        else {
                            responseText = this.getRandomResponse('fallback');
                        }
                        _b.label = 31;
                    case 31: return [4 /*yield*/, HealthService_1.healthService.saveMessage(responseText, 'ai', actionType, metadata)];
                    case 32: 
                    // 4. Save and return AI response
                    return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    HealthAIService.prototype.isHealthRelated = function (text) {
        var keywords = ['peso', 'altura', 'imc', 'dieta', 'treino', 'exercício', 'água', 'comer', 'saúde', 'dor', 'exame', 'médico', 'caloria', 'fome', 'sono', 'descanso', 'bem estar', 'hidratação', 'atleta', 'musculação', 'corrida', 'caminhada', 'vida', 'corpo', 'mente', 'ansiedade', 'stress', 'estresse'];
        var lower = text.toLowerCase();
        return keywords.some(function (k) { return lower.includes(k); }) || (0, compromise_1.default)(text).match('(saúde|corpo|vida|bem|mal|doente|médico|remédio|treino|comer|fome)').found;
    };
    HealthAIService.prototype.containsProfileData = function (text) {
        var weight = this.extractWeight(text);
        var height = this.extractHeight(text);
        var activity = this.detectActivityLevel(text);
        return weight !== null || height !== null || activity !== null;
    };
    HealthAIService.prototype.detectActivityLevel = function (text) {
        var lower = text.toLowerCase();
        // Very Active
        if (lower.match(/(todo dia|todos os dias|6 vezes|7 vezes|pesado|atleta|extremamente|diariamente|treino muito)/))
            return 'very_active';
        // Active
        if (lower.match(/(4 vezes|5 vezes|frequente|ativo|intensamente|quase todo)/))
            return 'active';
        // Moderate
        if (lower.match(/(3 vezes|moderado|regularmente|academia|musculação)/))
            return 'moderate';
        // Light
        if (lower.match(/(1 vez|2 vezes|caminhada|leve|pouco|às vezes|de vez em quando)/))
            return 'light';
        // Sedentary
        if (lower.match(/(sedentário|sedentario|não faço|nunca|escritório|sentado|parado|nenhum)/))
            return 'sedentary';
        return null;
    };
    HealthAIService.prototype.extractWeight = function (text) {
        // Cases: "70kg", "70 kilos", "peso 70", "meu peso é 70.5"
        var lower = text.toLowerCase();
        // 1. Explicit units
        var withUnit = lower.match(/(?:peso\s+)?(\d+([.,]\d+)?)\s*(kg|kilos|quilos)/);
        if (withUnit)
            return parseFloat(withUnit[1].replace(',', '.'));
        // 2. Contextual (number follows word 'peso' or 'pesando')
        if (lower.includes('peso') || lower.includes('pesando')) {
            var contextMatch = lower.match(/(?:peso|pesando)(?:.*?)\s+(\d+([.,]\d+)?)/);
            if (contextMatch) {
                var value = parseFloat(contextMatch[1].replace(',', '.'));
                // Basic sanity check to avoid matching years/heights by accident
                if (value > 30 && value < 200)
                    return value;
            }
            // Just raw numbers if "peso" is in phrase
            var numbers = lower.match(/\b(\d{2,3}(?:[.,]\d)?)\b/g);
            if (numbers) {
                for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                    var num = numbers_1[_i];
                    var val = parseFloat(num.replace(',', '.'));
                    if (val > 30 && val < 200)
                        return val;
                }
            }
        }
        return null;
    };
    HealthAIService.prototype.extractHeight = function (text) {
        var lower = text.toLowerCase();
        // 1. Explicit units (cm or m)
        var unitMatch = lower.match(/(\d+([.,]\d+)?)\s*(cm|centimetros|metros|m)/);
        if (unitMatch) {
            var val = parseFloat(unitMatch[1].replace(',', '.'));
            return val < 3 ? Math.round(val * 100) : Math.round(val);
        }
        // 2. Spoken format "1 metro e 75" or "1 e 75"
        var spoken = lower.match(/1\s*(?:metro)?\s*e\s*(\d{2})/);
        if (spoken) {
            return 100 + parseInt(spoken[1]);
        }
        // 3. Contextual word 'altura'
        if (lower.includes('altura')) {
            var numbers = lower.match(/\b(\d{3})\b/); // e.g. "175"
            if (numbers) {
                var val = parseInt(numbers[1]);
                if (val > 100 && val < 250)
                    return val;
            }
            var decimal = lower.match(/\b(1[.,]\d{2})\b/); // e.g. "1.75"
            if (decimal) {
                return Math.round(parseFloat(decimal[1].replace(',', '.')) * 100);
            }
        }
        return null;
    };
    HealthAIService.prototype.extractDuration = function (text) {
        var lower = text.toLowerCase();
        var match = lower.match(/(\d+)\s*(min|m|hora|h)/);
        if (match) {
            var val = parseInt(match[1]);
            return (lower.includes('hora') || lower.includes(' h')) ? val * 60 : val;
        }
        return null;
    };
    HealthAIService.prototype.isExerciseContext = function (text) {
        var keywords = ['treino', 'academia', 'musculação', 'corrida', 'esteira', 'bicicleta', 'crossfit', 'natação'];
        return keywords.some(function (k) { return text.toLowerCase().includes(k); });
    };
    HealthAIService.prototype.handleProfileUpdate = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, updates, weightValue, heightValue, extractedActivity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HealthService_1.healthService.getProfile()];
                    case 1:
                        profile = _a.sent();
                        if (!profile) {
                            profile = {
                                id: 'current_user',
                                updated_at: new Date().toISOString()
                            };
                        }
                        updates = [];
                        weightValue = this.extractWeight(text);
                        heightValue = this.extractHeight(text);
                        extractedActivity = this.detectActivityLevel(text);
                        if (!(weightValue !== null)) return [3 /*break*/, 3];
                        profile.peso = weightValue;
                        profile.weight = weightValue;
                        updates.push("peso (".concat(weightValue, "kg)"));
                        return [4 /*yield*/, HealthService_1.healthService.addMetric({ id: Date.now().toString(), type: 'weight', value: weightValue, unit: 'kg', date: new Date().toISOString().split('T')[0] })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (heightValue !== null) {
                            profile.altura = heightValue;
                            profile.height = heightValue;
                            updates.push("altura (".concat(heightValue, "cm)"));
                        }
                        if (extractedActivity) {
                            profile.activityLevel = extractedActivity;
                            updates.push("n\u00EDvel de atividade (".concat(HealthService_1.healthService.getActivityLevelLabel(extractedActivity), ")"));
                        }
                        if (!(updates.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, HealthService_1.healthService.saveProfile(profile)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, "Entendido! Atualizei seu ".concat(updates.join(', '), ". Isso me ajuda a ser mais preciso nas suas metas.")];
                    case 5: return [2 /*return*/, "Consegui identificar que você enviou dados, mas não entendi exatamente o que atualizar. Tente: 'Meu peso é 70kg' ou 'Treino 3 vezes por semana'."];
                }
            });
        });
    };
    HealthAIService.prototype.getRandomResponse = function (type) {
        var responses = {
            greeting: [
                'Olá! Como posso ajudar na sua saúde hoje?',
                'Oi! Pronto para cuidar do seu bem-estar?',
                'Olá! Vamos atingir suas metas de saúde juntos?'
            ],
            fallback: [
                'Não tenho certeza se entendi. Posso ajudar com seu peso, IMC, dieta ou treinos.',
                'Ainda estou aprendendo sobre isso. Tente me perguntar sobre exercícios ou métricas de saúde.',
                'Interessante! Lembre-se que sou especialista em saúde e bem-estar. Em que posso focar agora?'
            ]
        };
        var list = responses[type];
        return list[Math.floor(Math.random() * list.length)];
    };
    return HealthAIService;
}());
exports.HealthAIService = HealthAIService;
exports.healthAIService = new HealthAIService();
