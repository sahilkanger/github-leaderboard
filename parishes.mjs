// Louisiana's 64 parishes, and the towns, cities, and universities people write in their GitHub
// location, mapped to the parish they are in. Used only for people already placed in Louisiana,
// so town names shared with other states (Monroe, Lafayette, Alexandria) are safe here.
export const PARISHES = [
  "Acadia", "Allen", "Ascension", "Assumption", "Avoyelles", "Beauregard", "Bienville", "Bossier",
  "Caddo", "Calcasieu", "Caldwell", "Cameron", "Catahoula", "Claiborne", "Concordia", "De Soto",
  "East Baton Rouge", "East Carroll", "East Feliciana", "Evangeline", "Franklin", "Grant", "Iberia",
  "Iberville", "Jackson", "Jefferson", "Jefferson Davis", "Lafayette", "Lafourche", "LaSalle", "Lincoln",
  "Livingston", "Madison", "Morehouse", "Natchitoches", "Orleans", "Ouachita", "Plaquemines",
  "Pointe Coupee", "Rapides", "Red River", "Richland", "Sabine", "St. Bernard", "St. Charles",
  "St. Helena", "St. James", "St. John the Baptist", "St. Landry", "St. Martin", "St. Mary",
  "St. Tammany", "Tangipahoa", "Tensas", "Terrebonne", "Union", "Vermilion", "Vernon", "Washington",
  "Webster", "West Baton Rouge", "West Carroll", "West Feliciana", "Winn",
];

// Place → parish. Longest names are tried first, so "West Monroe" wins over "Monroe".
export const PLACES = {
  // Orleans and the metro
  "New Orleans": "Orleans", NOLA: "Orleans", Tulane: "Orleans", Loyola: "Orleans", "Algiers": "Orleans",
  Metairie: "Jefferson", Kenner: "Jefferson", Gretna: "Jefferson", Harvey: "Jefferson", Marrero: "Jefferson",
  Westwego: "Jefferson", Harahan: "Jefferson", "River Ridge": "Jefferson", Terrytown: "Jefferson", "Grand Isle": "Jefferson",
  Chalmette: "St. Bernard", Arabi: "St. Bernard", Meraux: "St. Bernard",
  "Belle Chasse": "Plaquemines",
  // Baton Rouge area
  "Baton Rouge": "East Baton Rouge", LSU: "East Baton Rouge", "Louisiana State University": "East Baton Rouge",
  "Southern University": "East Baton Rouge", Zachary: "East Baton Rouge", Baker: "East Baton Rouge",
  Prairieville: "Ascension", Gonzales: "Ascension", Donaldsonville: "Ascension", Sorrento: "Ascension",
  "Denham Springs": "Livingston", Walker: "Livingston", Watson: "Livingston",
  "Port Allen": "West Baton Rouge", Plaquemine: "Iberville", "New Roads": "Pointe Coupee",
  "St. Francisville": "West Feliciana", Clinton: "East Feliciana",
  // Northshore and Florida parishes
  Hammond: "Tangipahoa", Ponchatoula: "Tangipahoa", Amite: "Tangipahoa", Independence: "Tangipahoa",
  Kentwood: "Tangipahoa", "Southeastern Louisiana": "Tangipahoa",
  Slidell: "St. Tammany", Mandeville: "St. Tammany", Covington: "St. Tammany", Madisonville: "St. Tammany",
  "Abita Springs": "St. Tammany", Lacombe: "St. Tammany", "Pearl River": "St. Tammany",
  Bogalusa: "Washington", Franklinton: "Washington", Greensburg: "St. Helena",
  // River parishes and bayou
  LaPlace: "St. John the Baptist", "La Place": "St. John the Baptist", Reserve: "St. John the Baptist", Garyville: "St. John the Baptist",
  Luling: "St. Charles", Destrehan: "St. Charles", Hahnville: "St. Charles", Boutte: "St. Charles", "St. Rose": "St. Charles", Norco: "St. Charles",
  Lutcher: "St. James", Gramercy: "St. James", Vacherie: "St. James", Napoleonville: "Assumption",
  Thibodaux: "Lafourche", Raceland: "Lafourche", Lockport: "Lafourche", Larose: "Lafourche", "Cut Off": "Lafourche",
  Galliano: "Lafourche", "Golden Meadow": "Lafourche", Nicholls: "Lafourche",
  Houma: "Terrebonne", Bourg: "Terrebonne", Chauvin: "Terrebonne", Montegut: "Terrebonne",
  "Morgan City": "St. Mary", Patterson: "St. Mary", Berwick: "St. Mary", Franklin: "St. Mary",
  // Acadiana
  Lafayette: "Lafayette", "UL Lafayette": "Lafayette", ULL: "Lafayette", Broussard: "Lafayette",
  Youngsville: "Lafayette", Carencro: "Lafayette", Scott: "Lafayette", Duson: "Lafayette",
  "New Iberia": "Iberia", Jeanerette: "Iberia", Loreauville: "Iberia",
  "St. Martinville": "St. Martin", "Breaux Bridge": "St. Martin", Henderson: "St. Martin",
  Abbeville: "Vermilion", Kaplan: "Vermilion", Erath: "Vermilion",
  Crowley: "Acadia", Rayne: "Acadia", "Church Point": "Acadia",
  Opelousas: "St. Landry", Eunice: "St. Landry", Sunset: "St. Landry", "Grand Coteau": "St. Landry", "Port Barre": "St. Landry",
  "Ville Platte": "Evangeline", Mamou: "Evangeline",
  Jennings: "Jefferson Davis", Welsh: "Jefferson Davis", "Lake Arthur": "Jefferson Davis",
  // Southwest
  "Lake Charles": "Calcasieu", Sulphur: "Calcasieu", Westlake: "Calcasieu", "Moss Bluff": "Calcasieu",
  Vinton: "Calcasieu", DeQuincy: "Calcasieu", McNeese: "Calcasieu", Iowa: "Calcasieu",
  DeRidder: "Beauregard", Leesville: "Vernon", "Fort Polk": "Vernon", "Fort Johnson": "Vernon",
  Oakdale: "Allen", Kinder: "Allen", Cameron: "Cameron",
  // Central
  Alexandria: "Rapides", Pineville: "Rapides", Ball: "Rapides",
  Marksville: "Avoyelles", Bunkie: "Avoyelles", Natchitoches: "Natchitoches", Many: "Sabine",
  Colfax: "Grant", Jena: "LaSalle", Harrisonburg: "Catahoula", Jonesville: "Catahoula",
  Vidalia: "Concordia", Ferriday: "Concordia", Winnfield: "Winn",
  // Northwest
  Shreveport: "Caddo", Blanchard: "Caddo", Vivian: "Caddo", Greenwood: "Caddo",
  "Bossier City": "Bossier", Bossier: "Bossier", Benton: "Bossier", Haughton: "Bossier", "Plain Dealing": "Bossier",
  Minden: "Webster", Springhill: "Webster", Homer: "Claiborne", Haynesville: "Claiborne",
  Mansfield: "De Soto", Coushatta: "Red River", Arcadia: "Bienville",
  // Northeast and the Delta
  Ruston: "Lincoln", Grambling: "Lincoln", "Louisiana Tech": "Lincoln", Dubach: "Lincoln",
  "West Monroe": "Ouachita", Monroe: "Ouachita", Sterlington: "Ouachita", ULM: "Ouachita",
  Bastrop: "Morehouse", "Mer Rouge": "Morehouse",
  "Lake Providence": "East Carroll", "Oak Grove": "West Carroll", Tallulah: "Madison",
  Rayville: "Richland", Delhi: "Richland", Winnsboro: "Franklin", Columbia: "Caldwell",
  Jonesboro: "Jackson", Farmerville: "Union", "St. Joseph": "Tensas",
};

