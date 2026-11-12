// Which US state a GitHub profile location names, if any. Shared by the collector (to skip
// people who place nowhere) and kept in step with the copy in build.mjs.
import { laOnlyRe } from "./parishes.mjs";

const NAMES = [
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
const NAME_RE = [...NAMES].sort((a, b) => b[1].length - a[1].length).map(([ab, name]) => [ab, new RegExp(`\\b${name.replace(/ /g, "\\s+")}\\b`, "i")]);
const FOREIGN = {
  CA: /\b(?:canada|toronto|vancouver|montr[eé]al|ottawa|calgary|edmonton|winnipeg|ontario|qu[eé]bec|alberta|british columbia|halifax|victoria,\s*bc)\b/i,
  IN: /\b(?:india|bangalore|bengaluru|mumbai|delhi|hyderabad|pune|chennai|kolkata|noida|gurgaon|gurugram|ahmedabad|jaipur|kochi|kerala|lucknow|indore|bhopal|nagpur|surat|coimbatore)\b/i,
  DE: /\b(?:germany|deutschland|berlin|munich|m[uü]nchen|hamburg|frankfurt|cologne|k[oö]ln|stuttgart|dresden|leipzig|d[uü]sseldorf|karlsruhe)\b/i,
  GA: /\b(?:tbilisi|gabon|libreville)\b/i, CO: /\b(?:colombia|bogot[aá]|medell[ií]n|\bcali\b|barranquilla)\b/i,
  MA: /\b(?:morocco|casablanca|rabat|marrakech|tangier)\b/i, PA: /\b(?:panam[aá]|pakistan)\b/i, AL: /\b(?:albania|tirana)\b/i,
  ME: /\b(?:montenegro|podgorica)\b/i, MD: /\b(?:moldova|chi[sș]in[aă]u)\b/i, NE: /\b(?:niger\b|niamey)\b/i, SC: /\b(?:seychelles)\b/i,
  SD: /\b(?:sudan|khartoum)\b/i, TN: /\b(?:tunisia|tunis\b)\b/i, MT: /\b(?:malta|valletta)\b/i, MN: /\b(?:mongolia|ulaanbaatar)\b/i,
  ID: /\b(?:indonesia|jakarta|bandung|surabaya|yogyakarta)\b/i, AR: /\b(?:argentina|buenos aires|c[oó]rdoba|rosario)\b/i,
  NC: /\b(?:new caledonia|noum[eé]a)\b/i, LA: /\b(?:laos|vientiane|los angeles)\b/i, VA: /\b(?:vatican)\b/i, AZ: /\b(?:azerbaijan|baku)\b/i,
  IL: /\b(?:israel|tel aviv)\b/i,
};

export function stateOf(location) {
  const loc = (location ?? "").trim();
  if (!loc) return null;
  if (/\b(tbilisi|batumi|kutaisi|rustavi|sakartvelo)\b/i.test(loc)) return null;
  if (/washington,?\s*d\.?\s*c\b|district of columbia/i.test(loc)) return null;
  if (/kansas city,?\s*(mo|missouri)\b/i.test(loc)) return "MO";
  for (const [ab, re] of NAME_RE) if (re.test(loc)) return ab;
  const m = loc.match(/,\s*([A-Z]{2})\.?\s*(?:,?\s*(?:USA|U\.S\.A\.?|US|U\.S\.|United States(?: of America)?))?\s*$/);
  if (m && AB.has(m[1]) && !FOREIGN[m[1]]?.test(loc)) return m[1];
  if (laOnlyRe.test(loc)) return "LA";
  return null;
}
