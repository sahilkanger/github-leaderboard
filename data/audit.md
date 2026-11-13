# Placement audit

2026-11-13. 31,438 people placed in a state, 2,946 not (their location names no state, or names somewhere else). Rules: [src/states.mjs](../src/states.mjs). Cases: [test/states.test.mjs](../test/states.test.mjs).

## By state

| State | Placed | By "City, ST" | By state name | By Louisiana town | Contributions looked up |
|---|---:|---:|---:|---:|---:|
| Alabama | 546 | 105 | 441 |  | 545 |
| Alaska | 566 | 160 | 406 |  | 566 |
| Arizona | 684 | 179 | 505 |  | 338 |
| Arkansas | 587 | 151 | 436 |  | 81 |
| California | 769 | 214 | 555 |  | 79 |
| Colorado | 711 | 218 | 493 |  | 81 |
| Connecticut | 578 | 140 | 438 |  | 80 |
| Delaware | 413 | 9 | 404 |  | 80 |
| Florida | 702 | 165 | 537 |  | 80 |
| Georgia | 488 | 171 | 317 |  | 80 |
| Hawaii | 590 | 163 | 427 |  | 80 |
| Idaho | 580 | 122 | 458 |  | 80 |
| Illinois | 678 | 185 | 493 |  | 80 |
| Indiana | 515 | 42 | 473 |  | 80 |
| Iowa | 605 | 207 | 398 |  | 80 |
| Kansas | 442 | 179 | 263 |  | 80 |
| Kentucky | 605 | 172 | 433 |  | 80 |
| Louisiana | 1898 | 750 | 661 | 487 | 500 |
| Maine | 556 | 128 | 428 |  | 80 |
| Maryland | 662 | 169 | 493 |  | 81 |
| Massachusetts | 644 | 169 | 475 |  | 80 |
| Michigan | 690 | 190 | 500 |  | 81 |
| Minnesota | 672 | 183 | 489 |  | 80 |
| Mississippi | 444 | 43 | 401 |  | 80 |
| Missouri | 753 | 285 | 468 |  | 80 |
| Montana | 490 | 84 | 406 |  | 80 |
| Nebraska | 594 | 168 | 426 |  | 80 |
| Nevada | 594 | 188 | 406 |  | 81 |
| New Hampshire | 572 | 143 | 429 |  | 81 |
| New Jersey | 664 | 135 | 529 |  | 81 |
| New Mexico | 605 | 174 | 431 |  | 80 |
| New York | 684 | 288 | 396 |  | 80 |
| North Carolina | 670 | 178 | 492 |  | 80 |
| North Dakota | 534 | 168 | 366 |  | 80 |
| Ohio | 715 | 196 | 519 |  | 82 |
| Oklahoma | 584 | 227 | 357 |  | 80 |
| Oregon | 678 | 175 | 503 |  | 80 |
| Pennsylvania | 654 | 183 | 471 |  | 80 |
| Rhode Island | 578 | 169 | 409 |  | 80 |
| South Carolina | 523 | 88 | 435 |  | 80 |
| South Dakota | 529 | 147 | 382 |  | 80 |
| Tennessee | 619 | 171 | 448 |  | 80 |
| Texas | 727 | 177 | 550 |  | 80 |
| Utah | 700 | 181 | 519 |  | 80 |
| Vermont | 579 | 168 | 411 |  | 80 |
| Virginia | 648 | 179 | 469 |  | 82 |
| Washington | 394 | 177 | 217 |  | 80 |
| West Virginia | 551 | 164 | 387 |  | 80 |
| Wisconsin | 625 | 174 | 451 |  | 80 |
| Wyoming | 549 | 150 | 399 |  | 80 |

## Turned away

Locations ending in a US code that a guard rejected, most common first. A US town here is a mistake: add it to the tests and fix the rule.

