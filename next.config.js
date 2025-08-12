/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
module.exports = {
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination:
                process.env.NODE_ENV === 'development'
                    ? 'http://127.0.0.1:5000/api/:path*'
                    : '/api/', // proxy to python backend
            }
        ]
    }
}