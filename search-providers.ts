
import axios from 'axios';

type SearchInfo = {
    name: string;
    url: string;
    snippet: string;
}

type SearchApiProvider = {
    name: string;
    searchEndpoint: string;
    headers: object | undefined;
    params: undefined | object;
    getInfoFromRawOutput(rawInfo: any): SearchInfo[];
}

type SearchRawProvider = {
    suggestURL: string;
    searchURL: string;
    searchToken: string;
    suggestToken: string;
}

var bingProvider: SearchApiProvider = {
    name: 'Bing',
    searchEndpoint: 'https://api.bing.microsoft.com/v7.0/search',
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
    },
    params: undefined,
    getInfoFromRawOutput(rawInfo: any): SearchInfo[] {    
        return rawInfo.webPages.value.map((page: any) => ({
            name: page.name,
            url: page.url,
            snippet: page.snippet
        }));
    },

}

export var providers = [bingProvider, googleProvider]


const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", function (req:any, res:any) {
    if (!req.query.provider || !req.query.q) return
    const provider = providers.find((provider) => provider.name === req.query.provider);
    const query = req.query.q;
    if (!provider || !query) return

    getProviderSearch(provider, query)?.then(response => {
        res.send(provider.getInfoFromRawOutput(response?.data))
    })
});

router.get("/list", function (req:any, res:any) {
    res.send(providers.map((provider) => provider.name))
});

function getProviderSearch(provider: SearchApiProvider | undefined, query: string){
    return provider ? axios.get(
      provider.searchEndpoint,
    {
        headers:  provider.headers,
        params: Object.assign({}, provider.params, {
            'q': encodeURIComponent(query)
        })
        
    }) : undefined
}

