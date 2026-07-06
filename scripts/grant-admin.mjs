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

function escapeSql(value) {
  return value.replace(/'/g, "''");
}

function runQuery(sql, env) {
  const result = spawnSync("npx", ["supabase", "db", "query", "--linked", "--output", "json", sql], {
    encoding: "utf8",
    env: { ...process.env, ...env },
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    throw new Error("Supabase Query fehlgeschlagen.");
  }

  return JSON.parse(result.stdout);
}

const localEnv = loadEnvFile(setupEnvPath);
const cliEnv = { ...localEnv };
const email = (process.argv[2] || process.env.ADMIN_EMAIL || "").trim();

if (!email) {
  throw new Error("Bitte Admin-E-Mail angeben: npm run supabase:grant-admin -- admin@example.com");
}

const escapedEmail = escapeSql(email);
const sql = `
with target_user as (
  select id
  from auth.users
  where lower(email) = lower('${escapedEmail}')
),
inserted_role as (
  insert into public.user_roles (user_id, role)
  select id, 'admin'::public.app_role
  from target_user
  on conflict (user_id, role) do nothing
  returning user_id
)
select
  (select count(*)::int from target_user) as matching_users,
  (select count(*)::int from inserted_role) as granted_now,
  exists (
    select 1
    from public.user_roles role
    join target_user on target_user.id = role.user_id
    where role.role = 'admin'::public.app_role
  ) as has_admin_role;
`;

const result = runQuery(sql, cliEnv);
const row = result.rows?.[0];

if (!row || row.matching_users === 0) {
  throw new Error(`Kein Supabase Auth-User fuer ${email} gefunden. Bitte zuerst unter Authentication > Users anlegen.`);
}

if (!row.has_admin_role) {
  throw new Error(`Admin-Rolle fuer ${email} konnte nicht gesetzt werden.`);
}

console.log(row.granted_now > 0 ? `Admin-Rolle fuer ${email} gesetzt.` : `Admin-Rolle fuer ${email} war bereits gesetzt.`);
