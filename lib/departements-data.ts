/**
 * departements-data.ts
 * Liste des 95 départements métropolitains français
 * Utilisé pour les pages SEO /notaire-departement/[dept]
 */

export interface Departement {
  slug: string;       // URL slug (e.g. "var", "haute-garonne")
  name: string;       // Nom officiel (e.g. "Var", "Haute-Garonne")
  code: string;       // Code INSEE (e.g. "83", "31")
  chefLieu: string;   // Préfecture (e.g. "Toulon", "Toulouse")
  region: string;     // Région administrative
  population: number; // Approximatif (pour trier les plus peuplés)
}

export const DEPARTEMENTS: Departement[] = [
  // Île-de-France
  { slug: "seine-et-marne",      name: "Seine-et-Marne",      code: "77", chefLieu: "Melun",        region: "Île-de-France",     population: 1420000 },
  { slug: "yvelines",            name: "Yvelines",            code: "78", chefLieu: "Versailles",   region: "Île-de-France",     population: 1450000 },
  { slug: "essonne",             name: "Essonne",             code: "91", chefLieu: "Évry-Courcouronnes", region: "Île-de-France", population: 1310000 },
  { slug: "hauts-de-seine",      name: "Hauts-de-Seine",      code: "92", chefLieu: "Nanterre",     region: "Île-de-France",     population: 1620000 },
  { slug: "seine-saint-denis",   name: "Seine-Saint-Denis",   code: "93", chefLieu: "Bobigny",      region: "Île-de-France",     population: 1660000 },
  { slug: "val-de-marne",        name: "Val-de-Marne",        code: "94", chefLieu: "Créteil",      region: "Île-de-France",     population: 1380000 },
  { slug: "val-d-oise",          name: "Val-d'Oise",          code: "95", chefLieu: "Cergy",        region: "Île-de-France",     population: 1220000 },
  // Auvergne-Rhône-Alpes
  { slug: "ain",                 name: "Ain",                 code: "01", chefLieu: "Bourg-en-Bresse", region: "Auvergne-Rhône-Alpes", population: 660000 },
  { slug: "allier",              name: "Allier",              code: "03", chefLieu: "Moulins",      region: "Auvergne-Rhône-Alpes", population: 337000 },
  { slug: "ardeche",             name: "Ardèche",             code: "07", chefLieu: "Privas",       region: "Auvergne-Rhône-Alpes", population: 330000 },
  { slug: "cantal",              name: "Cantal",              code: "15", chefLieu: "Aurillac",     region: "Auvergne-Rhône-Alpes", population: 144000 },
  { slug: "drome",               name: "Drôme",               code: "26", chefLieu: "Valence",      region: "Auvergne-Rhône-Alpes", population: 520000 },
  { slug: "isere",               name: "Isère",               code: "38", chefLieu: "Grenoble",     region: "Auvergne-Rhône-Alpes", population: 1270000 },
  { slug: "loire",               name: "Loire",               code: "42", chefLieu: "Saint-Étienne", region: "Auvergne-Rhône-Alpes", population: 765000 },
  { slug: "haute-loire",         name: "Haute-Loire",         code: "43", chefLieu: "Le Puy-en-Velay", region: "Auvergne-Rhône-Alpes", population: 231000 },
  { slug: "puy-de-dome",         name: "Puy-de-Dôme",         code: "63", chefLieu: "Clermont-Ferrand", region: "Auvergne-Rhône-Alpes", population: 660000 },
  { slug: "rhone",               name: "Rhône",               code: "69", chefLieu: "Lyon",         region: "Auvergne-Rhône-Alpes", population: 1900000 },
  { slug: "savoie",              name: "Savoie",              code: "73", chefLieu: "Chambéry",     region: "Auvergne-Rhône-Alpes", population: 440000 },
  { slug: "haute-savoie",        name: "Haute-Savoie",        code: "74", chefLieu: "Annecy",       region: "Auvergne-Rhône-Alpes", population: 830000 },
  // Bourgogne-Franche-Comté
  { slug: "cote-d-or",           name: "Côte-d'Or",           code: "21", chefLieu: "Dijon",        region: "Bourgogne-Franche-Comté", population: 535000 },
  { slug: "doubs",               name: "Doubs",               code: "25", chefLieu: "Besançon",     region: "Bourgogne-Franche-Comté", population: 545000 },
  { slug: "jura",                name: "Jura",                code: "39", chefLieu: "Lons-le-Saunier", region: "Bourgogne-Franche-Comté", population: 259000 },
  { slug: "nievre",              name: "Nièvre",              code: "58", chefLieu: "Nevers",       region: "Bourgogne-Franche-Comté", population: 208000 },
  { slug: "haute-saone",         name: "Haute-Saône",         code: "70", chefLieu: "Vesoul",       region: "Bourgogne-Franche-Comté", population: 238000 },
  { slug: "saone-et-loire",      name: "Saône-et-Loire",      code: "71", chefLieu: "Mâcon",        region: "Bourgogne-Franche-Comté", population: 553000 },
  { slug: "yonne",               name: "Yonne",               code: "89", chefLieu: "Auxerre",      region: "Bourgogne-Franche-Comté", population: 340000 },
  { slug: "territoire-de-belfort", name: "Territoire de Belfort", code: "90", chefLieu: "Belfort",  region: "Bourgogne-Franche-Comté", population: 143000 },
  // Bretagne
  { slug: "cotes-d-armor",       name: "Côtes-d'Armor",       code: "22", chefLieu: "Saint-Brieuc", region: "Bretagne",          population: 600000 },
  { slug: "finistere",           name: "Finistère",           code: "29", chefLieu: "Quimper",      region: "Bretagne",          population: 910000 },
  { slug: "ille-et-vilaine",     name: "Ille-et-Vilaine",     code: "35", chefLieu: "Rennes",       region: "Bretagne",          population: 1100000 },
  { slug: "morbihan",            name: "Morbihan",            code: "56", chefLieu: "Vannes",       region: "Bretagne",          population: 760000 },
  // Centre-Val de Loire
  { slug: "cher",                name: "Cher",                code: "18", chefLieu: "Bourges",      region: "Centre-Val de Loire", population: 305000 },
  { slug: "eure-et-loir",        name: "Eure-et-Loir",        code: "28", chefLieu: "Chartres",     region: "Centre-Val de Loire", population: 430000 },
  { slug: "indre",               name: "Indre",               code: "36", chefLieu: "Châteauroux",  region: "Centre-Val de Loire", population: 220000 },
  { slug: "indre-et-loire",      name: "Indre-et-Loire",      code: "37", chefLieu: "Tours",        region: "Centre-Val de Loire", population: 610000 },
  { slug: "loir-et-cher",        name: "Loir-et-Cher",        code: "41", chefLieu: "Blois",        region: "Centre-Val de Loire", population: 330000 },
  { slug: "loiret",              name: "Loiret",              code: "45", chefLieu: "Orléans",      region: "Centre-Val de Loire", population: 690000 },
  // Corse
  { slug: "corse-du-sud",        name: "Corse-du-Sud",        code: "2A", chefLieu: "Ajaccio",      region: "Corse",             population: 160000 },
  { slug: "haute-corse",         name: "Haute-Corse",         code: "2B", chefLieu: "Bastia",       region: "Corse",             population: 180000 },
  // Grand Est
  { slug: "ardennes",            name: "Ardennes",            code: "08", chefLieu: "Charleville-Mézières", region: "Grand Est", population: 280000 },
  { slug: "aube",                name: "Aube",                code: "10", chefLieu: "Troyes",       region: "Grand Est",         population: 310000 },
  { slug: "marne",               name: "Marne",               code: "51", chefLieu: "Châlons-en-Champagne", region: "Grand Est", population: 570000 },
  { slug: "haute-marne",         name: "Haute-Marne",         code: "52", chefLieu: "Chaumont",     region: "Grand Est",         population: 173000 },
  { slug: "meurthe-et-moselle",  name: "Meurthe-et-Moselle",  code: "54", chefLieu: "Nancy",        region: "Grand Est",         population: 730000 },
  { slug: "meuse",               name: "Meuse",               code: "55", chefLieu: "Bar-le-Duc",   region: "Grand Est",         population: 185000 },
  { slug: "moselle",             name: "Moselle",             code: "57", chefLieu: "Metz",         region: "Grand Est",         population: 1050000 },
  { slug: "bas-rhin",            name: "Bas-Rhin",            code: "67", chefLieu: "Strasbourg",   region: "Grand Est",         population: 1140000 },
  { slug: "haut-rhin",           name: "Haut-Rhin",           code: "68", chefLieu: "Colmar",       region: "Grand Est",         population: 775000 },
  { slug: "vosges",              name: "Vosges",              code: "88", chefLieu: "Épinal",       region: "Grand Est",         population: 370000 },
  // Hauts-de-France
  { slug: "aisne",               name: "Aisne",               code: "02", chefLieu: "Laon",         region: "Hauts-de-France",   population: 534000 },
  { slug: "nord",                name: "Nord",                code: "59", chefLieu: "Lille",        region: "Hauts-de-France",   population: 2620000 },
  { slug: "oise",                name: "Oise",                code: "60", chefLieu: "Beauvais",     region: "Hauts-de-France",   population: 830000 },
  { slug: "pas-de-calais",       name: "Pas-de-Calais",       code: "62", chefLieu: "Arras",        region: "Hauts-de-France",   population: 1470000 },
  { slug: "somme",               name: "Somme",               code: "80", chefLieu: "Amiens",       region: "Hauts-de-France",   population: 570000 },
  // Normandie
  { slug: "calvados",            name: "Calvados",            code: "14", chefLieu: "Caen",         region: "Normandie",         population: 700000 },
  { slug: "eure",                name: "Eure",                code: "27", chefLieu: "Évreux",       region: "Normandie",         population: 600000 },
  { slug: "manche",              name: "Manche",              code: "50", chefLieu: "Saint-Lô",     region: "Normandie",         population: 498000 },
  { slug: "orne",                name: "Orne",                code: "61", chefLieu: "Alençon",      region: "Normandie",         population: 285000 },
  { slug: "seine-maritime",      name: "Seine-Maritime",      code: "76", chefLieu: "Rouen",        region: "Normandie",         population: 1270000 },
  // Nouvelle-Aquitaine
  { slug: "charente",            name: "Charente",            code: "16", chefLieu: "Angoulême",    region: "Nouvelle-Aquitaine", population: 356000 },
  { slug: "charente-maritime",   name: "Charente-Maritime",   code: "17", chefLieu: "La Rochelle",  region: "Nouvelle-Aquitaine", population: 650000 },
  { slug: "correze",             name: "Corrèze",             code: "19", chefLieu: "Tulle",        region: "Nouvelle-Aquitaine", population: 244000 },
  { slug: "creuse",              name: "Creuse",              code: "23", chefLieu: "Guéret",       region: "Nouvelle-Aquitaine", population: 116000 },
  { slug: "dordogne",            name: "Dordogne",            code: "24", chefLieu: "Périgueux",    region: "Nouvelle-Aquitaine", population: 415000 },
  { slug: "gironde",             name: "Gironde",             code: "33", chefLieu: "Bordeaux",     region: "Nouvelle-Aquitaine", population: 1590000 },
  { slug: "landes",              name: "Landes",              code: "40", chefLieu: "Mont-de-Marsan", region: "Nouvelle-Aquitaine", population: 415000 },
  { slug: "lot-et-garonne",      name: "Lot-et-Garonne",      code: "47", chefLieu: "Agen",         region: "Nouvelle-Aquitaine", population: 335000 },
  { slug: "pyrenees-atlantiques", name: "Pyrénées-Atlantiques", code: "64", chefLieu: "Pau",        region: "Nouvelle-Aquitaine", population: 680000 },
  { slug: "deux-sevres",         name: "Deux-Sèvres",         code: "79", chefLieu: "Niort",        region: "Nouvelle-Aquitaine", population: 378000 },
  { slug: "vienne",              name: "Vienne",              code: "86", chefLieu: "Poitiers",     region: "Nouvelle-Aquitaine", population: 444000 },
  { slug: "haute-vienne",        name: "Haute-Vienne",        code: "87", chefLieu: "Limoges",      region: "Nouvelle-Aquitaine", population: 370000 },
  // Occitanie
  { slug: "ariege",              name: "Ariège",              code: "09", chefLieu: "Foix",         region: "Occitanie",         population: 154000 },
  { slug: "aveyron",             name: "Aveyron",             code: "12", chefLieu: "Rodez",        region: "Occitanie",         population: 280000 },
  { slug: "gard",                name: "Gard",                code: "30", chefLieu: "Nîmes",        region: "Occitanie",         population: 750000 },
  { slug: "haute-garonne",       name: "Haute-Garonne",       code: "31", chefLieu: "Toulouse",     region: "Occitanie",         population: 1380000 },
  { slug: "gers",                name: "Gers",                code: "32", chefLieu: "Auch",         region: "Occitanie",         population: 194000 },
  { slug: "herault",             name: "Hérault",             code: "34", chefLieu: "Montpellier",  region: "Occitanie",         population: 1180000 },
  { slug: "lot",                 name: "Lot",                 code: "46", chefLieu: "Cahors",       region: "Occitanie",         population: 174000 },
  { slug: "lozere",              name: "Lozère",              code: "48", chefLieu: "Mende",        region: "Occitanie",         population: 76000 },
  { slug: "hautes-pyrenees",     name: "Hautes-Pyrénées",     code: "65", chefLieu: "Tarbes",       region: "Occitanie",         population: 229000 },
  { slug: "pyrenees-orientales", name: "Pyrénées-Orientales", code: "66", chefLieu: "Perpignan",    region: "Occitanie",         population: 490000 },
  { slug: "tarn",                name: "Tarn",                code: "81", chefLieu: "Albi",         region: "Occitanie",         population: 390000 },
  { slug: "tarn-et-garonne",     name: "Tarn-et-Garonne",     code: "82", chefLieu: "Montauban",    region: "Occitanie",         population: 260000 },
  // Pays de la Loire
  { slug: "loire-atlantique",    name: "Loire-Atlantique",    code: "44", chefLieu: "Nantes",       region: "Pays de la Loire",  population: 1430000 },
  { slug: "maine-et-loire",      name: "Maine-et-Loire",      code: "49", chefLieu: "Angers",       region: "Pays de la Loire",  population: 810000 },
  { slug: "mayenne",             name: "Mayenne",             code: "53", chefLieu: "Laval",        region: "Pays de la Loire",  population: 307000 },
  { slug: "sarthe",              name: "Sarthe",              code: "72", chefLieu: "Le Mans",      region: "Pays de la Loire",  population: 565000 },
  { slug: "vendee",              name: "Vendée",              code: "85", chefLieu: "La Roche-sur-Yon", region: "Pays de la Loire", population: 690000 },
  // Provence-Alpes-Côte d'Azur
  { slug: "alpes-de-haute-provence", name: "Alpes-de-Haute-Provence", code: "04", chefLieu: "Digne-les-Bains", region: "Provence-Alpes-Côte d'Azur", population: 164000 },
  { slug: "hautes-alpes",        name: "Hautes-Alpes",        code: "05", chefLieu: "Gap",          region: "Provence-Alpes-Côte d'Azur", population: 142000 },
  { slug: "alpes-maritimes",     name: "Alpes-Maritimes",     code: "06", chefLieu: "Nice",         region: "Provence-Alpes-Côte d'Azur", population: 1090000 },
  { slug: "bouches-du-rhone",    name: "Bouches-du-Rhône",    code: "13", chefLieu: "Marseille",    region: "Provence-Alpes-Côte d'Azur", population: 2030000 },
  { slug: "var",                 name: "Var",                 code: "83", chefLieu: "Toulon",       region: "Provence-Alpes-Côte d'Azur", population: 1080000 },
  { slug: "vaucluse",            name: "Vaucluse",            code: "84", chefLieu: "Avignon",      region: "Provence-Alpes-Côte d'Azur", population: 570000 },
];

/** Retourne un département par son slug */
export function getDepartementBySlug(slug: string): Departement | undefined {
  return DEPARTEMENTS.find((d) => d.slug === slug);
}

/** Tous les slugs — utilisé pour generateStaticParams */
export function getAllDepartementSlugs(): string[] {
  return DEPARTEMENTS.map((d) => d.slug);
}
