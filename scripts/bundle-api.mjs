import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const esbuild = require("esbuild");

await esbuild.build({
  entryPoints: ["api-src/health.ts", "api-src/inquiries.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outdir: "api",
  outbase: "api-src",
  external: ["nodemailer"],
  logLevel: "info",
});