// Louisiana place names unlikely to mean anywhere else: enough to place someone in Louisiana
// when they did not write the state.
export const LA_ONLY = [
  "New Orleans", "NOLA", "Baton Rouge", "Shreveport", "Lake Charles", "Metairie", "Houma", "Slidell",
  "Bossier City", "Ruston", "Thibodaux", "Natchitoches", "Mandeville", "Denham Springs", "Prairieville",
  "Opelousas", "New Iberia", "West Monroe", "Lake Providence", "Chalmette", "Ponchatoula", "Breaux Bridge",
  "Bogalusa", "LaPlace", "Broussard", "Marrero", "Harahan", "DeRidder", "Tallulah", "Mer Rouge", "Kenner",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
const placeRes = Object.keys(PLACES)
  .sort((a, b) => b.length - a.length)
  .map((name) => [new RegExp(`\\b${esc(name).replace(/^St\\\./, "(?:St\\.?|Saint)")}\\b`, "i"), PLACES[name]]);
const parishRes = [...PARISHES]
  .sort((a, b) => b.length - a.length)
  .map((p) => [new RegExp(`\\b${esc(p).replace(/^St\\\./, "(?:St\\.?|Saint)")}\\s+Parish\\b`, "i"), p]);
export const laOnlyRe = new RegExp(`\\b(?:${LA_ONLY.map(esc).join("|")})\\b`, "i");

/** The parish for a Louisiana location, or null when it names only the state. */
export function parishOf(location) {
  const loc = location ?? "";
  for (const [re, p] of parishRes) if (re.test(loc)) return p;
  for (const [re, p] of placeRes) if (re.test(loc)) return p;
  return null;
}
