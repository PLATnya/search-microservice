"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = void 0;
const axios_1 = __importDefault(require("axios"));
var bingProvider = {
    name: 'Bing',
    searchEndpoint: 'https://api.bing.microsoft.com/v7.0/search',
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
    },
    params: undefined,
    getInfoFromRawOutput(rawInfo) {
        return rawInfo.webPages.value.map((page) => ({
            name: page.name,
            url: page.url,
            snippet: page.snippet
        }));
    },
};
var googleProvider = {
    name: 'Google',
    searchEndpoint: 'https://customsearch.googleapis.com/customsearch/v1',
    headers: undefined,
    params: {
        key: 'AIzaSyDF3bbUW9V5BbRyebhl18pObRZXhgG7xuk',
        cx: '47ca2d6eba2044698'
    },
    getInfoFromRawOutput(rawInfo) {
        return rawInfo.items.map((page) => ({
            name: page.title,
            url: page.link,
            snippet: page.snippet
        }));
    },
};
exports.providers = [bingProvider, googleProvider];
const express = require("express");
const router = express.Router();
module.exports = router;
router.get("/", function (req, res) {
    var _a;
    if (!req.query.provider || !req.query.q)
        return;
    const provider = exports.providers.find((provider) => provider.name === req.query.provider);
    const query = req.query.q;
    if (!provider || !query)
        return;
    (_a = getProviderSearch(provider, query)) === null || _a === void 0 ? void 0 : _a.then(response => {
        res.send(provider.getInfoFromRawOutput(response === null || response === void 0 ? void 0 : response.data));
    });
});
router.get("/list", function (req, res) {
    res.send(exports.providers.map((provider) => provider.name));
});
function getProviderSearch(provider, query) {
    return provider ? axios_1.default.get(provider.searchEndpoint, {
        headers: provider.headers,
        params: Object.assign({}, provider.params, {
            'q': encodeURIComponent(query)
        })
    }) : undefined;
}
