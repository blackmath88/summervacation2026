(function(){
  const data = window.vacationData;
  const FAV_KEY = "sv26.favorites";
  const CONTROL_KEY = "sv26.control";
  const RATINGS_KEY = "sv26.ratings";
  const PROFILE_KEY = "sv26.profile";
  const VIEWS = ["overview", "compare", "destination", "decide", "map", "profile"];
  const CATEGORY_KEYS = Object.keys(data.preferences);

  const DEFAULT_PROFILE = {
    homeBase: { name: "Basel", lat: 47.5596, lng: 7.5886 },
    people: [
      { id: "achim", name: "Achim", age: 38, role: "dad", interests: ["climbing", "special", "weather"] },
      { id: "fiona", name: "Fiona", age: 37, role: "wife", interests: ["urbanity", "familyEase", "calm"] },
      { id: "ida", name: "Ida", age: 11, role: "kid", interests: ["beach", "familyEase"] },
      { id: "miro", name: "Miro", age: 6, role: "kid", interests: ["beach", "calm", "familyEase"] }
    ]
  };

  let portfolioView = "all";
  let controlFilter = "all";
  let matrixSort = "fit";
  let favorites = readJson(FAV_KEY, []);
  let control = readJson(CONTROL_KEY, {});
  let ratings = readJson(RATINGS_KEY, {});
  let profile = normalizeProfile(readJson(PROFILE_KEY, null));
  let map;
  let mapInitialized = false;
  let summaryRendered = false;

  function readJson(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }

  function save(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeProfile(p){
    const fallback = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    if (!p || typeof p !== "object") return fallback;
    return {
      homeBase: { ...fallback.homeBase, ...(p.homeBase || {}) },
      people: Array.isArray(p.people) && p.people.length ? p.people : fallback.people
    };
  }

  function ensureControl(id){
    if (!control[id]) control[id] = { status: "active", note: "", pro: "", con: "" };
    return control[id];
  }

  function ensureRating(id){
    if (!ratings[id]) ratings[id] = { scores: {}, weights: {} };
    if (!ratings[id].scores) ratings[id].scores = {};
    if (!ratings[id].weights) ratings[id].weights = {};
    return ratings[id];
  }

  function getScore(destination, cat){
    const override = ratings[destination.id]?.scores?.[cat];
    return override != null ? override : Number(destination.scores[cat] || 0);
  }

  function getWeight(destination, cat){
    const override = ratings[destination.id]?.weights?.[cat];
    return override != null ? override : Number(data.preferences[cat].weight || 0);
  }

  function setScore(id, cat, value){
    ensureRating(id).scores[cat] = value;
    save(RATINGS_KEY, ratings);
  }

  function setWeight(id, cat, value){
    ensureRating(id).weights[cat] = value;
    save(RATINGS_KEY, ratings);
  }

  function fitScore(destination){
    let total = 0;
    let max = 0;
    CATEGORY_KEYS.forEach(cat => {
      const w = getWeight(destination, cat);
      const s = getScore(destination, cat);
      total += w * s;
      max += w * 3;
    });
    return max ? Math.round((total / max) * 100) : 0;
  }

  function climateDot(value){
    const min = 10;
    const max = 32;
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  }

  function icon(name){
    return `<span class="material-symbols-outlined" aria-hidden="true">${name}</span>`;
  }

  function dots(score){
    const filled = Math.max(0, Math.min(3, Number(score) || 0));
    return `<span class="dots dots--${filled}" aria-label="${filled} of 3"><span></span><span></span><span></span></span>`;
  }

  function escapeHtml(value){
    return String(value || "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }

  function escapeAttr(value){
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  // ============ TRAVEL HELPERS ============

  function haversineKm(a, b){
    const R = 6371;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const aa = Math.sin(dLat/2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  }

  function driveHours(destCoords){
    const km = haversineKm([profile.homeBase.lat, profile.homeBase.lng], destCoords) * 1.3;
    return km / 80;
  }

  function formatHours(hours){
    if (!isFinite(hours) || hours <= 0) return "—";
    if (hours < 1) return `~${Math.round(hours * 60)} min`;
    if (hours < 10) return `~${hours.toFixed(1)} h`;
    return `~${Math.round(hours)} h`;
  }

  function mapsRouteUrl(destCoords){
    const o = `${profile.homeBase.lat},${profile.homeBase.lng}`;
    const d = `${destCoords[0]},${destCoords[1]}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=driving`;
  }

  function travelChip(destination){
    const home = escapeHtml(profile.homeBase.name);
    if (destination.travel === "Flight") {
      return `<span class="chip chip--light">${icon("flight")} Flight from ${home}</span>`;
    }
    return `<span class="chip chip--light">${icon("directions_car")} ${formatHours(driveHours(destination.coords))} from ${home}</span>`;
  }

  // ============ ROUTER ============

  function getRoute(){
    const hash = location.hash.replace(/^#\/?/, "");
    const [view, param] = hash.split("/");
    return { view: VIEWS.includes(view) ? view : "overview", param };
  }

  function showView(view){
    document.querySelectorAll("main > [data-view]").forEach(el => {
      el.hidden = el.dataset.view !== view;
    });
    document.querySelectorAll("[data-route]").forEach(link => {
      link.classList.toggle("is-active", link.dataset.route === view);
    });
  }

  function route(){
    const { view, param } = getRoute();
    showView(view);
    renderView(view, param);
    window.scrollTo(0, 0);
  }

  function renderView(view, param){
    if (view === "overview") renderOverview();
    else if (view === "compare") renderPortfolio();
    else if (view === "destination") renderDestination(param);
    else if (view === "decide") renderMatrix();
    else if (view === "profile") renderProfile();
    else if (view === "map") {
      if (!mapInitialized) initMap();
      else if (map) setTimeout(() => map.invalidateSize(), 50);
    }
  }

  function renderActive(){
    const { view, param } = getRoute();
    renderView(view, param);
  }

  function resetMap(){
    if (map) {
      map.remove();
      map = null;
    }
    mapInitialized = false;
    if (getRoute().view === "map") initMap();
  }

  // ============ OVERVIEW ============

  function renderSummaryOnce(){
    if (summaryRendered) return;
    document.getElementById("summary").innerHTML = data.summaries.map(item => `
      <article class="summaryCard">
        <span>${icon(item.icon)}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join("");
    summaryRendered = true;
  }

  function topPicks(limit){
    const candidates = data.destinations
      .filter(d => ensureControl(d.id).status === "active" && favorites.includes(d.id));
    const sorted = candidates.slice().sort((a, b) => fitScore(b) - fitScore(a));
    return limit ? sorted.slice(0, limit) : sorted;
  }

  function renderOverview(){
    renderSummaryOnce();
    const top = topPicks(3);
    const ol = document.getElementById("overviewShortlist");
    if (top.length === 0) {
      ol.innerHTML = `<li class="overviewShortlist__empty">Star destinations on Compare to build the shortlist.</li>`;
      return;
    }
    ol.innerHTML = top.map((d, i) => `
      <li>
        <span class="rank">${i + 1}</span>
        <div>
          <div class="title">${d.title}</div>
          <div class="meta">${fitScore(d)}% fit · ${d.travel} · ${d.category}</div>
        </div>
        <a class="openLink" href="#/destination/${d.id}">Open</a>
      </li>
    `).join("");
  }

  // ============ COMPARE ============

  function renderPortfolio(){
    const list = portfolioView === "favorites"
      ? data.destinations.filter(d => favorites.includes(d.id))
      : data.destinations;
    document.getElementById("emptyPortfolio").hidden = !(portfolioView === "favorites" && list.length === 0);
    document.getElementById("portfolio").innerHTML = list.map(d => cardTemplate(d)).join("");
  }

  function cardTemplate(destination){
    const score = fitScore(destination);
    const active = favorites.includes(destination.id);
    return `
      <article class="card ${active ? "is-favorite" : ""}" id="card-${destination.id}">
        <div class="card__image" style="background-image:url('${destination.image}')"></div>
        <div class="card__body">
          <div class="card__top">
            <div>
              <div class="card__kicker">${destination.category}</div>
              <h3>${destination.title}</h3>
            </div>
            <span class="fit"><strong>${score}%</strong> fit</span>
          </div>
          <p class="card__text">${destination.vibe}</p>
          <div class="chips">
            ${travelChip(destination)}
            <span class="chip">${icon("payments")} ${destination.budget}</span>
            <span class="chip">${icon("thermostat")} ${destination.climate.avg}° avg</span>
          </div>
          <div class="climate">
            <div class="climate__bar" aria-hidden="true">
              <span class="climate__dot" style="left:${climateDot(destination.climate.low)}%"></span>
              <span class="climate__dot" style="left:${climateDot(destination.climate.avg)}%"></span>
              <span class="climate__dot" style="left:${climateDot(destination.climate.high)}%"></span>
            </div>
            <div class="climate__meta"><span>Low ${destination.climate.low}°</span><span>Avg ${destination.climate.avg}°</span><span>High ${destination.climate.high}°</span></div>
          </div>
          <div class="card__actions">
            <a class="primaryLink" href="#/destination/${destination.id}">Open details</a>
            <a class="iconButton iconButton--link" href="${mapsRouteUrl(destination.coords)}" target="_blank" rel="noreferrer" aria-label="Driving route from ${escapeAttr(profile.homeBase.name)} to ${escapeAttr(destination.title)}">${icon("directions")}</a>
            <button class="iconButton ${active ? "is-active" : ""}" type="button" data-favorite="${destination.id}" aria-label="Toggle favourite for ${destination.title}" aria-pressed="${active}">${icon("star")}</button>
          </div>
        </div>
      </article>
    `;
  }

  // ============ DESTINATION DEEP DIVE ============

  function rateGrid(destination){
    return `
      <div class="boardRead infoBox--full rateGrid">
        <div class="boardRead__head">
          <div>
            <h4>Rate this destination</h4>
            <p>Score how this place performs on each category, and how much that category matters for this trip. Defaults are seeded from the research notes.</p>
          </div>
          <span class="boardWeight"><strong>${fitScore(destination)}</strong><small>%</small></span>
        </div>
        <div class="rateGrid__list">
          ${CATEGORY_KEYS.map(cat => {
            const pref = data.preferences[cat];
            const s = getScore(destination, cat);
            const w = getWeight(destination, cat);
            return `
              <article class="rateRow">
                <div class="rateRow__label">
                  <span class="prefIcon">${icon(pref.icon)}</span>
                  <div>
                    <strong>${pref.label}</strong>
                    <p>${pref.description}</p>
                  </div>
                </div>
                <div class="rateRow__controls">
                  <div class="rateRow__control">
                    <span class="rateRow__kind">Score</span>
                    <div class="prefButtons" role="group" aria-label="${pref.label} score for ${destination.title}">
                      ${[1,2,3].map(v => `<button type="button" class="${s === v ? "is-active" : ""}" data-rate-id="${destination.id}" data-rate-kind="score" data-rate-cat="${cat}" data-rate-value="${v}">${v}</button>`).join("")}
                    </div>
                  </div>
                  <div class="rateRow__control">
                    <span class="rateRow__kind">Weight</span>
                    <div class="prefButtons" role="group" aria-label="${pref.label} weight for ${destination.title}">
                      ${[1,2,3].map(v => `<button type="button" class="${w === v ? "is-active" : ""}" data-rate-id="${destination.id}" data-rate-kind="weight" data-rate-cat="${cat}" data-rate-value="${v}">${v}</button>`).join("")}
                    </div>
                  </div>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderDestination(id){
    const list = data.destinations;
    const idx = list.findIndex(d => d.id === id);
    if (idx < 0) {
      location.hash = "#/compare";
      return;
    }
    const destination = list[idx];
    const prev = list[(idx - 1 + list.length) % list.length];
    const next = list[(idx + 1) % list.length];
    const active = favorites.includes(destination.id);
    const state = ensureControl(destination.id);
    const route = mapsRouteUrl(destination.coords);
    const home = escapeHtml(profile.homeBase.name);

    document.getElementById("destinationView").innerHTML = `
      <div class="breadcrumbBar">
        <a href="#/compare" class="backLink">${icon("arrow_back")} All destinations</a>
        <div class="prevNext">
          <a href="#/destination/${prev.id}" title="${prev.title}">${icon("chevron_left")} <span>${prev.title}</span></a>
          <a href="#/destination/${next.id}" title="${next.title}"><span>${next.title}</span> ${icon("chevron_right")}</a>
        </div>
      </div>

      <article class="detail">
        <div class="detail__hero" style="background-image:url('${destination.image}')">
          <div>
            <p class="eyebrow">${destination.category}</p>
            <h3>${destination.title}</h3>
            <p>${destination.vibe}</p>
            <div class="detail__heroMeta">
              ${travelChip(destination)}
              <a class="chip chip--light chip--link" href="${route}" target="_blank" rel="noreferrer">${icon("open_in_new")} Open route in Maps</a>
              <span class="chip chip--light">${icon("payments")} ${destination.budget}</span>
              <span class="fit fit--solid"><strong>${fitScore(destination)}%</strong> fit</span>
              <button class="iconButton iconButton--solid ${active ? "is-active" : ""}" type="button" data-favorite="${destination.id}" aria-label="Toggle favourite">${icon("star")}</button>
            </div>
            <div class="detail__heroClimate">
              <span class="climateChip"><span class="climateChip__icon">${icon("ac_unit")}</span><span><strong>${destination.climate.low}°</strong><small>Low</small></span></span>
              <span class="climateChip"><span class="climateChip__icon">${icon("thermostat")}</span><span><strong>${destination.climate.avg}°</strong><small>Avg</small></span></span>
              <span class="climateChip"><span class="climateChip__icon">${icon("wb_sunny")}</span><span><strong>${destination.climate.high}°</strong><small>High</small></span></span>
              <span class="climateChip climateChip--feel">${destination.climate.feel}</span>
            </div>
          </div>
        </div>

        <div class="detail__body">
          <div class="boardRead">
            <div class="boardRead__head">
              <div>
                <h4>Strategic Read</h4>
                <p>${destination.board.read}</p>
              </div>
              <span class="boardWeight"><strong>${destination.board.weight}</strong><small>/100</small></span>
            </div>
            <div class="boardRead__cols">
              <div>
                <h5>Pros</h5>
                <ul>${destination.board.pros.map(item => `<li>${icon("add_circle")}<span>${item}</span></li>`).join("")}</ul>
              </div>
              <div>
                <h5>Cons</h5>
                <ul>${destination.board.cons.map(item => `<li>${icon("remove_circle")}<span>${item}</span></li>`).join("")}</ul>
              </div>
            </div>
          </div>

          ${rateGrid(destination)}

          <div class="argumentGrid">
            ${destination.arguments.map(([person, title, text]) => `<div class="argument"><h4>${person}</h4><strong>${title}</strong><p>${text}</p></div>`).join("")}
          </div>

          <div class="infoBox">
            <h4>Highlights</h4>
            <ul>${destination.highlights.map(item => `<li>${icon("check_circle")}<span>${item}</span></li>`).join("")}</ul>
          </div>
          <div class="infoBox">
            <h4>Useful Links</h4>
            <div class="links">
              <a target="_blank" rel="noreferrer" href="${route}">Driving route from ${home}</a>
              ${destination.links.map(([label, href]) => `<a target="_blank" rel="noreferrer" href="${href}">${label}</a>`).join("")}
            </div>
          </div>

          <div class="infoBox infoBox--full notesBox">
            <h4>Your Notes</h4>
            <div class="fieldGrid">
              <div class="field"><label>Top pro</label><input data-control-field="${destination.id}:pro" value="${escapeAttr(state.pro)}" placeholder="What lands?"></div>
              <div class="field"><label>Top con</label><input data-control-field="${destination.id}:con" value="${escapeAttr(state.con)}" placeholder="What worries you?"></div>
            </div>
            <div class="field"><label>Note</label><textarea data-control-field="${destination.id}:note" placeholder="Free thoughts...">${escapeHtml(state.note)}</textarea></div>
            <div class="field"><label>Status</label><select data-status="${destination.id}" aria-label="Status">
              <option value="active" ${state.status === "active" ? "selected" : ""}>Active</option>
              <option value="out" ${state.status === "out" ? "selected" : ""}>Out of the race</option>
            </select></div>
          </div>
        </div>
      </article>

      <div class="breadcrumbBar breadcrumbBar--bottom">
        <a href="#/compare" class="backLink">${icon("arrow_back")} All destinations</a>
        <div class="prevNext">
          <a href="#/destination/${prev.id}">${icon("chevron_left")} <span>${prev.title}</span></a>
          <a href="#/destination/${next.id}"><span>${next.title}</span> ${icon("chevron_right")}</a>
        </div>
      </div>
    `;
  }

  // ============ DECIDE (matrix) ============

  function renderMatrix(){
    const filtered = data.destinations.filter(destination => {
      const state = ensureControl(destination.id);
      if (controlFilter === "active") return state.status === "active";
      if (controlFilter === "out") return state.status === "out";
      if (controlFilter === "favorites") return favorites.includes(destination.id);
      return true;
    });

    const sorted = filtered.slice().sort((a, b) => {
      if (matrixSort === "fit") return fitScore(b) - fitScore(a);
      if (matrixSort === "title") return a.title.localeCompare(b.title);
      if (CATEGORY_KEYS.includes(matrixSort)) return getScore(b, matrixSort) - getScore(a, matrixSort);
      return 0;
    });

    const grid = document.getElementById("matrixGrid");
    if (!grid) return;

    const header = `
      <div class="matrixRow matrixRow--head">
        <div class="matrixCell matrixCell--dest">
          <button type="button" class="matrixSort ${matrixSort === "title" ? "is-active" : ""}" data-matrix-sort="title">Destination</button>
        </div>
        ${CATEGORY_KEYS.map(cat => `
          <div class="matrixCell matrixCell--cat">
            <button type="button" class="matrixSort ${matrixSort === cat ? "is-active" : ""}" data-matrix-sort="${cat}" title="${data.preferences[cat].label}">
              ${icon(data.preferences[cat].icon)}<span>${data.preferences[cat].label}</span>
            </button>
          </div>
        `).join("")}
        <div class="matrixCell matrixCell--fit">
          <button type="button" class="matrixSort ${matrixSort === "fit" ? "is-active" : ""}" data-matrix-sort="fit">Fit</button>
        </div>
      </div>
    `;

    const rows = sorted.length ? sorted.map((destination, rank) => {
      const state = ensureControl(destination.id);
      const fav = favorites.includes(destination.id);
      const fit = fitScore(destination);
      const isOut = state.status === "out";
      const userPro = state.pro && state.pro.trim();
      const userCon = state.con && state.con.trim();
      const pros = (userPro ? [userPro] : []).concat(destination.board.pros).slice(0, 4);
      const cons = (userCon ? [userCon] : []).concat(destination.board.cons).slice(0, 4);
      return `
        <div class="matrixRow ${isOut ? "is-out" : ""} ${fav ? "is-favorite" : ""}">
          <div class="matrixRowMain">
            <div class="matrixCell matrixCell--dest">
              <span class="matrixRank">${matrixSort === "fit" ? rank + 1 : ""}</span>
              <div class="matrixDest">
                <span class="card__kicker">${destination.category}</span>
                <a href="#/destination/${destination.id}" class="matrixDest__title">${destination.title}</a>
                <span class="matrixDest__meta">${destination.travel === "Flight" ? "Flight" : formatHours(driveHours(destination.coords))} · ${destination.climate.avg}° avg</span>
              </div>
              <button class="iconButton ${fav ? "is-active" : ""}" type="button" data-favorite="${destination.id}" aria-label="Toggle favourite for ${destination.title}">${icon("star")}</button>
            </div>
            ${CATEGORY_KEYS.map(cat => `
              <div class="matrixCell matrixCell--cat" title="${data.preferences[cat].label}: score ${getScore(destination, cat)}, weight ${getWeight(destination, cat)}">
                ${dots(getScore(destination, cat))}
                <span class="weightTag">w${getWeight(destination, cat)}</span>
              </div>
            `).join("")}
            <div class="matrixCell matrixCell--fit">
              <strong>${fit}%</strong>
            </div>
          </div>
          <div class="matrixRowDetail">
            <div class="matrixDetail__pros">
              <h5>Pros</h5>
              <ul>${pros.map(item => `<li>${icon("add_circle")}<span>${escapeHtml(item)}</span></li>`).join("")}</ul>
            </div>
            <div class="matrixDetail__cons">
              <h5>Cons</h5>
              <ul>${cons.map(item => `<li>${icon("remove_circle")}<span>${escapeHtml(item)}</span></li>`).join("")}</ul>
            </div>
            ${state.note && state.note.trim() ? `<div class="matrixDetail__note"><h5>Note</h5><p>${escapeHtml(state.note)}</p></div>` : ""}
          </div>
        </div>
      `;
    }).join("") : `<div class="matrixEmpty">No destinations match this filter.</div>`;

    grid.innerHTML = header + rows;
    renderDecideSummary();
  }

  function renderDecideSummary(){
    const summaryEl = document.getElementById("decideSummary");
    if (!summaryEl) return;
    const active = data.destinations.filter(d => ensureControl(d.id).status === "active");
    const activeFavs = active.filter(d => favorites.includes(d.id));
    const out = data.destinations.filter(d => ensureControl(d.id).status === "out");
    const top = topPicks(1)[0];
    if (top) {
      summaryEl.innerHTML = `${activeFavs.length} active favourite${activeFavs.length === 1 ? "" : "s"} · ${out.length} out · current top: <strong>${top.title}</strong> (${fitScore(top)}% fit).`;
    } else {
      summaryEl.innerHTML = `${active.length} active · ${out.length} out · star a destination to start a shortlist.`;
    }
  }

  function toggleFavorite(id){
    favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    save(FAV_KEY, favorites);
    renderActive();
  }

  // ============ PROFILE ============

  function renderProfile(){
    const container = document.getElementById("profileView");
    if (!container) return;
    container.innerHTML = `
      <section class="section">
        <div class="sectionHead">
          <div>
            <p class="eyebrow">Profile</p>
            <h2>Travellers & Home Base</h2>
          </div>
          <p>Drives the travel-time calculation, route links, and per-person interests across the app.</p>
        </div>

        <div class="profileGrid">
          <article class="profileCard">
            <div class="profileCard__head">
              <span class="prefIcon">${icon("home")}</span>
              <div>
                <strong>Home base</strong>
                <p>Used as the origin for drive-time estimates and Maps route links.</p>
              </div>
            </div>
            <div class="fieldGrid profileBaseFields">
              <div class="field"><label>City</label><input data-profile-base="name" value="${escapeAttr(profile.homeBase.name)}" placeholder="Basel"></div>
              <div class="field"><label>Latitude</label><input data-profile-base="lat" type="number" step="0.0001" value="${profile.homeBase.lat}"></div>
              <div class="field"><label>Longitude</label><input data-profile-base="lng" type="number" step="0.0001" value="${profile.homeBase.lng}"></div>
            </div>
          </article>

          <article class="profileCard">
            <div class="profileCard__head">
              <span class="prefIcon">${icon("group")}</span>
              <div>
                <strong>Travellers</strong>
                <p>Each traveller's interests are tagged from the same 8 categories used to rate destinations.</p>
              </div>
              <button type="button" class="primaryLink" data-profile-add-person>${icon("add")} Add person</button>
            </div>
            <div class="peopleList">
              ${profile.people.map(person => personCard(person)).join("")}
              ${profile.people.length === 0 ? `<p class="empty">No travellers yet. Add one above.</p>` : ""}
            </div>
          </article>
        </div>
      </section>
    `;
  }

  function personCard(person){
    const interests = Array.isArray(person.interests) ? person.interests : [];
    return `
      <article class="personCard">
        <div class="personCard__head">
          <div class="fieldGrid personCard__fields">
            <div class="field"><label>Name</label><input data-person="${person.id}:name" value="${escapeAttr(person.name)}"></div>
            <div class="field"><label>Age</label><input data-person="${person.id}:age" type="number" min="0" max="120" value="${person.age || ""}"></div>
            <div class="field"><label>Role</label><input data-person="${person.id}:role" value="${escapeAttr(person.role || "")}" placeholder="dad / kid / friend"></div>
          </div>
          <button type="button" class="iconButton" data-person-delete="${person.id}" aria-label="Remove ${escapeAttr(person.name)}">${icon("delete")}</button>
        </div>
        <div class="personCard__interests">
          <label>Interests</label>
          <div class="chips">
            ${CATEGORY_KEYS.map(cat => {
              const pref = data.preferences[cat];
              const on = interests.includes(cat);
              return `<button type="button" class="chip chip--toggle ${on ? "is-active" : ""}" data-person-interest="${person.id}:${cat}">${icon(pref.icon)} ${pref.label}</button>`;
            }).join("")}
          </div>
        </div>
      </article>
    `;
  }

  // ============ MAP ============

  function initMap(){
    if (!window.L) return;
    map = L.map("vacationMap", { scrollWheelZoom:false }).setView([47.9, 6.8], 4.2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const homeCoords = [profile.homeBase.lat, profile.homeBase.lng];
    const base = L.circleMarker(homeCoords, { radius:9, color:"#b68a38", fillColor:"#b68a38", fillOpacity:.85 }).addTo(map);
    base.bindPopup(`<div class="popup"><h3>${escapeHtml(profile.homeBase.name)}</h3><p>Home base. Drive estimates and route links use this as the origin.</p></div>`);

    data.destinations.forEach(destination => {
      const color = destination.type === "urban" ? "#526c5a" : "#173955";
      const marker = L.circleMarker(destination.coords, { radius:8, color, fillColor:color, fillOpacity:.82 }).addTo(map);
      const travel = destination.travel === "Flight"
        ? `Flight from ${escapeHtml(profile.homeBase.name)}`
        : `${formatHours(driveHours(destination.coords))} from ${escapeHtml(profile.homeBase.name)}`;
      marker.bindPopup(`<div class="popup"><h3>${destination.title}</h3><p>${destination.vibe}</p><p><strong>${fitScore(destination)}% fit</strong> · ${travel}</p><a href="#/destination/${destination.id}">Open details</a> · <a href="${mapsRouteUrl(destination.coords)}" target="_blank" rel="noreferrer">Driving route ↗</a></div>`);
    });

    const bounds = L.latLngBounds([homeCoords, ...data.destinations.map(destination => destination.coords)]);
    map.fitBounds(bounds.pad(.18));
    mapInitialized = true;
    setTimeout(() => map.invalidateSize(), 50);
  }

  // ============ EVENT WIRING ============

  document.addEventListener("click", event => {
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) toggleFavorite(favorite.dataset.favorite);

    const rate = event.target.closest("[data-rate-id]");
    if (rate) {
      const id = rate.dataset.rateId;
      const cat = rate.dataset.rateCat;
      const value = Number(rate.dataset.rateValue);
      if (rate.dataset.rateKind === "weight") setWeight(id, cat, value);
      else setScore(id, cat, value);
      renderActive();
    }

    const filterBtn = event.target.closest("[data-view-filter]");
    if (filterBtn) {
      portfolioView = filterBtn.dataset.viewFilter;
      document.querySelectorAll("[data-view-filter]").forEach(button => button.classList.toggle("is-active", button === filterBtn));
      renderPortfolio();
    }

    const controlBtn = event.target.closest("[data-control-filter]");
    if (controlBtn) {
      controlFilter = controlBtn.dataset.controlFilter;
      document.querySelectorAll("[data-control-filter]").forEach(button => button.classList.toggle("is-active", button === controlBtn));
      renderMatrix();
    }

    const sortBtn = event.target.closest("[data-matrix-sort]");
    if (sortBtn) {
      matrixSort = sortBtn.dataset.matrixSort;
      renderMatrix();
    }

    const interest = event.target.closest("[data-person-interest]");
    if (interest) {
      const [id, cat] = interest.dataset.personInterest.split(":");
      const person = profile.people.find(p => p.id === id);
      if (person) {
        person.interests = Array.isArray(person.interests) ? person.interests : [];
        person.interests = person.interests.includes(cat)
          ? person.interests.filter(c => c !== cat)
          : [...person.interests, cat];
        save(PROFILE_KEY, profile);
        renderProfile();
      }
    }

    const del = event.target.closest("[data-person-delete]");
    if (del) {
      const id = del.dataset.personDelete;
      const person = profile.people.find(p => p.id === id);
      if (person && confirm(`Remove ${person.name}?`)) {
        profile.people = profile.people.filter(p => p.id !== id);
        save(PROFILE_KEY, profile);
        renderProfile();
      }
    }

    if (event.target.closest("[data-profile-add-person]")) {
      const newId = "person-" + Date.now();
      profile.people.push({ id: newId, name: "New person", age: null, role: "", interests: [] });
      save(PROFILE_KEY, profile);
      renderProfile();
    }
  });

  document.addEventListener("change", event => {
    const status = event.target.closest("[data-status]");
    if (!status) return;
    ensureControl(status.dataset.status).status = status.value;
    save(CONTROL_KEY, control);
    if (getRoute().view === "decide") renderMatrix();
    else renderDecideSummary();
  });

  document.addEventListener("input", event => {
    const field = event.target.closest("[data-control-field]");
    if (field) {
      const [id, key] = field.dataset.controlField.split(":");
      ensureControl(id)[key] = field.value;
      save(CONTROL_KEY, control);
      return;
    }

    const base = event.target.closest("[data-profile-base]");
    if (base) {
      const key = base.dataset.profileBase;
      profile.homeBase[key] = (key === "lat" || key === "lng") ? Number(base.value) : base.value;
      save(PROFILE_KEY, profile);
      if (key === "lat" || key === "lng" || key === "name") resetMap();
      return;
    }

    const person = event.target.closest("[data-person]");
    if (person) {
      const [id, key] = person.dataset.person.split(":");
      const p = profile.people.find(pp => pp.id === id);
      if (p) {
        p[key] = key === "age" ? (person.value === "" ? null : Number(person.value)) : person.value;
        save(PROFILE_KEY, profile);
      }
    }
  });

  window.addEventListener("hashchange", route);
  route();
})();
