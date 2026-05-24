export default {
    build: {
        outDir: './public',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/products': 'http://localhost:3000',
        },
    },
};
