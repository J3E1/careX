import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	base: '/careX/', // YOUR REPO NAME HERE
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				404: './public/404.html', // Ensure 404.html is included in the build
			},
		},
	},
});
