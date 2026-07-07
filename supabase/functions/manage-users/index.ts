import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unbekannter Fehler";
}

function authCreateStatus(error: { status?: number; message?: string }) {
  const message = error.message?.toLowerCase() || "";
  if (message.includes("already") || message.includes("registered")) return 409;
  if (error.status && error.status >= 400 && error.status < 500) return error.status;
  return 500;
}

function authCreateMessage(error: { message?: string }) {
  const message = error.message || "";
  const normalized = message.toLowerCase();
  if (normalized.includes("already") || normalized.includes("registered")) {
    return "Dieser Nutzer existiert bereits.";
  }
  if (normalized.includes("password")) {
    return "Das Passwort erfüllt die Supabase-Anforderungen nicht.";
  }
  return message || "Nutzer konnte nicht erstellt werden.";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Nicht autorisiert. Bitte neu einloggen." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller using getClaims
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return jsonResponse({ error: "Sitzung abgelaufen. Bitte neu einloggen." }, 401);
    }
    const callerId = claimsData.claims.sub;

    // Check admin role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roles, error: roleCheckError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin");

    if (roleCheckError) throw roleCheckError;
    if (!roles || roles.length === 0) {
      return jsonResponse({ error: "Keine Admin-Berechtigung für die Nutzerverwaltung." }, 403);
    }

    const { action, ...payload } = await req.json();

    if (action === "list") {
      const { data: { users }, error } = await adminClient.auth.admin.listUsers();
      if (error) throw error;

      // Get all roles
      const { data: allRoles } = await adminClient
        .from("user_roles")
        .select("user_id, role");

      const usersWithRoles = users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        role: allRoles?.find((r) => r.user_id === u.id)?.role || null,
      }));

      return jsonResponse({ users: usersWithRoles });
    }

    if (action === "create") {
      const { email, password, role } = payload;
      const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      const passwordValue = typeof password === "string" ? password : "";
      const roleValue = role === "admin" ? "admin" : null;

      if (!normalizedEmail || !passwordValue) {
        return jsonResponse({ error: "E-Mail und Passwort erforderlich." }, 400);
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return jsonResponse({ error: "Bitte eine gültige E-Mail-Adresse eingeben." }, 400);
      }

      if (passwordValue.length < 6) {
        return jsonResponse({ error: "Das Passwort muss mindestens 6 Zeichen lang sein." }, 400);
      }

      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: normalizedEmail,
        password: passwordValue,
        email_confirm: true,
      });

      if (createError) {
        return jsonResponse({ error: authCreateMessage(createError) }, authCreateStatus(createError));
      }

      if (!newUser.user) {
        return jsonResponse({ error: "Supabase hat keinen Nutzer zurückgegeben." }, 500);
      }

      // Assign role if specified
      if (roleValue) {
        const { error: roleError } = await adminClient.from("user_roles").upsert({
          user_id: newUser.user.id,
          role: roleValue,
        }, {
          onConflict: "user_id,role",
        });

        if (roleError) {
          await adminClient.auth.admin.deleteUser(newUser.user.id);
          return jsonResponse({ error: `Nutzer konnte nicht vollständig angelegt werden: ${roleError.message}` }, 500);
        }
      }

      return jsonResponse({ user: { id: newUser.user.id, email: newUser.user.email } });
    }

    if (action === "delete") {
      const { userId } = payload;
      if (!userId) {
        return jsonResponse({ error: "User ID erforderlich." }, 400);
      }
      // Prevent self-deletion
      if (userId === callerId) {
        return jsonResponse({ error: "Sie können sich nicht selbst löschen." }, 400);
      }

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;

      return jsonResponse({ success: true });
    }

    if (action === "update_role") {
      const { userId, role } = payload;
      if (!userId) {
        return jsonResponse({ error: "User ID erforderlich." }, 400);
      }

      // Remove existing roles
      await adminClient.from("user_roles").delete().eq("user_id", userId);

      // Add new role if specified
      if (role) {
        await adminClient.from("user_roles").insert({ user_id: userId, role });
      }

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Unbekannte Aktion." }, 400);
  } catch (error) {
    console.error("manage-users error:", error);
    return jsonResponse({ error: errorMessage(error) }, 500);
  }
});
