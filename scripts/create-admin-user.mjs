import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

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

function normalizeProjectRef(value) {
  const trimmed = value.trim();
  const dashboardMatch = trimmed.match(/\/project\/([a-z0-9]{20})(?:\/|$)/i);
  if (dashboardMatch) return dashboardMatch[1];

  const supabaseHostMatch = trimmed.match(/^https?:\/\/([a-z0-9]{20})\.supabase\.co/i);
  if (supabaseHostMatch) return supabaseHostMatch[1];

  return trimmed;
}

function requireValue(env, key) {
  const value = env[key] || process.env[key];
  if (!value) {
    throw new Error(`${key} fehlt. Bitte in ${setupEnvPath} eintragen.`);
  }
  return value;
}

function getServiceRoleKey(projectRef, env) {
  const result = spawnSync(
    "npx",
    ["supabase", "projects", "api-keys", "--project-ref", projectRef, "--reveal", "--output", "json"],
    {
      encoding: "utf8",
      env: { ...process.env, ...env },
    }
  );

  if (result.status !== 0) {
    throw new Error("Supabase Service-Role-Key konnte nicht gelesen werden.");
  }

  const keys = JSON.parse(result.stdout);
  const serviceRoleKey = keys.find((key) => key.name === "service_role")?.api_key;
  if (!serviceRoleKey) {
    throw new Error("Supabase service_role API-Key nicht gefunden.");
  }

  return serviceRoleKey;
}

const localEnv = loadEnvFile(setupEnvPath);
const cliEnv = { ...localEnv };
const projectRef = normalizeProjectRef(requireValue(localEnv, "SUPABASE_PROJECT_REF"));
const supabaseUrl = requireValue(localEnv, "NEXT_PUBLIC_SUPABASE_URL");
const adminEmail = requireValue(localEnv, "ADMIN_EMAIL").trim().toLowerCase();
const adminPassword = requireValue(localEnv, "ADMIN_PASSWORD");
const serviceRoleKey = getServiceRoleKey(projectRef, cliEnv);

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) throw listError;

let user = usersData.users.find((candidate) => candidate.email?.toLowerCase() === adminEmail);
let action = "updated";

if (user) {
  const { data, error } = await adminClient.auth.admin.updateUserById(user.id, {
    password: adminPassword,
    email_confirm: true,
  });
  if (error) throw error;
  user = data.user;
} else {
  const { data, error } = await adminClient.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });
  if (error) throw error;
  user = data.user;
  action = "created";
}

const { error: roleError } = await adminClient
  .from("user_roles")
  .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
if (roleError) throw roleError;

console.log(action === "created" ? `Admin-User ${adminEmail} angelegt.` : `Admin-User ${adminEmail} aktualisiert.`);
console.log("Admin-Rolle ist gesetzt.");
