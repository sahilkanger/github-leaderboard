// Which US state a GitHub profile location names, if any.
//
// Profile locations are free text, and many two-letter codes belong to other places too: MS is also
// Mato Grosso do Sul in Brazil, SC Santa Catarina, AL Alagoas, DE Germany, IN India, TN Tamil Nadu,
// WA Western Australia, CO Colombia. So a location is placed only on good evidence, in this order:
//
//   1. A location that names another country, or is written in another script, is not placed,
//      unless it also says USA.
//   2. A trailing "City, ST" (optionally followed by USA) wins, so "Missouri City, TX" is Texas.
//      The city must not be a known place elsewhere that uses the same code, must not carry
//      accents no US town of that state would (Florianópolis, Tübingen), and for Delaware and
//      Idaho, whose codes are more often Germany's and Indonesia's, it must be a town listed there.
//   3. Otherwise the state named last: "Kansas City, Missouri" is Missouri, and
//      "Washington Heights, New York" is New York.
//   4. Otherwise a Louisiana place name that means nowhere else (src/parishes.mjs).
//
// test/states.test.mjs holds the cases; scripts/audit.mjs lists what each rule placed.
import { laOnlyRe } from "./parishes.mjs";

export const NAMES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["FL", "Florida"], ["GA", "Georgia"],
  ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"],
  ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];
const AB = new Set(NAMES.map((n) => n[0]));

// Accents and case folded away, so "Florianópolis" and "florianopolis" read the same.
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const words = (list) => new RegExp(`\\b(?:${list.join("|")})\\b`);

const US_MARK = /(?<![a-z])(?:usa|u\.s\.(?:a\.)?|united states(?: of america)?)(?![a-z])/i;
const US_CAPS = /\bUS\b/;

// Countries whose names are not also common US town names (no Lebanon, Peru, Jordan, Mexico, Cuba, Malta),
// with lookarounds for the US places that share one: Panama City, New England, La Cañada, Little Canada.
// US towns named after a country (Norway, ME) are in TOWNS_LIKE_ABROAD.
const COUNTRIES = words([
  "brasil", "brazil", "argentina", "uruguay", "paraguay", "bolivia", "chile", "colombia", "venezuela", "ecuador",
  "mexico city", "cdmx", "ciudad de mexico", "(?<!la |little )canada", "united kingdom", "(?<!new )england", "scotland", "deutschland",
  "germany", "france", "espana", "spain", "portugal", "italia", "italy", "netherlands", "nederland", "belgium",
  "belgie", "switzerland", "schweiz", "suisse", "austria", "osterreich", "sweden", "sverige", "norway", "norge",
  "denmark", "danmark", "finland", "suomi", "poland", "polska", "czech republic", "czechia", "slovakia", "hungary",
  "romania", "bulgaria", "greece", "serbia", "croatia", "slovenia", "ukraine", "russia", "belarus", "lithuania",
  "latvia", "estonia", "turkey", "turkiye", "egypt", "morocco", "algeria", "tunisia", "tunisie", "nigeria", "ghana",
  "kenya", "ethiopia", "uganda", "tanzania", "rwanda", "cameroon", "senegal", "south africa", "zimbabwe", "zambia",
  "israel", "palestine", "syria", "iraq", "iran", "saudi arabia", "ksa", "united arab emirates", "uae", "dubai",
  "qatar", "kuwait", "oman", "bahrain", "pakistan", "india", "bangladesh", "sri lanka", "nepal", "china(?! grove)",
  "japan", "korea", "taiwan", "hong kong", "vietnam", "viet nam", "thailand", "malaysia", "singapore", "indonesia",
  "philippines", "australia", "new zealand", "aotearoa", "mongolia", "moldova", "albania", "montenegro",
  "laos", "macau", "macao", "cayman islands", "new caledonia", "sudan", "niger", "panama(?! city)", "gabon", "seychelles",
  "azerbaijan", "kazakhstan", "uzbekistan", "armenia", "tbilisi", "batumi", "kutaisi", "sakartvelo", "amman",
]);
// Letters from scripts no US town is written in: Cyrillic, Greek, Hebrew, Arabic, Indic, Thai, CJK, Hangul.
const OTHER_SCRIPT = /[Ͱ-ϿЀ-ӿ֐-ۿऀ-෿฀-๿ᄀ-ᇿ぀-ヿ㐀-鿿가-힯]/;
// Accented letters; states with Spanish place names may have the Spanish ones (Cañon City, San José).
const ACCENT = /[À-ÖØ-öø-ɏ]/;
const SPANISH_ACCENT = /^[ñÑáéíóúÁÉÍÓÚ]$/;
const SPANISH_STATES = new Set(["AZ", "CA", "CO", "FL", "NM", "NV", "TX"]);

