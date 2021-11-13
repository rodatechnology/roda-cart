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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.StoreProvider = exports.StoreContext = void 0;
var react_1 = __importDefault(require("react"));
var shopify_buy_1 = __importDefault(require("shopify-buy"));
var client = null;
var defaultValues = {
    cart: [],
    isOpen: false,
    loading: false,
    onOpen: function () { },
    onClose: function () { },
    addVariantToCart: function (variantId, quantity) { },
    removeLineItem: function (checkoutId, itemId) { },
    updateLineItem: function (checkoutID, itemId, value) { },
    client: client,
    showCart: false,
    setShowCart: function () { },
    checkout: {
        lineItems: [],
        webUrl: null,
        id: null,
        totalPriceV2: {
            currencyCode: null,
            amount: null,
        },
    },
    didJustAddToCart: false,
};
exports.StoreContext = react_1.default.createContext(defaultValues);
var isBrowser = typeof window !== "undefined";
var localStorageKey = "shopify_checkout_id";
var StoreProvider = function (_a) {
    var children = _a.children, domain = _a.domain, storefrontAccessToken = _a.storefrontAccessToken;
    var _b = react_1.default.useState(defaultValues.checkout), checkout = _b[0], setCheckout = _b[1];
    var _c = react_1.default.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.default.useState(false), didJustAddToCart = _d[0], setDidJustAddToCart = _d[1];
    var _e = react_1.default.useState(false), showCart = _e[0], setShowCart = _e[1];
    var client = shopify_buy_1.default.buildClient({
        domain: domain,
        storefrontAccessToken: storefrontAccessToken,
    });
    react_1.default.useEffect(function () {
        if (checkout.lineItems.length == 0) {
            setShowCart(false);
        }
        else {
            setShowCart(true);
        }
    }, [checkout]);
    var setCheckoutItem = function (checkout) {
        if (isBrowser) {
            localStorage.setItem(localStorageKey, checkout.id);
        }
        setCheckout(checkout);
    };
    react_1.default.useEffect(function () {
        var initializeCheckout = function () { return __awaiter(void 0, void 0, void 0, function () {
            var existingCheckoutID, existingCheckout, e_1, newCheckout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existingCheckoutID = isBrowser
                            ? localStorage.getItem(localStorageKey)
                            : null;
                        if (!(existingCheckoutID && existingCheckoutID !== "null")) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.checkout.fetch(existingCheckoutID)];
                    case 2:
                        existingCheckout = _a.sent();
                        if (!existingCheckout.completedAt) {
                            setCheckoutItem(existingCheckout);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        localStorage.setItem(localStorageKey, "");
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, client.checkout.create()];
                    case 5:
                        newCheckout = _a.sent();
                        setCheckoutItem(newCheckout);
                        return [2 /*return*/];
                }
            });
        }); };
        initializeCheckout();
    }, []);
    var addVariantToCart = function (variantId, quantity) {
        setLoading(true);
        var checkoutID = checkout.id;
        var lineItemsToUpdate = [
            {
                variantId: variantId,
                quantity: parseInt(quantity, 10),
            },
        ];
        return client.checkout
            .addLineItems(checkoutID, lineItemsToUpdate)
            .then(function (res) {
            setCheckout(res);
            setLoading(false);
            setDidJustAddToCart(true);
            setTimeout(function () { return setDidJustAddToCart(false); }, 3000);
        });
    };
    var removeLineItem = function (checkoutID, lineItemID) {
        setLoading(true);
        return client.checkout
            .removeLineItems(checkoutID, [lineItemID])
            .then(function (res) {
            setCheckout(res);
            setLoading(false);
        });
    };
    var updateLineItem = function (checkoutID, lineItemID, quantity) {
        setLoading(true);
        var lineItemsToUpdate = [
            { id: lineItemID, quantity: parseInt(quantity, 10) },
        ];
        return client.checkout
            .updateLineItems(checkoutID, lineItemsToUpdate)
            .then(function (res) {
            setCheckout(res);
            setLoading(false);
        });
    };
    return (react_1.default.createElement(exports.StoreContext.Provider, { value: __assign(__assign({}, defaultValues), { addVariantToCart: addVariantToCart, showCart: showCart, setShowCart: setShowCart, removeLineItem: removeLineItem, updateLineItem: updateLineItem, checkout: checkout, loading: loading, didJustAddToCart: didJustAddToCart }) }, children));
};
exports.StoreProvider = StoreProvider;
