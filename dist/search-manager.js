"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSession = exports.cacheResponse = exports.importSession = exports.exportSession = exports.addQueryToSession = exports.neighborQueries = exports.backwardQuery = void 0;
function backwardQuery(session) {
    const current_query = session === null || session === void 0 ? void 0 : session.queries.get(session.current_query_id);
    session.current_query_id =
        current_query && current_query.previous_query_id ?
            current_query.previous_query_id : session.current_query_id;
}
exports.backwardQuery = backwardQuery;
function neighborQueries(session, id) {
    var _a;
    var previousQueryId = (_a = session.queries.get(id)) === null || _a === void 0 ? void 0 : _a.previous_query_id;
    if (!previousQueryId)
        return [];
    var neighborQueries = [];
    for (const [key, value] of session.queries) {
        if (value.previous_query_id == previousQueryId) {
            neighborQueries.push(key);
        }
    }
    return neighborQueries;
}
exports.neighborQueries = neighborQueries;
function addQueryToSession(query, session) {
    const query_id = session.last_query_id + 1;
    session.last_query_id = query_id;
    session.queries.set(query_id, { query_val: query,
        previous_query_id: session.current_query_id, cached_response: undefined });
    session.current_query_id = query_id;
    return query_id;
}
exports.addQueryToSession = addQueryToSession;
function exportSession(session) {
    console.log(session);
    var queries_info = [];
    for (const [key, value] of session.queries) {
        queries_info.push({ 'id': key, 'previous': value.previous_query_id, 'value': value.query_val, 'cached_response': value.cached_response });
    }
    var session_info = {
        'current_query_id': session.current_query_id,
        'last_query_id': session.last_query_id,
        'queries': queries_info
    };
    return JSON.stringify(session_info);
}
exports.exportSession = exportSession;
function importSession(session, import_info) {
    session.current_query_id = import_info['current_query_id'];
    session.last_query_id = import_info['last_query_id'];
    for (var i = 0; i < import_info['queries'].length; i++) {
        let info = import_info['queries'][i];
        session.queries.set(info['id'], { previous_query_id: info['previous'], query_val: info['value'], cached_response: undefined });
    }
}
exports.importSession = importSession;
function cacheResponse(session, queryId, response) {
    var query = session.queries.get(queryId);
    if (!query)
        return;
    query.cached_response = response;
}
exports.cacheResponse = cacheResponse;
var MainSession;
(function (MainSession) {
    MainSession.instance = { queries: new Map(), last_query_id: 0, current_query_id: 0 };
})(MainSession || (exports.MainSession = MainSession = {}));
// [{'label': 'POSITIVE', 'score': 0.999817686}]