// Places elsewhere that write the same two letters after their name.
const ELSEWHERE = {
  AL: ["maceio", "arapiraca", "alagoas", "tirana", "durres", "alessandria", "almeria"],
  AR: ["buenos aires", "caba", "capital federal", "cordoba", "rosario", "mendoza", "la plata", "mar del plata", "tucuman",
    "salta", "neuquen", "bahia blanca", "parana", "posadas", "resistencia", "corrientes", "san juan", "san luis", "jujuy",
    "rio cuarto", "tandil", "santa fe", "formosa", "san miguel de tucuman", "arezzo", "itanagar", "arunachal"],
  AZ: ["baku", "ganja", "sumqayit"],
  CA: ["toronto", "vancouver", "montreal", "ottawa", "calgary", "edmonton", "winnipeg", "ontario canada", "quebec", "alberta",
    "british columbia", "halifax", "waterloo on", "kitchener", "mississauga", "saskatoon", "regina", "victoria bc", "cagliari"],
  CO: ["bogota", "medellin", "cali", "barranquilla", "cartagena", "bucaramanga", "pereira", "manizales", "cucuta", "ibague",
    "santa marta", "villavicencio", "pasto", "monteria", "neiva", "popayan", "tunja", "envigado", "itagui", "como"],
  CT: ["catania", "bronte", "acireale", "paterno", "chhattisgarh", "raipur", "bilaspur", "bhilai"],
  GA: ["goa", "panaji", "margao", "vasco da gama", "libreville"],
  ID: ["jakarta", "bandung", "surabaya", "yogyakarta", "jogja", "jogjakarta", "semarang", "medan", "bali", "denpasar", "malang",
    "bogor", "depok", "tangerang", "bekasi", "makassar", "palembang", "batam", "surakarta", "pekanbaru", "padang", "balikpapan",
    "samarinda", "pontianak", "manado", "lampung", "cirebon", "sidoarjo", "purwokerto"],
  IL: ["tel aviv", "jerusalem", "haifa", "herzliya", "ramat gan", "petah tikva", "beer sheva", "netanya", "rehovot", "raanana",
    "kfar saba", "holon", "rishon lezion", "ashdod", "modiin", "bnei brak", "givatayim", "hod hasharon", "yokneam"],
  IN: ["bangalore", "bengaluru", "mumbai", "bombay", "delhi", "new delhi", "hyderabad", "pune", "chennai", "kolkata", "calcutta",
    "noida", "gurgaon", "gurugram", "ahmedabad", "jaipur", "kochi", "cochin", "lucknow", "indore", "bhopal", "nagpur", "surat",
    "coimbatore", "vadodara", "baroda", "chandigarh", "mohali", "trivandrum", "thiruvananthapuram", "mysore", "mysuru",
    "mangalore", "mangaluru", "visakhapatnam", "vizag", "patna", "ranchi", "bhubaneswar", "guwahati", "dehradun", "ludhiana",
    "amritsar", "nashik", "aurangabad", "rajkot", "kanpur", "varanasi", "agra", "madurai", "vijayawada", "thane",
    "navi mumbai", "ghaziabad", "faridabad", "kota", "jodhpur", "udaipur", "raipur", "jabalpur", "gwalior", "allahabad",
    "prayagraj", "meerut", "jalandhar", "kozhikode", "calicut", "thrissur", "kollam", "manipal", "vellore", "warangal",
    "guntur", "tirupati", "hubli", "belgaum", "belagavi", "tiruchirappalli", "trichy", "pondicherry", "puducherry", "shimla",
    "jammu", "srinagar", "siliguri", "durgapur", "howrah", "kharagpur", "roorkee", "karnataka", "maharashtra", "telangana",
    "kerala", "tamil nadu", "uttar pradesh", "gujarat", "rajasthan", "punjab", "haryana", "bihar", "odisha", "west bengal",
    "assam", "madhya pradesh", "andhra pradesh", "jharkhand", "uttarakhand", "himachal", "tamilnadu", "blr", "hyd", "ncr",
    "dumka", "navsari", "jh", "gj", "mh", "ka", "ts", "tg", "up", "mp", "wb", "rj", "hr", "pb", "kl", "dl", "ap", "br", "cg", "hp", "jk"],
  KY: ["grand cayman", "george town", "cayman"],
  LA: ["los angeles", "hollywood", "santa monica", "pasadena", "burbank", "culver city", "venice beach", "long beach",
    "silver lake", "echo park", "koreatown", "dtla", "north hollywood", "studio city", "marina del rey", "playa vista",
    "beverly hills", "inglewood", "torrance", "sherman oaks", "encino", "van nuys", "westwood", "glendale", "el segundo",
    "ucla", "santa clarita", "malibu", "vientiane", "lagos"],
  MA: ["casablanca", "rabat", "marrakech", "marrakesh", "tangier", "tanger", "fes", "fez", "agadir", "meknes", "oujda", "kenitra", "malaga",
    "tetouan", "sao luis", "imperatriz", "maranhao", "timon"],
  MD: ["chisinau", "balti", "tiraspol"],
  ME: ["messina", "podgorica"],
  MI: ["milano", "monza", "sesto san giovanni", "legnano"],
  MN: ["ulaanbaatar", "ulan bator", "imphal", "manipur", "mantova", "mantua"],
  MO: ["odintsovo", "podolsk", "khimki", "balashikha", "lyubertsy", "mytishchi", "korolev", "krasnogorsk", "zelenograd", "dubna",
    "reutov", "dolgoprudny", "zhukovsky", "moscow oblast", "moskovskaya", "modena", "carpi"],
  MS: ["campo grande", "dourados", "tres lagoas", "nioaque", "pedro gomes", "coxim", "nova andradina", "aquidauana", "corumba",
    "ponta pora", "navirai", "sidrolandia", "maracaju", "chapadao do sul", "bonito", "mato grosso", "massa", "carrara"],
  NH: ["amsterdam", "haarlem", "alkmaar", "hilversum", "zaandam", "hoofddorp", "amstelveen"],
  FL: ["almere", "lelystad"],
  MT: ["cuiaba", "varzea grande", "rondonopolis", "sinop", "mato grosso", "lucas do rio verde", "sorriso", "tangara da serra",
    "primavera do leste", "barra do garcas", "caceres", "valletta", "sliema", "nadur", "birkirkara", "mosta", "qormi", "zabbar",
    "msida", "gzira", "swieqi", "gozo", "matera"],
  NC: ["noumea"],
  NE: ["niamey"],
  OR: ["oristano", "odisha", "orissa", "bhubaneswar", "cuttack"],
  PA: ["belem", "ananindeua", "santarem", "maraba", "castanhal", "parauapebas", "palermo"],
  RI: ["rieti"],
  SC: ["florianopolis", "blumenau", "joinville", "navegantes", "navegante", "sao jose", "chapeco", "criciuma", "itajai",
    "balneario camboriu", "camboriu", "jaragua do sul", "lages", "tubarao", "brusque", "palhoca", "videira", "porto uniao",
    "concordia", "rio do sul", "santa catarina"],
  SD: ["khartoum", "omdurman", "port sudan", "karachi", "sukkur", "larkana", "sindh"],
  TN: ["chennai", "madurai", "coimbatore", "trichy", "tiruchirappalli", "vellore", "tirunelveli", "erode", "tiruppur",
    "thanjavur", "kanchipuram", "tamil nadu", "tamilnadu", "hosur", "sousse", "sfax", "tunis", "monastir", "bizerte",
    "nabeul", "ariana", "trento", "rovereto"],
  UT: ["dehradun", "uttarakhand", "haridwar", "roorkee", "nainital", "rishikesh", "utrecht", "amersfoort", "nieuwegein", "zeist"],
  VA: ["gallarate", "varese", "busto arsizio", "saronno", "vatican"],
  VT: ["viterbo"],
  WA: ["perth", "fremantle", "joondalup", "mandurah", "bunbury", "western australia"],
};
const ELSEWHERE_RE = Object.fromEntries(Object.entries(ELSEWHERE).map(([ab, list]) => [ab, words(list)]));

