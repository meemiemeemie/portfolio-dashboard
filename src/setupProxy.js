const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://api.dashlane.com/public/teams',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '',
            },
        })
    );
};
