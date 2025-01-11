/** 
 * custom Default config for createProxyMiddleware
*/
export const proxyDefaultConfig = {
    headers: {
        "Cache-Control": "no-store"
    },
    logger: console
} 