- **AL**: Maceió, AL (5)
- **AR**: Buenos Aires, AR (11) · CABA, AR · Córdoba, AR · Formosa, AR · Mendoza, AR · Posadas, AR · Rosario, AR · Santa Fe, AR
- **AZ**: Baku, AZ
- **CA**: Edmonton, Alberta, CA · Ottawa,ON,CA
- **CO**: Jeddah, Saudi Arabia and Boulder, CO
- **CT**: Bronte, CT
- **DE**: Berlin, DE (8) · Hamburg, DE (2) · Ingolstadt, DE (2) · Augsburg, DE · Biberach, DE · Naarm(Melbourne) AU/Tübingen, DE · Spremberg, DE · Tübingen, DE
- **ID**: Jakarta, ID (13) · Yogyakarta, ID (7) · Bandung, ID (5) · Surabaya, ID (3) · Malang, ID (2) · Abu Dhabi, UAE | Wien, AT | Bandung, ID · Batu City, ID · BDG, ID · Bulukumba, ID · Central Jakarta, ID · Cikarang, ID · Demak, Central Java, ID · Jakarta, ID. · Karawang, ID · Klaten - Yogyakarta, ID · Kota Jakarta Pusat, ID · Kota Surakarta, ID · Malang , ID · Nomad, ID · Pekanbaru, ID · Ponorogo , ID · Pontianak, ID · Purworejo, Jawa Tengah, ID · Remote, ID · Special Region of Yogyakarta, ID · TBN, ID · Tulungagung, ID
- **IN**: Bengaluru, IN (6) · Bangalore, IN (3) · BLR, IN · Delhi, IN · Dumka, JH, IN · Hyderabad,IN · Navsari, GJ,IN · New Mumbai, IN. · Noida, IN · Pune, IN · Tamilnadu, IN
- **LA**: Madrid, Spain / Ruston, LA
- **ME**: Amman, Jordan, ME
- **MO**: Odintsovo, MO
- **MS**: Campo Grande, MS (14) · Aquidauana, MS · Brasil - Nova Andradina, MS · BRASIL, MS · Brazil - Campo Grande, MS · Brazil, MS · Corumbá, MS · Coxim, MS · Fátima do Sul, MS · Nioaque, MS. · Nova Andradina, MS. · Pedro Gomes, MS
- **MT**: Cuiabá, MT (6) · Cuiaba, MT · Cuiabá,MT · Lucas do Rio Verde, MT · Nadur, MT · Rondonópolis, MT · Sinop, MT
- **NJ**: China, NJ
- **PA**: Belém, PA
- **SC**: Blumenau, SC (2) · Brazil, SC (2) · Florianópolis, SC (2) · Brasil, São José, SC. · Florianopolis, SC · Joinville, SC · Navegante, SC · Porto União, SC · Videira, SC
- **SD**: Karachi , SD
- **TN**: Chennai,TN · Sousse,Tunisie, TN · Tunisia , TN
- **VA**: Gallarate, VA
- **WA**: Perth, WA (2)
- **WY**: Calama, Chile · Cheyenne, WY

## Accepted by a shared code

Every city placed by a code that other places also use. A foreign city here is a mistake: add it to the tests and to `ELSEWHERE` in the rules.

