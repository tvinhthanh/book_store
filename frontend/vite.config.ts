import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // vẫn giữ nguyên port này
    proxy: {
      "/api": {
        target: "http://localhost:5000", // backend của bạn
        changeOrigin: true,
      },
    },
  },
});
