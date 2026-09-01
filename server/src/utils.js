export const toStr = (obj) => JSON.stringify(obj);
export const toObj = (str) => JSON.parse(str);
export const copy = (arg) => toObj(toStr(arg));

export function extractQueryParam(req, query=['type','data']) {
    const queryParams = new URLSearchParams(req.url.split("?")[1]);
    return queryParams.entries().reduce((agg,kv)=>({...agg,[kv[0]]:toObj(kv[1])}),{});
}