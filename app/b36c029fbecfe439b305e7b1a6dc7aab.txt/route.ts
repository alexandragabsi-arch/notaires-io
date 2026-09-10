// Preuve de propriété pour IndexNow.
//
// Le protocole exige qu'un fichier portant le nom de la clé et contenant cette
// même clé soit servi à la racine du domaine : c'est ainsi que Bing vérifie que
// celui qui soumet des URL contrôle bien le site.

export const dynamic = "force-static";

export function GET() {
  return new Response("b36c029fbecfe439b305e7b1a6dc7aab", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