- **AL** (24 cities): Birmingham (45) · Huntsville (25) · Mobile (6) · Tuscaloosa (5) · Auburn (3) · Cullman (2) · Florence (2) · Alabaster · Alexander City · Centreville · Fairhope · Foley · Gadsden · Geneva · Gulf Shores · Guntersville · Hazel Green · Hunstville · Huntsville / Madison · Madison · Mentone · Montgomery · Pelham · Pickensville
- **AR** (28 cities): Fayetteville (32) · Little Rock (30) · Bentonville (29) · Conway (13) · Jonesboro (7) · Rogers (7) · North Little Rock (4) · Searcy (4) · Springdale (3) · Cabot (2) · Hot Springs (2) · Russellville (2) · Alma · Ashdown · Batesville · Fayettville · Fort Smith · Gentry · Greenbrier · Harrison · Lowell · Melbourne · Morrilton · Mountainburg · Paragould · Pine Bluff · Siloam Springs · United States
- **AZ** (22 cities): Phoenix (89) · Tucson (25) · Tempe (14) · Mesa (13) · Scottsdale (9) · Chandler (6) · Flagstaff (4) · Gilbert (3) · Sedona (2) · Surprise (2) · Apache Junction · Buckeye · Minneapolis, MN and Phoenix · New York, NY | Phoenix · Nutrioso · Payson / Globe / Holbrook · Phoenix Area · Pinetop · San Tan Valley · Sierra Vista · The Underestimated City · Yuma
- **CA** (66 cities): San Francisco (54) · Los Angeles (28) · Nevada City (18) · San Diego (16) · Berkeley (8) · La Jolla (4) · Palo Alto (4) · San Francisco Bay Area (4) · San Jose (4) · Sunnyvale (4) · Oakland (3) · SD (3) · Bay Area (2) · Fremont (2) · Irvine (2) · La Crescenta (2) · Livermore (2) · Mountain View (2) · Orange (2) · Orange County (2) · San Mateo (2) · Santa Monica (2) · Alameda · Arvin · Belmont · Beverly Hills · Camarillo · Chico · Colton · Cupertino · Davis · Glendale · Hayward · Isla Vista · La Canada Flintridge · La Jolla, San Diego · La Mirada · Long Beach · Millbrae · Milpitas · Monterey · Mountain view · New York, NY & Temecula · Newport Beach · Palermo · Palmdale · Redlands · Redondo Beach · Richmond · San Diego County · San Gabriel · Santa Barbara · Santa Cruz · SantaClara · SF · Sherman Oaks · Silicon Valley · Simi Valley · Somewhere Foundry · Soquel · South Pasadena · Union City · USA · Venice · Walnut Creek · Washington D.C./ Modesto
- **CO** (28 cities): Denver (115) · Colorado Springs (34) · Boulder (24) · Fort Collins (6) · Aurora (5) · Longmont (5) · Lafayette (3) · Broomfield (2) · Golden (2) · Littleton (2) · Louisville (2) · Peyton (2) · Arvada · Castle Rock · Crested Butte · Denver Metro · Denver Metropolitan Area · Durango · Erie · Fruita · Grand Junction · Loma · Lone Tree · Loveland · Montrose · Palisade · Portland, Oregon, Seattle, WA and Denver · Sheridan, WY / Denver
- **CT** (64 cities): New Haven (30) · Stamford (14) · Hartford (9) · Fairfield (4) · Bridgeport (3) · Greenwich (3) · Groton (3) · Guilford (3) · Storrs (3) · Bristol (2) · Danbury (2) · Farmington (2) · Glastonbury (2) · Monroe (2) · Newtown (2) · Ridgefield (2) · Simsbury (2) · Trumbull (2) · Wallingford (2) · West Hartford (2) · Wilton (2) · Woodbridge (2) · Ansonia · Avon · Barkhamsted · Bolton · Burlington · Canterbury · Canton · Darien · Enfield · Farmington Valley · GNU Haven · Hamden · Hebron · Jewett City · Marlborough · Meriden · Middletown · Milford · Mystic, CT & Middletown · Naugatuck · New Britain · New Canaan · New haven · New London · New York| Fairfield County · Norwalk · Oakdale · Old Saybrook · Stafford · Thompson · Tolland · Torrington · Uncasville · Waterbury · Weatogue · West Haven · West Suffield · Westport · Windham · Woodbury · Woodstock · Yale University, New Haven
- **DE** (5 cities): Wilmington (4) · Camden Wyoming (2) · Delaware City · Dover · Newark
- **FL** (52 cities): Miami (35) · Orlando (24) · Tampa (16) · Jacksonville (11) · Gainesville (6) · Sarasota (6) · Tallahassee (5) · Fort Lauderdale (3) · Hollywood (3) · Kissimmee (3) · Miami Beach (3) · St. Petersburg (3) · Boca Raton (2) · Ocala (2) · Palm Beach Gardens (2) · Pensacola (2) · Saint Petersburg (2) · St Petersburg (2) · Winter Park (2) · Altamonte Springs · Beverly Hills · Broward County · Coral Springs · Dania Beach · Daytona beach · Deland · Delray Beach · Ft Lauderdale · Ft. Lauderdale · Green Cove Springs · Jakconsville · Jupiter · Largo · Live Oak · Margate · Melbourne · Oviedo · Perry · Plant City · Ponte Vedra Beach · Saint Augustine · South Florida · South Miami · St Augustine · St. Augustine · St. Pete · Tampa Bay Area · Temple Terrace · Vero Beach · West Palm Beach · Windermere · Winter Garden
- **GA** (29 cities): Atlanta (133) · Alpharetta (3) · Marietta (3) · Savannah (3) · Suwanee (3) · Athens (2) · Woodstock (2) · Ball Ground · Brunswick · Conyers · Cornelia · Cumming · Dallas · Dalton · Decatur · Douglasville · Duluth · Dunwoody · Flowery Branch · Gainesville · Kathleen · Lawrenceville · Lilburn · Macon · Roswell · Saint Marys · Thomasville · Valdosta · Villa Rica
- **ID** (24 cities): Boise (61) · Idaho Falls (21) · Moscow (5) · Rexburg (5) · Post Falls (4) · Meridian (3) · Caldwell (2) · Coeur d'Alene (2) · Pocatello (2) · Rigby (2) · Star (2) · CDA · Hailey · Hansen · Hayden · IF · Lewiston · McCall · Nampa · Payette · Priest River · Sandpoint · Seattle, WA || Sandpoint · Twin Falls
- **IL** (27 cities): Chicago (152) · Champaign (4) · chicago (2) · Evanston (2) · Naperville (2) · Oak Park (2) · Barrington · Belleville · Crystal Lake · De Kalb · Edwardsville · Fairview Heights · Glen Ellyn · Gurnee · Hainesville · Ingleside · Lisle · Marion · Park Forest · Plainfiled · Putnam · Round Lake · Saint Charles · Schaumburg · Shorewood · Springfield · Urbana
- **IN** (18 cities): Indianapolis (18) · Bloomington (4) · Fort Wayne (4) · West Lafayette (2) · Avon · Carmel · Corydon · Evansville · Hanover · Indianpolis · Jeffersonville · La Porte · Marion · New Alsace · Valparaiso · West lafayette · Westfield · Woodburn
- **KY** (44 cities): Louisville (83) · Lexington (36) · Covington (3) · Owensboro (3) · Richmond (3) · Berea (2) · Frankfort (2) · London (2) · Paducah (2) · Versailles (2) · Alexandria · Bowling Green · Brandenburg · Burlington · Clarkson · Crescent Springs · Danville · Eubank · Flornece · Ft Mitchell · Georgetown · Glasgow · Grayson · Harrodsburg · Henderson · Jabez · Jamestown · La Grange · Lawrenceburg · Lexinton · Louisville, Kentucky · Louisville/J-Town · Paris · Pewee Valley · Russellville · Shelbyville · Somerset · Stamping Ground · Stanford · University of Kentucky, Lexington · Villa Hills · West Liberty · Williamsburg · Winchester
- **LA** (50 cities): New Orleans (141) · Baton Rouge (134) · Shreveport (106) · Lake Charles (57) · Ruston (52) · Mandeville (43) · Bossier City (34) · Metairie (27) · Slidell (25) · Denham Springs (13) · Houma (12) · West Monroe (11) · New Iberia (9) · Natchitoches (7) · Thibodaux (7) · Breaux Bridge (6) · Harahan (6) · Kenner (6) · Marrero (5) · Ponchatoula (5) · Prairieville (5) · Broussard (4) · Bogalusa (3) · Lafayette (3) · Chalmette (2) · DeRidder (2) · Opelousas (2) · 41117 s range rd Ponchatoula · 4172 Willow Oaks Lane,Lake Charles · Baton rouge · Baton Rouge / New Orleans · BR · California · Chicago, IL. && New Orleans · current: Peachtree Corners, GA home: Metairie · DENHAM SPRINGS · Deridder · Greater New Orleans Area · Hammond · Laplace · LaPlace · Monroe · New orleans · New-Orleans · Pine grove mills, PA Arcadia, LA and Ruston · Port Allen · United States, Opelousas · USA · Venice · Vicksburg, MS/Ruston
- **MA** (43 cities): Boston (90) · Cambridge (28) · Somerville (6) · Worcester (4) · Beverly (2) · Westford (2) · Andover · Ayer · Barnstable · Belmont · Berkshire County · Boxborough · Braintree · Brockton · Cape Cod · Chelmsford · Chestnut Hill · Concord · Easthampton · Framingham · Hopkinton · Lincoln · Lowell · Marlborough · Massachusetts · Medfield · Medford · Melrose · Methuen · Natick · North Reading · Pembroke · Portsmouth. NH or Boston · Randolph · Roxbury · Salem · Search Results 77 Massachusetts Ave, Cambridge · Seattle, WA & Boston · Springfield · Sturbridge · USA, Boston · Williamstown · Woods Hole
- **MD** (41 cities): Baltimore (68) · Rockville (10) · Silver Spring (9) · Bethesda (8) · Annapolis (7) · Frederick (7) · College Park (6) · Gaithersburg (6) · Laurel (6) · Columbia (3) · Ellicott City (3) · Olney (3) · Chevy Chase (2) · Crofton (2) · Greenbelt (2) · Hyattsville (2) · Aberdeen · Accokeek · Bel AIr · Berlin · Catonsville · Chester · Clear Spring · COLUMBIA · Dundalk · Eastern Shore · Elkridge · Germantown · Hagerstown · Linthicum · Montgomery County · North Potomac · Riverdale · Salisbury · Severna Park · Takoma Park · USA · Washington, DC & Baltimore · Westminster · White Plains · Willards
- **ME** (43 cities): Portland (62) · Bangor (4) · Bar Harbor (4) · Fryeburg (3) · Kennebunk (3) · Lewiston (3) · South Portland (3) · Wells (3) · Belfast (2) · Brunswick (2) · Eliot (2) · Gorham (2) · Orono (2) · Saco (2) · Waterville (2) · Yarmouth (2) · Auburn · Bath · Biddeford · Brewer · Brownville · Castine · Damariscotta · Durham · Etna · Farmingdale · Farmington · Freeport · Greenbush · Holden · Kittery · North Yarmouth · Norway · Paradise · Perry · Rockport · Rumford · St. Albans · Surry · USA - Southwest Harbor · Waterford · Westbrook · Windham
- **MI** (59 cities): Ann Arbor (38) · Detroit (37) · Grand Rapids (34) · Wyoming (10) · Lansing (5) · Kalamazoo (4) · Canton (3) · Clio (2) · Dearborn Heights (2) · East Lansing (2) · Flint (2) · Holland (2) · Muskegon (2) · Royal Oak (2) · Ada · Adrian · Allen Park · Alma · Anchorage, AK and Grand Marais · Auburn Hills · Chelsea · Chesterfield · Clarksville · Dearborn · Denver, CO | Detroit · East Grand Rapids · Farmington · Farmington Hills · Ferndale · Grand Blanc · Hancock · Harbor Springs · Hudsonville · Interlochen · Jackson · Macomb · Marquette · Mason · Metro Detroit · Michigan State University · Midland · Milford · Mount Pleasant · MP · near Detroit · Northwest Arkansas / Ann Arbor · Norton Shores · Novi · Port Huron · Riverview · Saint Joseph · Sand Lake · St Clair Shores · Traverse City · Wayne · Westland · Whitehall · Wyandotte · Ypsilanti
- **MN** (32 cities): Minneapolis (121) · Saint Paul (13) · St. Paul (6) · Twin Cities (5) · Bloomington (3) · St Paul (3) · Wyoming (3) · Duluth (2) · Moorhead (2) · Stillwater (2) · Winona (2) · Blue Earth · Burnsville · Cologne · Coon Rapids · Eagan · Eden Prairie · Edina · Faribault · Greater Minneapolis-St. Paul · Harris · Hastings · Lindström · Little Canada · minneapolis · Minneapolis Area · Minneapolis-St. Paul · Pig's Eye · Rochester · Saint Louis Park · Savage · Shakopee
- **MO** (32 cities): Kansas City (156) · St. Louis (54) · Saint Louis (14) · Columbia (12) · St Louis (11) · Springfield (8) · O'Fallon (3) · Chesterfield (2) · Lake Saint Louis (2) · Ash Grove · Blue Springs · Byrnes Mill · Cape Girardeau · Denver, CO or Kansas City · Fenton · Hillsboro · Independence · Jefferson City · Joplin · Kansas city · Lamar · Liberty · Maplewood, St. Louis · Moberly · Parkville · Rolla · Saint Joseph · St, Louis · St.Louis · STL · United States, Kansas City · Wentzville
- **MS** (26 cities): Hattiesburg (7) · Jackson (7) · Starkville (4) · McComb (2) · Mississippi State (2) · 105 Ross Blvd, Hattiesburg · Biloxi · Brookhaven · Byram · Corinth · Decatur · Gulfport · Hernando · Horn Lake · Long Beach · Madison · Moss Point · Olive Branch · Oxford · Pattison · Pearl · Picayune · San Diego, CA && Brookhaven · Southaven · Tupelo · Vicksburg
- **MT** (17 cities): Missoula (27) · Bozeman (26) · Helena (6) · Billings (5) · Kalispell (5) · Whitefish (3) · Eureka (2) · Bigfork · Flathead Valley · Great Falls · Hot Springs · Montana State University, Bozeman · Philipsburg · Polson · Remote - Missoula · Three Forks · White Sulphur Springs
- **NC** (38 cities): Raleigh (62) · Charlotte (38) · Durham (19) · Asheville (9) · Chapel Hill (7) · Cary (5) · Carrboro (3) · Clayton (2) · Concord (2) · Greensboro (2) · Research Triangle Park (2) · Apex · Camp Lejeune · Cornelius · Fayetteville · Garner · Greensboro/Winston-Salem · Greenville · Kannapolis · Kings Mountain · Marion · Morrisville · Mt. Airy · Mt. Gilead · Nashville · New Orleans, LA | Research Triangle Park · Outer Banks · Raleigh-Durham · Raleigh/Durham · Rolesville · Smithfield · Taylorsville · Waxhaw · Waynesville · Wilimington · Wilmington · Winston Salem · Winston-Salem
- **NE** (14 cities): Omaha (98) · Lincoln (52) · Bellevue (4) · Hastings (2) · Kearney (2) · Papillion (2) · Bennington · Columbus · Crete · Elkhorn · Fremont · Hickman · Remote · Scottsbluff
- **NH** (55 cities): Portsmouth (17) · Hanover (15) · Manchester (11) · Nashua (11) · Dover (10) · Durham (7) · Concord (6) · Merrimack (4) · Salem (4) · Rochester (3) · Amherst (2) · Auburn (2) · Bedford (2) · Derry (2) · Hudson (2) · Laconia (2) · Lebanon (2) · North Conway (2) · Plymouth (2) · Wilton (2) · Alexandria · Boston, MA && Thornton · Bow · Brookline · Connecticut · Dublin · Eaton · Effingham · Exeter · Fitzwilliam · Hampstead · Hillsborough County · Jackson · Keene · Lee · Littleton · Londonderry · Lyme · Madbury · Meredith · New Boston · New Hampshire · New Hampton · New Haven · New York, NY / Amherst · North Hampton · Peterborough · Pittsburg · Rindge · Rumney · Salisbury · Seacoast · Seattle · Sharon · Somersworth
- **OR** (22 cities): Portland (140) · Bend (8) · Eugene (5) · Beaverton (4) · Ashland · Corvallis · Happy Valley · Hillsboro · Hood River · La Grande · Lake Selmac · Milwaukie · Oak Grove · Oregon City · PDX Area · PORTLAND · Salem · Sandy · Sherwood · Troutdale · Tualatin · Tulsa, OK / Bend
- **PA** (43 cities): Philadelphia (88) · Pittsburgh (44) · Lancaster (5) · Erie (2) · Harrisburg (2) · Malvern (2) · Pennsylvania (2) · Scranton (2) · West Chester (2) · (currently) Pittsburgh · Akron · Allentown · Bloomsburg · Bucks County · Center Valley · Chambersburg · Conshohocken · Cresson · Downingtown · Doylestown · Glenside · Greater Philadelphia region · Hermitage · Hershey · Indiana · King of Prussia · Landenberg · Lansdale · LeRoy · Lewisburg · Limerick · Morrisville · Newtown · Palmyra · Pennsylvania State University, University Park · Phoenixville · PIttsburgh · Pottstown · State College · Warminster · Weatherly · Wilkes-Barre · York
- **RI** (25 cities): Providence (120) · Newport (7) · Pawtucket (7) · Kingston (4) · Warwick (4) · North Providence (3) · Cranston (2) · Johnston (2) · Lincoln (2) · Portsmouth (2) · USA (2) · Barrington · Charlestown · East Greenwich · Hope · Jamestown · Little Compton · Narragansett · Newport County · Rumford · South Kingston · South Kingstown · Tiverton · Wakefield · Woonsocket
- **SC** (23 cities): Greenville (25) · Charleston (21) · Columbia (13) · Easley (3) · Myrtle Beach (3) · Summerville (3) · Florence (2) · Fort Mill (2) · North Augusta (2) · Aiken · Beaufort · Bishopville · Bluffton · Clemson · CSRA · Graniteville · Hardeeville · Hilton Head Island · Irmo · Lexington · Rock Hill · South Carolina · Starr
- **SD** (21 cities): Sioux Falls (70) · Rapid City (25) · Vermillion (16) · Madison (8) · Brookings (5) · Spearfish (4) · Aberdeen (3) · Pierre (2) · Sturgis (2) · Baltic · Box Elder · Centerville · Eagle Butte · Faulkton · Kimball · Leola · Renner · Tea · Watertown · Wessington · Yankton
- **TN** (32 cities): Nashville (83) · Knoxville (20) · Chattanooga (17) · Memphis (13) · Clarksville (3) · Franklin (3) · Oak Ridge (3) · Cookeville (2) · Johnson City (2) · Murfreesboro (2) · Spring Hill (2) · Charleston · Cleveland · Collierville · Dallas, TX/Chattanooga · East Nashville · Farragut · Greater Nashville Area · Greeneville · Hartsville · Jonesborough · Mount Juliet · Mt. Juliet · Oakland · Old Hickory · Ooltewah · Parsons · Portland · South Fulton · Springfield · White House · Winchester
- **UT** (38 cities): Salt Lake City (73) · Lehi (24) · Provo (14) · SLC (6) · Park City (5) · Draper (4) · Ogden (4) · Orem (4) · Sandy (4) · American Fork (3) · Logan (3) · South Jordan (3) · St George (3) · Bountiful (2) · Eagle Mountain (2) · Highland (2) · Riverton (2) · Saratoga Springs (2) · St. George (2) · Bluffdale · Brigham City · Cedar City · Clearfield · Clinton · Cottonwood Heights · Fountain Green · Hooper · Layton · Lindon · Los Angeles, CA / Lehi · Mapleton · Midvale · Payson · Roy · Salt Lake Valley · Silicon Slopes · Springville · West Jordan
- **VA** (51 cities): Richmond (24) · Virginia Beach (16) · Alexandria (14) · Arlington (13) · Charlottesville (12) · Fairfax (11) · Reston (10) · Ashburn (7) · Norfolk (6) · Blacksburg (4) · Chesapeake (4) · Leesburg (4) · Roanoke (4) · Sterling (4) · Herndon (3) · McLean (3) · Centreville (2) · Chantilly (2) · Fredericksburg (2) · South Riding (2) · Springfield (2) · alexandria · Annandale · Appomattox · Culpeper · Fairfax Station · Falls Church · Farmville · Glen Allen · Greater DC Area/Herndon · Hallwood · Hampton · Harrisonburg · King Geogre · Linden · Loudoun · Lynchburg · Manassas · Mechanicsville · New Baltimore · Petersburg · Portsmouth · Purcellville · Salem · Sperryville · Stafford · Weyers Cave · Winchester · Woodbridge · Woodstock · Wytheville
- **VT** (57 cities): Burlington (77) · Middlebury (6) · Montpelier (6) · Shelburne (6) · Brattleboro (5) · Essex (4) · Winooski (4) · Williston (3) · Bennington (2) · Essex Junction (2) · Hartland (2) · Hinesburg (2) · North Bennington (2) · Rutland (2) · South Burlington (2) · Waitsfield (2) · Arlington · Ascutney · Bakersfield · Barnard · Barre · Bridgewater · Brownington · Charlotte · Colchester · East Burke · Fairfax · Greater Burlington Area · Groton · Hardwick · Hartford · Huntington · Jonesville · Leicester · Lowell · Lyndonville · Marlboro · North Hero · Norwich · Panton · Randolph · Richmond · Saint Albans · Saint George · Shedlon · St Johnsbury · Swanton · Thetford Center · Underhill · Upper Valley · Vershire · Wardsboro · Waterbury · Westfield · Weybridge · White River Junction · Windsor
- **WA** (29 cities): Seattle (126) · Redmond (11) · Bellevue (5) · Bellingham (4) · Tacoma (3) · Bothell (2) · Kirkland (2) · Olympia (2) · Vancouver (2) · Bonney Lake · Decatur Island · Edmonds · Enumclaw · Everett · Gig Harbor · Glendale,AZ/Edmonds · Issaquah · Kenmore · Lake Stevens · Pasco · redmond · Richland · Ridgefield · Seattle-Area · Spokane · Sultan · Wenatchee · Whidbey Island · White Salmon
