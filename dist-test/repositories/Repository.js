"use strict";
/**
 * Repository abstraction for database access
 * Provides a generic CRUD interface that can be swapped between SQLite and cloud backends
 */
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.Database = exports.Repository = void 0;
/**
 * Base Repository class that wraps SQLite database
 * Subclasses implement specific table operations
 */
var Repository = /** @class */ (function () {
    function Repository(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }
    /**
     * Execute a raw SQL query
     */
    Repository.prototype.executeQuery = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params) {
            var results, error_1;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.getAllAsync(sql, params)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results || []];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Query error in ".concat(this.tableName, ":"), error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute a single SQL statement
     */
    Repository.prototype.executeStatement = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params) {
            var error_2;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.runAsync(sql, params)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Execute error in ".concat(this.tableName, ":"), error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a new record
     */
    Repository.prototype.create = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, placeholders, columnNames, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(item);
                        values = Object.values(item);
                        placeholders = keys.map(function () { return '?'; }).join(', ');
                        columnNames = keys.join(', ');
                        sql = "INSERT INTO ".concat(this.tableName, " (").concat(columnNames, ") VALUES (").concat(placeholders, ")");
                        return [4 /*yield*/, this.executeStatement(sql, values)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    /**
     * Read a single record by ID
     */
    Repository.prototype.read = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM ".concat(this.tableName, " WHERE id = ?");
                        return [4 /*yield*/, this.executeQuery(sql, [id])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.length > 0 ? results[0] : null];
                }
            });
        });
    };
    /**
     * Update a record
     */
    Repository.prototype.update = function (id, item) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, setClause, sql, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(item);
                        values = Object.values(item);
                        setClause = keys.map(function (key) { return "".concat(key, " = ?"); }).join(', ');
                        sql = "UPDATE ".concat(this.tableName, " SET ").concat(setClause, " WHERE id = ?");
                        return [4 /*yield*/, this.executeStatement(sql, __spreadArray(__spreadArray([], values, true), [id], false))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.read(id)];
                    case 2:
                        updated = _a.sent();
                        if (!updated) {
                            throw new Error("Record with id ".concat(id, " not found after update"));
                        }
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    /**
     * Delete a record
     */
    Repository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "DELETE FROM ".concat(this.tableName, " WHERE id = ?");
                        return [4 /*yield*/, this.executeStatement(sql, [id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * List all records
     */
    Repository.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = "SELECT * FROM ".concat(this.tableName);
                return [2 /*return*/, this.executeQuery(sql)];
            });
        });
    };
    /**
     * Query records with a predicate function
     * Note: This is an in-memory filter. For large datasets, override to use SQL WHERE clause
     */
    Repository.prototype.query = function (predicate) {
        return __awaiter(this, void 0, void 0, function () {
            var all;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.list()];
                    case 1:
                        all = _a.sent();
                        return [2 /*return*/, all.filter(predicate)];
                }
            });
        });
    };
    /**
     * Check if table exists
     */
    Repository.prototype.tableExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT name FROM sqlite_master WHERE type='table' AND name=?";
                        return [4 /*yield*/, this.executeQuery(sql, [this.tableName])];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.length > 0];
                }
            });
        });
    };
    return Repository;
}());
exports.Repository = Repository;
/**
 * Database wrapper that manages SQLite instance and provides repository factory
 */
var Database = /** @class */ (function () {
    function Database() {
        this.db = null;
    }
    /**
     * Initialize the database connection
     */
    Database.prototype.initialize = function (dbInstance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.db = dbInstance;
                        // Enable foreign keys
                        return [4 /*yield*/, this.db.execAsync('PRAGMA foreign_keys = ON')];
                    case 1:
                        // Enable foreign keys
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the SQLite database instance
     */
    Database.prototype.getDb = function () {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    };
    /**
     * Create a repository for a specific table
     */
    Database.prototype.createRepository = function (tableName) {
        var db = this.getDb();
        return new Repository(db, tableName);
    };
    /**
     * Delete all data from all tables (Except schema_version)
     */
    Database.prototype.clearAllData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, tables;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = this.getDb();
                        tables = [
                            'execucao',
                            'meta',
                            'lancamento_financeiro',
                            'investimento',
                            'compromisso',
                            'user_profile',
                        ];
                        return [4 /*yield*/, db.withTransactionAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _i, tables_1, table;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _i = 0, tables_1 = tables;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < tables_1.length)) return [3 /*break*/, 4];
                                            table = tables_1[_i];
                                            return [4 /*yield*/, db.runAsync("DELETE FROM ".concat(table))];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Close the database connection
     */
    Database.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.db) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.closeAsync()];
                    case 1:
                        _a.sent();
                        this.db = null;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return Database;
}());
exports.Database = Database;
exports.database = new Database();