// US towns that share a country's name, with their states: "Norway, ME" is Maine, "Brazil, MS" is not.
const TOWNS_LIKE_ABROAD = {
  norway: ["ME", "MI", "SC", "IA"], poland: ["OH", "ME", "NY"], denmark: ["SC", "WI", "ME"], sweden: ["ME"],
  china: ["ME", "TX"], egypt: ["AR", "TX"], russia: ["OH"], belgium: ["WI"], italy: ["TX"], brazil: ["IN"],
  turkey: ["NC", "TX"], "little canada": ["MN"],
};
// US towns spelled with letters the accent rule would otherwise turn away.
const ACCENTED_TOWNS = words(["lindstrom", "canon city", "espanola", "coeur d'alene"]);

// DE after a city is far more often Germany than Delaware, so only Delaware towns count.
const DELAWARE = words([
  "wilmington", "newark", "dover", "middletown", "smyrna", "milford", "seaford", "georgetown", "lewes", "rehoboth",
  "rehoboth beach", "bear", "hockessin", "claymont", "elsmere", "new castle", "newport", "camden", "harrington", "laurel",
  "selbyville", "millsboro", "delmar", "greenville", "pike creek", "glasgow", "townsend", "clayton", "felton", "milton",
  "bridgeville", "ocean view", "bethany beach", "dewey beach", "magnolia", "odessa", "delaware city", "talleyville",
  "north wilmington", "brandywine", "yorklyn", "montchanin", "frederica", "blades", "wyoming",
]);
// ID after a town is more often Indonesia than Idaho, so only Idaho towns count.
const IDAHO = words([
  "boise", "meridian", "nampa", "idaho falls", "if", "pocatello", "caldwell", "coeur d'alene", "coeur d alene", "cda",
  "twin falls", "post falls", "lewiston", "rexburg", "eagle", "kuna", "moscow", "ammon", "chubbuck", "hayden", "hayden lake",
  "mountain home", "blackfoot", "garden city", "jerome", "burley", "star", "sandpoint", "rathdrum", "hailey", "ketchum",
  "sun valley", "mccall", "rigby", "emmett", "payette", "weiser", "middleton", "driggs", "victor", "priest river",
  "bonners ferry", "salmon", "hansen", "fruitland", "preston", "rupert", "shelley", "iona", "st. anthony", "saint anthony",
  "kimberly", "filer", "buhl", "gooding", "grangeville", "orofino", "kellogg", "wallace", "soda springs", "montpelier",
  "ashton", "island park", "arco", "challis", "cascade", "donnelly", "homedale", "melba", "parma", "ucon", "american falls",
  "teton", "tetonia", "sugar city", "bellevue", "fairfield", "horseshoe bend", "idaho city", "riggins", "cottonwood",
  "kamiah", "genesee", "troy", "potlatch", "plummer", "worley", "st. maries", "saint maries", "spirit lake", "athol",
  "dalton gardens", "ponderay", "sagle", "clark fork", "hope", "boise state", "treasure valley", "magic valley",
]);
// Louisiana town names that also name places abroad.
const LA_CITY_ELSEWHERE = words(["jamaica", "manchester"]);

