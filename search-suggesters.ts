import axios from "axios";

const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", function (req:any, res:any) {
    if (!req.query.suggester || !req.query.q) return
    const suggester = suggesters.find((suggesters) => suggesters.name === req.query.suggester);
    const query = req.query.q;
    if (!suggester || !query) return

    getSuggestions(suggester, query.trim()).then(data =>{
        if (!data) return
        res.send(data)
      })
});

router.get("/list", function (req:any, res:any) {
    res.send(suggesters.map((suggester) => suggester.name))
});

type SearchSuggest = {
    text: string;
    url: undefined | string;
}

export type SearchServiceSuggester = {
    name: string;
    endpoint: string;
    params: undefined | object;
    headers: object | undefined;
    postSuggestProcess (rawInfo: any): SearchSuggest[];
}

// export var localAIParaphraser: SearchServiceSuggester = {
//     name: "AIParaphraser",
//     endpoint: 'http://localhost:5000/paraphrase',
//     params: undefined,
//     headers: undefined,
//     //TODO: inputParamName: 'input', change to 'q'
//     postSuggestProcess (data: any): SearchSuggest[]{
//         return []
//         var out_data = data?.data['output'] 
        
//         out_data.forEach((element: any, index: number, array: any[]) => array[index] = element[0])
//         return out_data
//     }
// }


// export var localAISuggester: SearchServiceSuggester = {
//     name: "AISuggester",
//     endpoint: 'http://localhost:5000/generate',
//     params: undefined,
//     headers: undefined,
//     //inputParamName: 'input',
//     postSuggestProcess (data: any): SearchSuggest[]{
//         return []

//         var out_data = data?.data['output']         
//         out_data.forEach((element: any, index: number, array: any[]) => array[index] = element['generated_text'])
//         return out_data
//     }
// }

export var bingSuggester: SearchServiceSuggester = {
    name: 'Bing',
    endpoint: 'https://api.bing.microsoft.com/v7.0/Suggestions',
    params: {
        'mkt': 'en-US'
    },
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
    },
    postSuggestProcess (data: any): SearchSuggest[]{
        console.log(data);
        return data.data.suggestionGroups[0].searchSuggestions.map((page: any) => ({
            text: page.displayText,
            url: page.url
        }));
    }
}

export var suggesters = [
    bingSuggester
]

export async function getSuggestions(suggester: SearchServiceSuggester | undefined, query: string){
    if (!suggester) return undefined;
    const params = Object.assign({}, {
        'q': encodeURIComponent(query)
    }, suggester.params)
    
    var answer = await axios.get(
        suggester.endpoint,{    
            params: params,
            headers: suggester.headers
        })
    return suggester.postSuggestProcess(answer)
}


