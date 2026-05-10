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
      links: [["Google search", "https://www.google.com/search?q=Costa+Blanca+North+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=Costa+Blanca+North+Altea+Calpe"], ["Map search", "https://www.google.com/maps/search/Calpe+Altea+Benissa"], ["Airbnb", "https://www.airbnb.com/s/Costa-Blanca--Spain/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=North+Devon+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=North+Devon+coast+family"], ["Map search", "https://www.google.com/maps/search/North+Devon+beaches"], ["Airbnb", "https://www.airbnb.com/s/North-Devon--United-Kingdom/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Lake+Garda+family+holiday+Arco"], ["Image search", "https://www.google.com/search?tbm=isch&q=Lake+Garda+Dolomites+family"], ["Map search", "https://www.google.com/maps/search/Riva+del+Garda+Arco"], ["Airbnb", "https://www.airbnb.com/s/Lake-Garda--Italy/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Tenerife+North+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=Tenerife+North+natural+pools"], ["Map search", "https://www.google.com/maps/search/Tenerife+North+Garachico"], ["Airbnb", "https://www.airbnb.com/s/Tenerife--Spain/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Copenhagen+family+harbour+swimming"], ["Image search", "https://www.google.com/search?tbm=isch&q=Copenhagen+beach+harbour+bath"], ["Map search", "https://www.google.com/maps/search/Copenhagen+harbour+baths"], ["Airbnb", "https://www.airbnb.com/s/Copenhagen--Denmark/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=San+Sebastian+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=San+Sebastian+La+Concha+family"], ["Map search", "https://www.google.com/maps/search/San+Sebastian+Gros+Antiguo"], ["Airbnb", "https://www.airbnb.com/s/San-Sebastian--Spain/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Malmo+South+Sweden+coast+family"], ["Image search", "https://www.google.com/search?tbm=isch&q=Malmo+beach+Sweden"], ["Map search", "https://www.google.com/maps/search/Malmo+Lomma+Ystad"], ["Airbnb", "https://www.airbnb.com/s/Malmo--Sweden/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Lisbon+coast+family+holiday"], ["Image search", "https://www.google.com/search?tbm=isch&q=Lisbon+Cascais+family+beach"], ["Map search", "https://www.google.com/maps/search/Lisbon+Cascais+Ericeira"], ["Airbnb", "https://www.airbnb.com/s/Lisbon--Portugal/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Leigh-on-Sea+beach+family"], ["Image search", "https://www.google.com/search?tbm=isch&q=Leigh-on-Sea+beach+family+shops+cafes"], ["Map search", "https://www.google.com/maps/search/Leigh-on-Sea+Southend+Chalkwell"], ["Airbnb", "https://www.airbnb.com/s/Leigh~on~Sea--United-Kingdom/homes"]]
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
      links: [["Google search", "https://www.google.com/search?q=Texel+beaches+dunes+family"], ["Image search", "https://www.google.com/search?tbm=isch&q=Texel+beaches+dunes+family+bikes"], ["Map search", "https://www.google.com/maps/search/Texel+De+Koog+Den+Burg"], ["Airbnb", "https://www.airbnb.com/s/Texel--Netherlands/homes"]]
    }
  ]
};