const NAME_RES = NAMES.map(([ab, name]) => [ab, name.length, new RegExp(`\\b${name.toLowerCase().replace(/ /g, "\\s+")}\\b`, "g")]);
const CODE_AT_END = /,\s*([A-Z]{2})\.?\s*(?:,?\s*(?:USA|U\.S\.A\.?|US|U\.S\.|United States(?: of America)?))?\s*$/;

// The state a location names and the rule that placed it, or null.
export function place(location) {
  let loc = (location ?? "").trim();
  if (!loc) return null;
  // Washington, D.C. is not a state; drop it and see what else the location says.
  loc = loc.replace(/washington,?\s*d\.?\s*c\.?|district of columbia/gi, " ").trim();
  if (!loc) return null;
  const f = fold(loc);
  const m = loc.match(CODE_AT_END);
  if (m && TOWNS_LIKE_ABROAD[fold(loc.slice(0, m.index)).trim()]?.includes(m[1])) return { state: m[1], rule: "code" };
  const saysUS = US_MARK.test(loc) || US_CAPS.test(loc);
  if (!saysUS && (COUNTRIES.test(f) || OTHER_SCRIPT.test(loc))) return null;

  if (m && AB.has(m[1])) {
    const ab = m[1];
    const city = fold(loc.slice(0, m.index));
    const accents = [...loc.slice(0, m.index)].filter((ch) => ACCENT.test(ch));
    const badAccent = !ACCENTED_TOWNS.test(city) && accents.some((ch) => !(SPANISH_STATES.has(ab) && SPANISH_ACCENT.test(ch)));
    const elsewhere = ELSEWHERE_RE[ab]?.test(city);
    const notListed = (ab === "DE" && !DELAWARE.test(city)) || (ab === "ID" && !IDAHO.test(city));
    if (!badAccent && !elsewhere && !notListed) return { state: ab, rule: "code" };
    return null;
  }

  // The state named last, the longer name winning a tie (West Virginia over Virginia).
  let best = null;
  for (const [ab, len, re] of NAME_RES) {
    re.lastIndex = 0;
    for (const hit of f.matchAll(re)) {
      const end = hit.index + hit[0].length;
      if (!best || end > best.end || (end === best.end && len > best.len)) best = { ab, end, len };
    }
  }
  if (best) return { state: best.ab, rule: "name" };

  if (laOnlyRe.test(loc) && !LA_CITY_ELSEWHERE.test(f) && !OTHER_SCRIPT.test(loc)) return { state: "LA", rule: "city" };
  return null;
}

export const stateOf = (location) => place(location)?.state ?? null;
