import http from "http";
import { createProxyServer } from "http-proxy";

const proxy = createProxyServer({
    cookieDomainRewrite: "",
    cookiePathRewrite: {
        "*": "/"
    },
    changeOrigin:true,
});

const server = http.createServer((req, res) => {

    if (req.url?.startsWith("/u")) {
        const proxiedPath = req.url.replace(/^\/u/, "");

        req.url = proxiedPath;

        proxy.web(req, res, { target: 'http://localhost:3000' })
    }
})

server.listen(process.env.PORT, () => {
    console.log('gateway running at port:', process.env.PORT)
})

proxy.on("proxyRes", (proxyRes, req, res)=>{
    console.log("res: ",proxyRes.headers)
})