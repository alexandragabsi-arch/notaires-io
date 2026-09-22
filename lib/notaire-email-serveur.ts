import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { isNotaireEmail } from "@/lib/notaire-email";

// Contrôle serveur du domaine notarial.
//
// La vérification du formulaire (isNotaireEmail côté navigateur) se contourne
// en appelant directement l'API : on relit donc ici l'e-mail RÉEL du compte
// Supabase à partir de son identifiant, plutôt que celui transmis dans le body.
export async function compteEstNotaire(userId: string | undefined): Promise<boolean> {
  if (!userId || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data.user?.email) return false;
  return isNotaireEmail(data.user.email);
}

export const MESSAGE_EMAIL_NON_NOTAIRE =
  "Inscription réservée aux notaires : utilisez votre adresse officielle @notaires.fr (ou un sous-domaine de votre étude).";

export function supabaseAdmin(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

const FENETRE_INSCRIPTION_MS = 2 * 60 * 60 * 1000;

// Identifie le notaire qui appelle une route d'écriture.
//   - avec un jeton de session (Authorization: Bearer …) → ce compte ;
//   - sans session → uniquement le compte qui vient d'être créé et attend la
//     confirmation de son e-mail (créé il y a < 2 h). Une fois confirmé, il
//     faut se connecter : un userId seul ne suffit plus.
// Retourne null si l'appelant n'est pas identifié OU n'est pas en @notaires.fr.
export async function identifierNotaire(
  req: Request,
  db: SupabaseClient,
  userId: unknown,
): Promise<User | null> {
  let user: User | null = null;
  const jeton = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (jeton) {
    const { data } = await db.auth.getUser(jeton);
    user = data.user ?? null;
  } else if (typeof userId === "string" && userId) {
    const { data } = await db.auth.admin.getUserById(userId);
    const u = data.user;
    if (u && !u.email_confirmed_at && Date.now() - new Date(u.created_at).getTime() < FENETRE_INSCRIPTION_MS) {
      user = u;
    }
  }
  return user && isNotaireEmail(user.email ?? "") ? user : null;
}
