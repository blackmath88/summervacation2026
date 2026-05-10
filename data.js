window.vacationData = {
  preferences: {
    beach: { label: "Water", icon: "water", description: "Sea, lake, sand, swimming or easy water days.", weight: 3 },
    climbing: { label: "Climbing", icon: "terrain", description: "Rock, boulders, via ferrata, mountain access.", weight: 3 },
    urbanity: { label: "Urban Life", icon: "location_city", description: "Cafes, local streets, culture and shops.", weight: 2 },
    weather: { label: "Weather", icon: "wb_sunny", description: "Reliable July warmth and usable outdoor days.", weight: 3 },
    familyEase: { label: "Family Ease", icon: "family_restroom", description: "Low-friction logistics and everyday flexibility.", weight: 3 },
    shortTravel: { label: "Travel Ease", icon: "directions_car", description: "Reasonable travel effort from Basel.", weight: 2 },
    special: { label: "Special Feeling", icon: "star", description: "Memorable, beautiful, emotionally exciting.", weight: 3 },
    calm: { label: "Calm", icon: "spa", description: "Relaxed rhythm, gentle pace, fewer hard edges.", weight: 2 }
  },
  poiCategories: {
    beach:            { label: "Beaches",            color: "#0ea5e9", icon: "beach_access" },
    coffee:           { label: "Coffee",             color: "#92400e", icon: "local_cafe" },
    fleamarket:       { label: "Flea markets",       color: "#a855f7", icon: "store" },
    climbing_outdoor: { label: "Climbing (outdoor)", color: "#dc2626", icon: "terrain" },
    climbing_indoor:  { label: "Climbing gyms",      color: "#f97316", icon: "fitness_center" },
    museum:           { label: "Museums",            color: "#0f766e", icon: "museum" }
  },
  summaries: [
    { icon: "emoji_events", title: "1. Costa Blanca", text: "Current emotional leader: scenery, weather, beach, Airbnb fantasy, climbing and atmosphere overlap strongly." },
    { icon: "surfing", title: "2. San Sebastian", text: "Strong shared lifestyle candidate: urbanity, beach, cafes, atmosphere and walkable daily life." },
    { icon: "train", title: "3. Leigh-on-Sea", text: "Unexpectedly strong because the Haarlem logic, London access and daily-life imagination are easy to picture." },
    { icon: "landscape", title: "4. Dolomites", text: "Strong Achim identity fit, but weaker shared summer-beach identity." }
  ],
  destinations: [
    {
      id: "costa",
      title: "Costa Blanca North",
      category: "Achim Track",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=80",
      vibe: "Mediterranean limestone coast, white towns, beach days and climbing culture.",
      travel: "Long",
      budget: "Medium",
      coords: [38.602, -0.045],
      type: "nature",
      climate: { low: 23, avg: 25, high: 29, feel: "Hot Mediterranean summer" },
      scores: { beach: 3, climbing: 3, urbanity: 2, weather: 3, familyEase: 2, shortTravel: 1, special: 3, calm: 2 },
      board: {
        weight: 96,
        read: "Highest emotional overlap. It carries the beach fantasy, southern atmosphere, climbing payoff and beautiful-house imagination at the same time.",
        pros: ["Pool + beach", "Southern atmosphere", "Palms", "Landscape + beach", "Climbing + beach combination", "Spanish food + coffee", "Warm evenings"],
        cons: ["Long drive", "Heat in July", "Tourism risk", "Maybe too climbing-focused", "Potentially too hot for relaxed family rhythm"]
      },
      arguments: [
        ["Achim", "Strong outdoor payoff", "Sea, limestone, valleys and real climbing culture make this the most Achim-coded option."],
        ["Fiona", "Villa comfort matters", "Works best if the house is easy, shaded, beautiful and close to daily water."],
        ["Kids", "Pool + beach rhythm", "Clear kid appeal through swimming, beaches, ice cream and village exploring."]
      ],
      highlights: ["Best areas: Calpe, Altea, Benissa and Jalon Valley.", "Main risks: heat, long drive and needing a genuinely easy house.", "Airbnb should have shade, pool, parking and simple beach access."],
      links: [["Google search", "https://www.google.com/search?q=Costa+Blanca+North+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=Costa+Blanca+North+Altea+Calpe"], ["Map search", "https://www.google.com/maps/search/Calpe+Altea+Benissa"], ["Airbnb", "https://www.airbnb.com/s/Costa-Blanca--Spain/homes"]],
      pois: [
        { name: "Penyal d'Ifac", type: "climbing_outdoor", coords: [38.6325, 0.0793], note: "Iconic limestone climbing rock above Calpe — multi-pitch routes, sea views." },
        { name: "Sella climbing area", type: "climbing_outdoor", coords: [38.6090, -0.2640], note: "Major Costa Blanca sport-climbing crag, hundreds of routes across grades." },
        { name: "Sierra de Toix sea-cliffs", type: "climbing_outdoor", coords: [38.6230, 0.0790], note: "Sport climbing on coastal limestone south of Calpe, Mascarat area." },
        { name: "Sierra de Olta", type: "climbing_outdoor", coords: [38.6470, 0.0500], note: "Approx. — climbing routes on the Sierra de Olta above Calpe." },
        { name: "Forada (Vall d'Ebo)", type: "climbing_outdoor", coords: [38.7900, -0.1500], note: "Approx. — long classic limestone routes in the Marina Alta hills." },
        { name: "Playa de la Fossa (Levante)", type: "beach", coords: [38.6444, 0.0741], note: "Long sandy Calpe beach with Penyal d'Ifac as backdrop, family-friendly." },
        { name: "Cala del Moraig", type: "beach", coords: [38.7280, 0.1828], note: "Pebble cove with turquoise water and cliffs near Benitachell." },
        { name: "Playa del Albir", type: "beach", coords: [38.5640, -0.0670], note: "Approx. — calm pebble beach in Albir, walkable promenade." },
        { name: "Cala Baladrar", type: "beach", coords: [38.6800, 0.0900], note: "Approx. — small rocky cove between Calpe and Moraira, snorkel-friendly." },
        { name: "Mercadillo de Jalón (Saturday)", type: "fleamarket", coords: [38.7464, -0.0108], note: "Famous Saturday morning second-hand & antiques market in Jalón Valley." },
        { name: "Castell de Guadalest", type: "museum", coords: [38.6740, -0.1991], note: "Cliff-top village with several quirky small museums and dramatic views." }
      ]
    },
    {
      id: "devon",
      title: "North Devon",
      category: "Achim Track",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
      vibe: "Rugged Atlantic coast, surf beaches, cliffs, rock pools and bouldering.",
      travel: "Long",
      budget: "High",
      coords: [51.172, -4.203],
      type: "nature",
      climate: { low: 14, avg: 16, high: 19, feel: "Mild Atlantic summer" },
      scores: { beach: 3, climbing: 2, urbanity: 1, weather: 1, familyEase: 2, shortTravel: 1, special: 2, calm: 2 },
      board: {
        weight: 54,
        read: "Emotionally attractive but still under-imagined. It has rugged coastal adventure, yet the daily family rhythm is not concrete enough on the board.",
        pros: ["Scenic", "Rugged", "Coastal adventure", "Emotionally attractive"],
        cons: ["Not yet concretely imagined", "Fewer detailed arguments on board", "Daily life is harder to picture", "Weather and logistics remain central risks"]
      },
      arguments: [
        ["Achim", "Wild coast energy", "Cliffs, surf and bouldering give it a strong adventure identity."],
        ["Fiona", "Needs weather backup", "The charm is real, but rain plans and house quality matter more here."],
        ["Kids", "Sand, waves, rocks", "Big beaches, surf schools, rock pools and classic coastal exploring."]
      ],
      highlights: ["Best areas: Woolacombe, Croyde, Ilfracombe and Combe Martin.", "Main risks: weather, long logistics and July pricing.", "Airbnb should be warm, spacious and close to a beach town."],
      links: [["Google search", "https://www.google.com/search?q=North+Devon+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=North+Devon+coast+family"], ["Map search", "https://www.google.com/maps/search/North+Devon+beaches"], ["Airbnb", "https://www.airbnb.com/s/North-Devon--United-Kingdom/homes"]],
      pois: [
        { name: "Woolacombe Beach", type: "beach", coords: [51.1711, -4.2114], note: "Three-mile sandy beach with surf schools, often voted the UK's best." },
        { name: "Croyde Bay", type: "beach", coords: [51.1303, -4.2428], note: "Surf beach with strong waves, lively village atmosphere." },
        { name: "Putsborough Sands", type: "beach", coords: [51.1559, -4.2278], note: "Quieter southern end of Woolacombe Bay, family-friendly with rock pools." },
        { name: "Saunton Sands", type: "beach", coords: [51.1100, -4.2430], note: "Vast flat sandy beach popular with families and kite-surfers." },
        { name: "Baggy Point", type: "climbing_outdoor", coords: [51.1450, -4.2540], note: "Classic sea-cliff climbing headland between Croyde and Putsborough." },
        { name: "Valley of Rocks (Lynton)", type: "climbing_outdoor", coords: [51.2317, -3.8470], note: "Bouldering and trad climbing in dramatic coastal valley near Lynton (~50km east)." },
        { name: "Tunnels Beaches (Ilfracombe)", type: "museum", coords: [51.2100, -4.1230], note: "Approx. — Victorian tidal bathing pool & heritage attraction in Ilfracombe." },
        { name: "Verity (Damien Hirst sculpture)", type: "museum", coords: [51.2090, -4.1110], note: "Approx. — 20m bronze sculpture on Ilfracombe harbour, free outdoor art." }
      ]
    },
    {
      id: "italy",
      title: "Italy Lakes / Dolomites",
      category: "Safe Win",
      image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1400&q=80",
      vibe: "Lake and mountain harmony with family infrastructure and beautiful daily variety.",
      travel: "Easy / Medium",
      budget: "Medium",
      coords: [45.918, 10.88],
      type: "nature",
      climate: { low: 18, avg: 22, high: 27, feel: "Warm lake summer" },
      scores: { beach: 2, climbing: 3, urbanity: 1, weather: 2, familyEase: 3, shortTravel: 2, special: 3, calm: 2 },
      board: {
        weight: 76,
        read: "Very strong Achim identity fit: glacier, lakes, water, climbing and mountain immersion. The weakness is shared summer identity: no sea, less urbanity, less cafe/beach rhythm.",
        pros: ["Glacier", "Lakes", "Water", "Climbing + lakes", "Mountain scenery", "Nature immersion"],
        cons: ["No real sea", "Less urbanity", "Too outdoor-focused", "Long drive", "Maybe missing summer beach life"]
      },
      arguments: [
        ["Achim", "Mountains without drama", "Climbing, via ferrata, lakes and scenery with manageable logistics."],
        ["Fiona", "Low-friction beauty", "Restaurants, promenades, day trips and reliable holiday infrastructure."],
        ["Kids", "Lake days + gelato", "Swimming, boats, cable cars and mountain adventures without a huge leap."]
      ],
      highlights: ["Best areas: Lake Garda north, Ledro, Arco, Riva and Dolomite edges.", "Main risks: tourist density and needing shade/parking.", "Airbnb should be walkable to water or town with outdoor space."],
      links: [["Google search", "https://www.google.com/search?q=Lake+Garda+family+holiday+Arco"], ["Image search", "https://www.google.com/search?tbm=isch&q=Lake+Garda+Dolomites+family"], ["Map search", "https://www.google.com/maps/search/Riva+del+Garda+Arco"], ["Airbnb", "https://www.airbnb.com/s/Lake-Garda--Italy/homes"]],
      pois: [
        { name: "Massone (Arco)", type: "climbing_outdoor", coords: [45.9236, 10.8758], note: "Arco's classic crag — short walk from town, sport routes in all grades." },
        { name: "Padaro / Belvedere", type: "climbing_outdoor", coords: [45.9050, 10.8830], note: "Approx. — sport-climbing crag above Arco with valley views." },
        { name: "Spiaggia delle Lucertole", type: "climbing_outdoor", coords: [45.8810, 10.8800], note: "Approx. — bouldering on Lake Garda's north shore, swim between problems." },
        { name: "Climbing Stadium Arco", type: "climbing_indoor", coords: [45.9170, 10.8780], note: "Approx. — Arco's indoor climbing/bouldering centre, world-cup venue." },
        { name: "Lago di Tenno", type: "beach", coords: [45.9560, 10.8030], note: "Turquoise alpine lake with pebble beaches above Riva del Garda." },
        { name: "Spiaggia Sabbioni (Riva del Garda)", type: "beach", coords: [45.8836, 10.8413], note: "Sandy lakefront beach in Riva del Garda." },
        { name: "Spiaggia di Limone", type: "beach", coords: [45.8160, 10.7900], note: "Approx. — Limone sul Garda lakefront with mountain backdrop." },
        { name: "MAG Museo Alto Garda (Riva)", type: "museum", coords: [45.8856, 10.8420], note: "Riva del Garda museum in the historic Rocca fortress, history + art." }
      ]
    },
    {
      id: "tenerife",
      title: "Tenerife North",
      category: "Wildcard",
      image: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=1400&q=80",
      vibe: "Volcanic island, lush north coast, natural pools, dramatic hikes and character towns.",
      travel: "Flight",
      budget: "Medium / High",
      coords: [28.389, -16.523],
      type: "nature",
      climate: { low: 19, avg: 22, high: 26, feel: "Warm island microclimate" },
      scores: { beach: 2, climbing: 2, urbanity: 2, weather: 3, familyEase: 1, shortTravel: 1, special: 3, calm: 1 },
      board: {
        weight: 42,
        read: "Wildcard fantasy. Very few notes means it is still abstract emotionally and not yet integrated into the family imagination.",
        pros: ["Volcanic landscape", "Natural pools", "Warm island feeling", "Potentially magical"],
        cons: ["Very few concrete notes yet", "Still abstract emotionally", "Not yet integrated into family imagination", "Flight and transfer logic need work"]
      },
      arguments: [
        ["Achim", "Most magical landscape", "Volcano, ravines, coast and hiking make it feel truly different."],
        ["Fiona", "Flight logic required", "Can be brilliant if the base is calm, beautiful and not too car-dependent."],
        ["Kids", "Island adventure", "Pools, beaches, lava landscapes and the feeling of a big adventure."]
      ],
      highlights: ["Best areas: Puerto de la Cruz, La Orotava, Garachico and north coast towns.", "Main risks: flight complexity, microclimates and car logistics.", "Airbnb should have terrace, parking and access to pools or beaches."],
      links: [["Google search", "https://www.google.com/search?q=Tenerife+North+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=Tenerife+North+natural+pools"], ["Map search", "https://www.google.com/maps/search/Tenerife+North+Garachico"], ["Airbnb", "https://www.airbnb.com/s/Tenerife--Spain/homes"]],
      pois: [
        { name: "Playa Jardín (Puerto de la Cruz)", type: "beach", coords: [28.4167, -16.5550], note: "Black-sand beach designed by César Manrique with tropical gardens." },
        { name: "Playa del Bollullo", type: "beach", coords: [28.4045, -16.5117], note: "Wild black-sand beach reached by coastal path from La Paz." },
        { name: "Garachico natural pools (El Caletón)", type: "beach", coords: [28.3742, -16.7625], note: "Volcanic pools formed by lava flows, swimming and snorkelling." },
        { name: "Charco de la Laja", type: "beach", coords: [28.3890, -16.7500], note: "Approx. — natural lava pools on the north coast." },
        { name: "Casa de los Balcones (La Orotava)", type: "museum", coords: [28.3897, -16.5230], note: "17th-century Canarian house and craft museum in La Orotava old town." },
        { name: "Museo de la Naturaleza y Arqueología (MUNA)", type: "museum", coords: [28.4690, -16.2470], note: "Tenerife's natural history museum in Santa Cruz (~30km drive east)." }
      ]
    },
    {
      id: "copenhagen",
      title: "Copenhagen Coast",
      category: "Urban Coast",
      image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1400&q=80",
      vibe: "Design city, bikes, harbour swimming, beaches and a polished family rhythm.",
      travel: "Flight",
      budget: "High",
      coords: [55.676, 12.568],
      type: "urban",
      climate: { low: 15, avg: 18, high: 22, feel: "Cool Nordic summer" },
      scores: { beach: 2, climbing: 1, urbanity: 3, weather: 1, familyEase: 3, shortTravel: 2, special: 3, calm: 2 },
      board: {
        weight: 67,
        read: "Strong lifestyle option adjacent to the San Sebastian/Leigh logic, but cooler weather and price keep it from the emotional lead.",
        pros: ["City + water", "Design atmosphere", "Coffee culture", "Museums", "Harbour swimming", "Easy urban rhythm"],
        cons: ["Expensive", "Cooler weather", "Weak climbing payoff", "Less classic beach-holiday feeling"]
      },
      arguments: [
        ["Achim", "Urban outdoor mix", "Harbour swims and design city energy, but weak on climbing."],
        ["Fiona", "Strong lifestyle fit", "Cafes, bikes, good food, shops and easy movement are the point."],
        ["Kids", "Playful city water", "Harbour baths, beaches, playgrounds and museums make it easy."]
      ],
      highlights: ["Best areas: Amager, Islands Brygge, Vesterbro, Norrebro and beach access zones.", "Main risks: cost, cool weather and lower nature payoff.", "Airbnb should be bike-friendly and close to transit or water."],
      links: [["Google search", "https://www.google.com/search?q=Copenhagen+family+harbour+swimming"], ["Image search", "https://www.google.com/search?tbm=isch&q=Copenhagen+beach+harbour+bath"], ["Map search", "https://www.google.com/maps/search/Copenhagen+harbour+baths"], ["Airbnb", "https://www.airbnb.com/s/Copenhagen--Denmark/homes"]],
      pois: [
        { name: "Amager Strandpark", type: "beach", coords: [55.6553, 12.6450], note: "Long city beach a metro ride from the centre, sandy and family-friendly." },
        { name: "Bellevue Beach (Klampenborg)", type: "beach", coords: [55.7600, 12.5900], note: "Approx. — Arne Jacobsen-designed beach north of the city, train accessible." },
        { name: "Islands Brygge Harbour Bath", type: "beach", coords: [55.6664, 12.5800], note: "Clean harbour swimming pools right in central Copenhagen." },
        { name: "Designmuseum Danmark", type: "museum", coords: [55.6877, 12.5917], note: "Definitive Danish design museum — chairs, posters, ceramics." },
        { name: "Louisiana Museum (Humlebæk)", type: "museum", coords: [55.9700, 12.5430], note: "World-class modern art on the coast in Humlebæk (~30km north, train + walk)." },
        { name: "Ny Carlsberg Glyptotek", type: "museum", coords: [55.6722, 12.5736], note: "Sculpture and antiquities museum with a beautiful winter garden." },
        { name: "Statens Museum for Kunst (SMK)", type: "museum", coords: [55.6885, 12.5775], note: "Denmark's national gallery — strong collection, generous spaces." },
        { name: "M/S Maritime Museum (Helsingør)", type: "museum", coords: [56.0395, 12.6160], note: "Stunning underground maritime museum next to Kronborg castle (~45km, train)." },
        { name: "Coffee Collective (Jægersborggade)", type: "coffee", coords: [55.6917, 12.5450], note: "Specialty roaster's flagship café in Nørrebro." },
        { name: "Prolog Coffee Bar (Kødbyen)", type: "coffee", coords: [55.6680, 12.5535], note: "Approx. — small specialty café in the Meatpacking District." },
        { name: "Boulders Valby", type: "climbing_indoor", coords: [55.6600, 12.5040], note: "Approx. — large bouldering gym in Valby, family-friendly." },
        { name: "Frederiksberg Loppemarked (Smallegade, summer Saturdays)", type: "fleamarket", coords: [55.6800, 12.5290], note: "Approx. — long-running flea market on Smallegade in Frederiksberg." }
      ]
    },
    {
      id: "sansebastian",
      title: "San Sebastian",
      category: "Urban Coast",
      image: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=1400&q=80",
      vibe: "Walkable Basque beach city with surf, food culture and elegant coastal life.",
      travel: "Long",
      budget: "High",
      coords: [43.318, -1.981],
      type: "urban",
      climate: { low: 18, avg: 21, high: 25, feel: "Warm Atlantic city summer" },
      scores: { beach: 3, climbing: 1, urbanity: 3, weather: 2, familyEase: 3, shortTravel: 1, special: 3, calm: 2 },
      board: {
        weight: 88,
        read: "Second emotional leader from verbal discussion: urbanity, beach, cafes, atmosphere and lifestyle all point in the same direction.",
        pros: ["Urban beach life", "Cafes", "Atmosphere", "Food culture", "Walkability", "Surf and city combination"],
        cons: ["Long travel", "Expensive", "Parking/logistics", "Weaker outdoor climbing", "Busy in July"]
      },
      arguments: [
        ["Achim", "Surf and hills", "Not a climbing trip, but a high-quality city-beach outdoor rhythm."],
        ["Fiona", "Food and walkability", "Excellent if urban coast, eating well and atmosphere matter most."],
        ["Kids", "Beach city", "Sand, waves, old town walks and easy daily variety."]
      ],
      highlights: ["Best areas: Gros, Antiguo, La Concha edges and nearby coastal towns.", "Main risks: cost, parking and busy July energy.", "Airbnb should avoid car stress and be walkable to beach or transit."],
      links: [["Google search", "https://www.google.com/search?q=San+Sebastian+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=San+Sebastian+La+Concha+family"], ["Map search", "https://www.google.com/maps/search/San+Sebastian+Gros+Antiguo"], ["Airbnb", "https://www.airbnb.com/s/San-Sebastian--Spain/homes"]],
      pois: [
        { name: "Playa de La Concha", type: "beach", coords: [43.3198, -1.9885], note: "Iconic crescent city beach, calm and family-perfect." },
        { name: "Playa de la Zurriola (Gros)", type: "beach", coords: [43.3236, -1.9742], note: "Surf beach in the Gros neighbourhood, livelier and younger crowd." },
        { name: "Playa de Ondarreta", type: "beach", coords: [43.3186, -1.9988], note: "Western continuation of La Concha, calm and family-oriented." },
        { name: "Playa de Zarautz", type: "beach", coords: [43.2858, -2.1700], note: "Approx. — long surf beach in Zarautz (~25km west, easy day trip)." },
        { name: "San Telmo Museoa", type: "museum", coords: [43.3252, -1.9844], note: "Basque culture and history museum in a converted convent in the old town." },
        { name: "Eureka! Zientzia Museoa", type: "museum", coords: [43.2986, -1.9947], note: "Hands-on science museum on the city's edge, great for kids." },
        { name: "Aquarium of San Sebastián", type: "museum", coords: [43.3271, -1.9886], note: "Family-friendly aquarium at the foot of Monte Urgull." },
        { name: "Mercado de la Bretxa", type: "fleamarket", coords: [43.3250, -1.9830], note: "Old town's central food market — pintxos ingredients and local life." }
      ]
    },
    {
      id: "malmo",
      title: "Malmo + South Sweden Coast",
      category: "Urban Coast",
      image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1400&q=80",
      vibe: "Scandi city life, beaches, design, bikes and gentle south coast day trips.",
      travel: "Long",
      budget: "Medium",
      coords: [55.605, 13.003],
      type: "urban",
      climate: { low: 14, avg: 17, high: 21, feel: "Cool Baltic summer" },
      scores: { beach: 2, climbing: 1, urbanity: 3, weather: 1, familyEase: 2, shortTravel: 1, special: 2, calm: 2 },
      board: {
        weight: 58,
        read: "Good urban-water lifestyle ingredients, but the board questions whether the vacation payoff is strong enough for the travel and cost.",
        pros: ["Beach", "City", "Nordic atmosphere", "Second hand", "Coffee culture"],
        cons: ["Long drive", "Weather uncertainty", "Expensive", "Maybe not enough vacation payoff", "Sea less impressive"]
      },
      arguments: [
        ["Achim", "Soft outdoor logic", "Bikes, coast and day trips, but not dramatic nature."],
        ["Fiona", "Calm city option", "Design, cafes, beaches and less intensity than Copenhagen."],
        ["Kids", "Bikes and coast", "Easy movement, beaches, parks and a gentle urban holiday."]
      ],
      highlights: ["Best areas: Malmo, Lomma, Ystad and south coast access.", "Main risks: cool weather and weaker wow factor.", "Airbnb should be bright, central and bike/transit friendly."],
      links: [["Google search", "https://www.google.com/search?q=Malmo+South+Sweden+coast+family"], ["Image search", "https://www.google.com/search?tbm=isch&q=Malmo+beach+Sweden"], ["Map search", "https://www.google.com/maps/search/Malmo+Lomma+Ystad"], ["Airbnb", "https://www.airbnb.com/s/Malmo--Sweden/homes"]],
      pois: [
        { name: "Ribersborgsstranden", type: "beach", coords: [55.5993, 12.9744], note: "Long city beach with grass strip and the famous cold-water bathhouse." },
        { name: "Sibbarps Strand", type: "beach", coords: [55.5755, 12.9450], note: "Approx. — calm beach south of the Öresund Bridge with picnic spots." },
        { name: "Lomma Beach", type: "beach", coords: [55.6750, 13.0680], note: "Approx. — family beach in Lomma north of Malmö, sand and shallows." },
        { name: "Form/Design Center", type: "museum", coords: [55.6058, 13.0010], note: "Scandinavian design exhibition space in central Malmö." },
        { name: "Moderna Museet Malmö", type: "museum", coords: [55.6092, 13.0028], note: "Contemporary art museum in a converted electrical works." },
        { name: "Malmö Konsthall", type: "museum", coords: [55.5961, 13.0028], note: "One of Europe's largest contemporary art halls, free entry." },
        { name: "Disgusting Food Museum", type: "museum", coords: [55.6058, 13.0019], note: "Quirky museum of unusual world foods — kids love it." }
      ]
    },
    {
      id: "lisbon",
      title: "Lisbon Coast",
      category: "Urban Coast",
      image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1400&q=80",
      vibe: "Creative city, surf beaches, Atlantic light, cafes and cultural energy.",
      travel: "Flight",
      budget: "High",
      coords: [38.697, -9.421],
      type: "urban",
      climate: { low: 18, avg: 23, high: 28, feel: "Warm Atlantic summer" },
      scores: { beach: 3, climbing: 1, urbanity: 3, weather: 3, familyEase: 2, shortTravel: 1, special: 3, calm: 1 },
      board: {
        weight: 70,
        read: "Strong on city + beach + culture and Airbnb fantasy, but distance friction and logistics are heavy.",
        pros: ["Beach", "Cool Airbnb potential", "City + beach", "Museums", "Culture", "Outdoors", "Urban life"],
        cons: ["Long drive", "Expensive drive", "Food/travel logistics", "Distance friction"]
      },
      arguments: [
        ["Achim", "Surf and city energy", "Strong Atlantic payoff, weaker climbing, high variety."],
        ["Fiona", "Creative lifestyle", "Cafes, design, culture and beach access can be a strong fit."],
        ["Kids", "Trams and beaches", "Beach days, city adventures, parks and old-town exploration."]
      ],
      highlights: ["Best areas: Cascais, Ericeira, Costa da Caparica and Lisbon neighbourhoods.", "Main risks: heat, hills, cost and car/transit complexity.", "Airbnb should solve shade, transport and easy daily water."],
      links: [["Google search", "https://www.google.com/search?q=Lisbon+coast+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=Lisbon+Cascais+family+beach"], ["Map search", "https://www.google.com/maps/search/Lisbon+Cascais+Ericeira"], ["Airbnb", "https://www.airbnb.com/s/Lisbon--Portugal/homes"]],
      pois: [
        { name: "Praia da Costa da Caparica", type: "beach", coords: [38.6430, -9.2390], note: "Vast Atlantic beach across the Tagus from Lisbon, surf and family zones." },
        { name: "Praia do Guincho", type: "beach", coords: [38.7325, -9.4730], note: "Wild surf beach near Cascais, dunes and dramatic coast." },
        { name: "Praia da Adraga", type: "beach", coords: [38.8030, -9.4790], note: "Approx. — sheltered cove beach north of Cabo da Roca." },
        { name: "Praia de São Pedro do Estoril", type: "beach", coords: [38.6943, -9.3727], note: "Approx. — small family beach with rock pools on the Cascais train line." },
        { name: "Berardo Collection (Belém)", type: "museum", coords: [38.6967, -9.2080], note: "Modern art collection inside the Belém Cultural Centre." },
        { name: "MAAT (Art, Architecture, Technology)", type: "museum", coords: [38.6957, -9.1937], note: "Striking contemporary museum on the Belém riverfront." },
        { name: "National Tile Museum (Azulejo)", type: "museum", coords: [38.7242, -9.1140], note: "Centuries of Portuguese tiles in a former convent." },
        { name: "Hello, Kristof", type: "coffee", coords: [38.7170, -9.1480], note: "Approx. — magazine-and-coffee café in Príncipe Real, design crowd." },
        { name: "Fabrica Coffee Roasters", type: "coffee", coords: [38.7200, -9.1450], note: "Approx. — specialty roaster's café in Baixa." }
      ]
    },
    {
      id: "leigh",
      title: "Leigh-on-Sea / London Coast",
      category: "Fiona Proposition",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      vibe: "Small coastal town energy with cafes, seaside walks, independent shops and London access.",
      travel: "Medium / Long",
      budget: "Medium / High",
      coords: [51.541, 0.653],
      type: "urban",
      climate: { low: 15, avg: 18, high: 22, feel: "Mild UK coastal summer" },
      scores: { beach: 2, climbing: 2, urbanity: 3, weather: 1, familyEase: 3, shortTravel: 2, special: 3, calm: 3 },
      board: {
        weight: 82,
        read: "Unexpectedly strong emotionally because daily life is easy to imagine: Haarlem vibe, London access, cafes, beach and indoor bouldering.",
        pros: ["England + London", "Urban feeling", "Coffee places", "Indoor bouldering", "Strand / beach", "London access", "Cafes + lifestyle", "Haarlem vibe"],
        cons: ["Unpredictable weather", "Beaches cold", "Maybe not a real beach holiday", "Weaker outdoor climbing", "England weather risk"]
      },
      arguments: [
        ["Achim", "City access + coast", "Useful if the family wants urban life, easy logistics and a walkable seaside base."],
        ["Fiona", "Her proposition", "A Haarlem-like argument: beach, cafes, lifestyle streets and London within reach."],
        ["Kids", "Seaside variety", "Beach, piers, cafes and daily variety without complex transfers."]
      ],
      highlights: ["Best areas: Leigh-on-Sea, Old Leigh, Chalkwell and Westcliff-on-Sea.", "Main risks: mixed weather and weak climbing payoff.", "Airbnb should be walkable, bright and close to coast or station."],
      links: [["Google search", "https://www.google.com/search?q=Leigh-on-Sea+beach+family"], ["Image search", "https://www.google.com/search?tbm=isch&q=Leigh-on-Sea+beach+family+shops+cafes"], ["Map search", "https://www.google.com/maps/search/Leigh-on-Sea+Southend+Chalkwell"], ["Airbnb", "https://www.airbnb.com/s/Leigh~on~Sea--United-Kingdom/homes"]],
      pois: [
        { name: "Bell Wharf Beach (Old Leigh)", type: "beach", coords: [51.5380, 0.6470], note: "Approx. — small sandy beach by Old Leigh village, views of Two Tree Island." },
        { name: "Chalkwell Beach", type: "beach", coords: [51.5350, 0.6720], note: "Approx. — long sandy beach east of Leigh, calm shallow water." },
        { name: "Three Shells Beach (Southend)", type: "beach", coords: [51.5363, 0.7210], note: "Approx. — small family beach by Southend pier with shallow lagoon." },
        { name: "Beecroft Art Gallery (Southend)", type: "museum", coords: [51.5420, 0.7090], note: "Approx. — free art gallery in Southend with rotating exhibitions." },
        { name: "Sea Life Adventure (Southend)", type: "museum", coords: [51.5347, 0.7290], note: "Approx. — aquarium on Southend seafront, kid-oriented." }
      ]
    },
    {
      id: "texel",
      title: "Texel / Netherlands",
      category: "Fiona Proposition",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
      vibe: "Dutch island beaches, bikes, dunes and calm family coastal life.",
      travel: "Medium",
      budget: "Medium",
      coords: [53.079, 4.811],
      type: "urban",
      climate: { low: 15, avg: 18, high: 21, feel: "Mild North Sea summer" },
      scores: { beach: 3, climbing: 1, urbanity: 1, weather: 1, familyEase: 3, shortTravel: 2, special: 1, calm: 3 },
      board: {
        weight: 63,
        read: "Safe harmony option. It works practically, but the board flags familiarity and lower special feeling.",
        pros: ["Beach", "Sea", "Holland", "Nature", "Near", "Relaxed family feeling"],
        cons: ["Little urbanity", "Cooler temperatures", "Weak climbing", "Not again", "Maybe too safe/familiar"]
      },
      arguments: [
        ["Achim", "Landscape + bikes", "Not a climbing trip, but dunes, cycling and island landscape keep it outdoorsy."],
        ["Fiona", "Calm Dutch version", "Practical beach-and-local-life model with gentle pace and village feel."],
        ["Kids", "Ferry + beach + bikes", "Seals, dunes, village exploration and a simple holiday structure."]
      ],
      highlights: ["Best areas: De Koog, Den Burg, Oudeschild and dune-edge bases.", "Main risks: cooler weather, no climbing and island availability.", "Airbnb should have bike storage and quick beach or dune access."],
      links: [["Google search", "https://www.google.com/search?q=Texel+beaches+dunes+family"], ["Image search", "https://www.google.com/search?tbm=isch&q=Texel+beaches+dunes+family+bikes"], ["Map search", "https://www.google.com/maps/search/Texel+De+Koog+Den+Burg"], ["Airbnb", "https://www.airbnb.com/s/Texel--Netherlands/homes"]],
      pois: [
        { name: "Strand Paal 17 (De Koog)", type: "beach", coords: [53.1080, 4.7290], note: "Wide sandy beach near De Koog with surf school and dunes." },
        { name: "Strand Paal 9 (Den Hoorn)", type: "beach", coords: [53.0470, 4.7390], note: "Approx. — quieter southern Texel beach near Den Hoorn." },
        { name: "Strand Paal 28 (De Cocksdorp)", type: "beach", coords: [53.1740, 4.8730], note: "Approx. — northern Texel beach near the Eierland lighthouse." },
        { name: "Ecomare", type: "museum", coords: [53.0667, 4.7500], note: "Seal sanctuary, aquarium and dunes nature centre — top family stop." },
        { name: "Kaap Skil (Oudeschild)", type: "museum", coords: [53.0397, 4.8417], note: "Maritime museum at Oudeschild with a working windmill." },
        { name: "Texel Aviation/War Museum", type: "museum", coords: [53.1130, 4.8230], note: "Approx. — small aviation/wartime museum near the airfield." }
      ]
    }
  ]
};
