import { createVuePlugin } from 'vite-plugin-vue2';
export default {
    plugins: [
        createVuePlugin({
            target: 'esnext',
        }),
    ],
    build: {
      outDir: "docs",
    }
}
