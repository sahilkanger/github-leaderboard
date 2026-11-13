// Where profile locations are placed. Found one placed wrong? Add it here with the right answer
// (null for "not in a US state"), then change src/states.mjs until `npm test` passes.
import assert from "node:assert/strict";
import { test } from "node:test";
import { place, stateOf } from "../src/states.mjs";

const CASES = [
  // Plain US locations.
  ["Jackson, MS", "MS"],
  ["Hattiesburg, MS, USA", "MS"],
  ["Birmingham, AL", "AL"],
  ["Charleston, SC", "SC"],
  ["Wilmington, DE", "DE"],
  ["Newark, DE, USA", "DE"],
  ["Nashville, TN", "TN"],
  ["St. Louis, MO", "MO"],
  ["Little Rock, AR", "AR"],
  ["Melbourne, AR", "AR"],
  ["Berlin, MD", "MD"],
  ["Atlanta, GA, United States", "GA"],
  ["Austin, Texas", "TX"],
  ["Seattle, WA", "WA"],
  ["Denver, CO", "CO"],
  ["San Francisco, CA", "CA"],
  ["San José, CA", "CA"],
  ["Indianapolis, IN", "IN"],
  ["Boise, ID", "ID"],
  ["Moscow, ID", "ID"],
  ["Coeur d'Alene, ID", "ID"],
  ["Idaho Falls, ID", "ID"],
  ["Sioux Falls, SD", "SD"],
  ["Bozeman, MT", "MT"],
  ["New Haven, CT", "CT"],
  ["Portland, ME", "ME"],
  ["Salt Lake City, UT", "UT"],
  ["Concord, NH", "NH"],
  ["Miami, FL", "FL"],
  ["Chicago, IL", "IL"],
  ["Panama City, FL", "FL"],
  ["Brazil, IN", "IN"],
  ["Malta, NY", "NY"],
  ["Remote (USA / Canada), Austin, TX", "TX"],
  // US towns that share a name with a country, or carry an accent.
  ["Norway, ME", "ME"],
  ["Poland, OH", "OH"],
  ["Little Canada, MN", "MN"],
  ["Lindström, MN", "MN"],
  ["Cañon City, CO", "CO"],

  // A code after a city name wins over a state named inside the city.
  ["Missouri City, TX", "TX"],
  ["Michigan City, IN", "IN"],
  ["Maryland Heights, MO", "MO"],
  ["Kansas City, MO", "MO"],
  ["Washington, PA", "PA"],
  // Otherwise the state named last, the longer name winning a tie.
  ["Kansas City, Missouri", "MO"],
  ["Washington Heights, New York", "NY"],
  ["Charleston, West Virginia", "WV"],
  ["Virginia Beach, Virginia", "VA"],
  ["Arkansas City, Kansas", "KS"],

  // Louisiana towns without the state.
  ["New Orleans", "LA"],
  ["Shreveport, La", "LA"],
  ["Delhi, LA", "LA"],
  ["East Carroll Parish, Louisiana", "LA"],
  ["New Orleans, LA, USA, Earth, Solar System, Local Group", "LA"],

  // Brazil: Mato Grosso do Sul (MS), Santa Catarina (SC), Alagoas (AL).
  ["Campo Grande, MS", null],
  ["Campo Grande - MS", null],
  ["Nova Andradina, MS.", null],
  ["Fátima do Sul, MS", null],
  ["Corumbá, MS", null],
  ["BRASIL, MS", null],
  ["Brazil - Campo Grande, MS", null],
  ["Brazil, MS", null],
  ["Brazil, SC", null],
  ["Tunisia , TN", null],
  ["Cuiabá, MT", null],
  ["Buenos Aires, AR", null],
  ["Florianópolis, SC", null],
  ["Florianopolis, SC", null],
  ["Blumenau, SC", null],
  ["Brasil, São José, SC.", null],
  ["Maceió, AL", null],
  // Germany (DE), India (IN, TN), Tunisia (TN), Argentina (AR), Moscow Oblast and Modena (MO), Varese (VA).
  ["Ingolstadt, DE", null],
  ["Tübingen, DE", null],
  ["Augsburg, DE", null],
  ["Bangalore, IN", null],
  ["Chennai,TN", null],
  ["Sousse,Tunisie, TN", null],
  ["Mendoza, AR", null],
  ["CABA, AR", null],
  ["Odintsovo, MO", null],
  ["Gallarate, VA", null],
  // Western Australia, Colombia, Indonesia, Israel, Canada.
  ["Perth, WA", null],
  ["Bogotá, CO", null],
  ["Jakarta, ID", null],
  ["Tel Aviv, IL", null],
  ["Toronto, CA", null],
  ["Cikarang, ID", null],
  ["Purworejo, Jawa Tengah, ID", null],
  ["BDG, ID", null],
  ["BLR, IN", null],
  ["Dumka, JH, IN", null],
  ["Lucas do Rio Verde, MT", null],
  ["Nadur, MT", null],
  ["Karachi, SD", null],
  ["Bronte, CT", null],
  ["Amman, Jordan, ME", null],
  ["Amsterdam, NH", null],
  ["Utrecht, UT", null],
  // Los Angeles, Laos, Jamaica, and other countries named outright.
  ["Santa Monica, LA", null],
  ["Mandeville, Jamaica", null],
  ["Gurugram, Harahan, India", null],
  ["Prairieville, Indonesia", null],
  ["Tbilisi, Georgia", null],
  ["Florida, Uruguay", null],
  ["┐( ´ д ` )┌　laplace要完蛋了", null],
  // Not a state.
  ["Washington, DC", null],
  ["Washington D.C.", null],
  ["Remote", null],
  ["", null],
];

for (const [location, want] of CASES) {
  test(`${JSON.stringify(location)} is ${want ?? "not placed"}`, () => {
    assert.equal(stateOf(location), want);
  });
}

test("place says which rule placed a location", () => {
  assert.deepEqual(place("Jackson, MS"), { state: "MS", rule: "code" });
  assert.deepEqual(place("Austin, Texas"), { state: "TX", rule: "name" });
  assert.deepEqual(place("New Orleans"), { state: "LA", rule: "city" });
});
