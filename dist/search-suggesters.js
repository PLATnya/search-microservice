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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestions = exports.suggesters = exports.bingSuggester = exports.duckDuckGoSuggester = exports.localAISuggester = exports.localAIParaphraser = void 0;
const axios_1 = __importDefault(require("axios"));
const express = require("express");
const router = express.Router();
module.exports = router;
router.get("/", function (req, res) {
    if (!req.query.suggester || !req.query.q)
        return;
    const suggester = exports.suggesters.find((suggesters) => suggesters.name === req.query.suggester);
    const query = req.query.q;
    if (!suggester || !query)
        return;
    getSuggestions(suggester, query.trim()).then(data => {
        if (!data)
            return;
        res.send(data);
    });
});
router.get("/list", function (req, res) {
    res.send(exports.suggesters.map((suggester) => suggester.name));
});
exports.localAIParaphraser = {
    name: "AIParaphraser",
    endpoint: 'http://localhost:5000/paraphrase',
    params: undefined,
    headers: undefined,
    //TODO: inputParamName: 'input', change to 'q'
    postSuggestProcess(data) {
        return [];
        var out_data = data === null || data === void 0 ? void 0 : data.data['output'];
        out_data.forEach((element, index, array) => array[index] = element[0]);
        return out_data;
    }
};
exports.localAISuggester = {
    name: "AISuggester",
    endpoint: 'http://localhost:5000/generate',
    params: undefined,
    headers: undefined,
    //inputParamName: 'input',
    postSuggestProcess(data) {
        return [];
        var out_data = data === null || data === void 0 ? void 0 : data.data['output'];
        out_data.forEach((element, index, array) => array[index] = element['generated_text']);
        return out_data;
    }
};
exports.duckDuckGoSuggester = {
    name: 'DuckDuckGo',
    endpoint: 'https://ac.duckduckgo.com/ac/',
    params: undefined,
    headers: undefined,
    postSuggestProcess(data) {
        return [];
        data.array.forEach((element, index, array) => {
            array[index] = element['phrase'];
        });
    }
};
exports.bingSuggester = {
    name: 'Bing',
    endpoint: 'https://api.bing.microsoft.com/v7.0/Suggestions',
    params: {
        'mkt': 'en-US'
    },
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
    },
    postSuggestProcess(data) {
        console.log(data);
        return data.data.suggestionGroups[0].searchSuggestions.map((page) => ({
            text: page.displayText,
            url: page.url
        }));
    }
};
exports.suggesters = [
    exports.bingSuggester
];
function getSuggestions(suggester, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!suggester)
            return undefined;
        const params = Object.assign({}, {
            'q': encodeURIComponent(query)
        }, suggester.params);
        var answer = yield axios_1.default.get(suggester.endpoint, {
            params: params,
            headers: suggester.headers
        });
        return suggester.postSuggestProcess(answer);
    });
}
exports.getSuggestions = getSuggestions;
