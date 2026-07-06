import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const setupEnvPath = ".env.local";

function loadEnvFile(path) {
  if (!existsSync(path)) return {};

  const entries = {};
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    entries[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
  return entries;
}

function mask(value) {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function requireValue(env, key) {
  const value = env[key] || process.env[key];
  if (!value) {
    throw new Error(`${key} fehlt. Bitte in ${setupEnvPath} eintragen.`);
  }
  return value;
}

function formatArgs(args) {
  return args
    .map((arg, index) => {
      const previousArg = args[index - 1] || "";
      const shouldMaskValue =
        previousArg === "--password" ||
        arg.startsWith("RESEND_API_KEY=") ||
        arg.startsWith("SUPABASE_ACCESS_TOKEN=");

      if (shouldMaskValue) return "********";
      return arg;
    })
    .join(" ");
}

function normalizeProjectRef(value) {
  const trimmed = value.trim();
  const dashboardMatch = trimmed.match(/\/project\/([a-z0-9]{20})(?:\/|$)/i);
  if (dashboardMatch) return dashboardMatch[1];

  const supabaseHostMatch = trimmed.match(/^https?:\/\/([a-z0-9]{20})\.supabase\.co/i);
  if (supabaseHostMatch) return supabaseHostMatch[1];

  return trimmed;
}

function run(command, args, env) {
  console.log(`\n> ${command} ${formatArgs(args)}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...env }
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${formatArgs(args)}`);
  }
}

const localEnv = loadEnvFile(setupEnvPath);
const cliEnv = { ...localEnv };

const projectRef = normalizeProjectRef(requireValue(localEnv, "SUPABASE_PROJECT_REF"));
const dbPassword = requireValue(localEnv, "SUPABASE_DB_PASSWORD");
const nextUrl = requireValue(localEnv, "NEXT_PUBLIC_SUPABASE_URL");
const nextKey = requireValue(localEnv, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const deployFunctions = (localEnv.DEPLOY_SUPABASE_FUNCTIONS || process.env.DEPLOY_SUPABASE_FUNCTIONS) === "true";
const resendApiKey = localEnv.RESEND_API_KEY || process.env.RESEND_API_KEY || "";

console.log("Neues Supabase Setup");
console.log(`Project ref: ${projectRef}`);
console.log(`Next URL: ${nextUrl}`);
console.log(`Publishable key: ${mask(nextKey)}`);
console.log(`Functions deployen: ${deployFunctions ? "ja" : "nein"}`);

run("npx", ["supabase", "link", "--project-ref", projectRef, "--password", dbPassword], cliEnv);
run("npx", ["supabase", "db", "push", "--linked", "--password", dbPassword, "--yes"], cliEnv);

if (deployFunctions) {
  if (resendApiKey) {
    run("npx", ["supabase", "secrets", "set", `RESEND_API_KEY=${resendApiKey}`, "--project-ref", projectRef], cliEnv);
  }

  run(
    "npx",
    [
      "supabase",
      "functions",
      "deploy",
      "manage-users",
      "send-notification-email",
      "verify-site-password",
      "temp-upload-media",
      "migrate-media-files",
      "--project-ref",
      projectRef,
      "--use-api",
    ],
    cliEnv
  );
}

console.log("\nSupabase Setup abgeschlossen.");
console.log("Lege jetzt im Supabase Dashboard einen Auth-User an und fuehre danach supabase/admin-bootstrap.sql mit dessen User-ID aus.");
