import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
const API_URL =
  "https://script.google.com/macros/s/AKfycbyX9tmXzZ1ck8wWA_PINZZB-3VXr3c1JFQHKm4mVMkw10_OYAab38hmH64mOernQDie/exec";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "gas-proxy",
      configureServer(server) {
        server.middlewares.use(async (req, res,next) => {
          if (!req.url.startsWith('/gas')) return next()
          var query = req.url.replace('/gas','')

          var target = API_URL + query;
          console.log('[GAS Proxy] ->', target)
          try {
            const response = await fetch(target, { redirect: "follow" });
            const text = await response.text();
            res.setHeader("Content-Type", "application/json");
      
            res.end(text);
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      },
    },
  ],
});
