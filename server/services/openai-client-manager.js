/**
 * OpenAI Client Manager
 *
 * A centralized singleton manager for OpenAI API connections.
 * This ensures that we have only one OpenAI client instance across the application,
 * preventing multiple unnecessary connections and potential rate limit issues.
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
import OpenAI from "openai";
import { log } from '../vite';
/**
 * Singleton OpenAI client manager
 */
var OpenAIClientManager = /** @class */ (function () {
    function OpenAIClientManager() {
        this._client = null;
        this._isConnected = false;
        // Private constructor for singleton pattern
    }
    /**
     * Get singleton instance
     */
    OpenAIClientManager.getInstance = function () {
        if (!OpenAIClientManager.instance) {
            OpenAIClientManager.instance = new OpenAIClientManager();
        }
        return OpenAIClientManager.instance;
    };
    Object.defineProperty(OpenAIClientManager.prototype, "client", {
        /**
         * Get the OpenAI client instance, initializing it if needed
         */
        get: function () {
            if (!this._client) {
                this.initializeClient();
            }
            if (!this._client) {
                throw new Error('OpenAI client could not be initialized. Check your API key.');
            }
            return this._client;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OpenAIClientManager.prototype, "isConnected", {
        /**
         * Check if the client is connected and ready
         */
        get: function () {
            return this._isConnected;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize the OpenAI client
     */
    OpenAIClientManager.prototype.initializeClient = function () {
        try {
            if (!process.env.OPENAI_API_KEY) {
                log('OpenAI API key is not set in environment variables', 'error');
                this._isConnected = false;
                return;
            }
            this._client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            log('OpenAI client initialized', 'system');
        }
        catch (error) {
            this._isConnected = false;
            log("Error initializing OpenAI client: ".concat(error instanceof Error ? error.message : 'Unknown error'), 'error');
            console.error('OpenAI client initialization error:', error);
        }
    };
    /**
     * Validate API connection by making a minimal API call
     * @returns Promise resolving to true if connection is valid
     * @throws Error if connection fails
     */
    OpenAIClientManager.prototype.validateConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._client) {
                            this.initializeClient();
                        }
                        if (!this._client) {
                            throw new Error('OpenAI client could not be initialized. Check your API key.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._client.chat.completions.create({
                                model: "gpt-4o",
                                messages: [
                                    {
                                        role: "system",
                                        content: "System initialization test. Respond with 'connection_valid' only."
                                    },
                                    {
                                        role: "user",
                                        content: "Validate API connection"
                                    }
                                ],
                                max_tokens: 10,
                                temperature: 0
                            })];
                    case 2:
                        response = _a.sent();
                        // Verify we got a response
                        if (response && response.choices && response.choices.length > 0) {
                            log("OpenAI API connection validated successfully", 'system');
                            this._isConnected = true;
                            return [2 /*return*/, true];
                        }
                        else {
                            this._isConnected = false;
                            throw new Error('OpenAI API returned an invalid response structure');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this._isConnected = false;
                        log("OpenAI API connection validation failed: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'), 'error');
                        console.error("OpenAI API connection validation failed:", error_1);
                        // Enhance error message with specific details based on error type
                        if (error_1 instanceof Error) {
                            if (error_1.message.includes('401')) {
                                throw new Error('OpenAI API key is invalid or expired');
                            }
                            else if (error_1.message.includes('429')) {
                                throw new Error('OpenAI API rate limit exceeded');
                            }
                            else if (error_1.message.includes('5')) { // Any 5xx error
                                throw new Error('OpenAI API server error - try again later');
                            }
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return OpenAIClientManager;
}());
// Export singleton instance
export var openAIClientManager = OpenAIClientManager.getInstance();
