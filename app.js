(function(){
  const data = window.vacationData;
  const FAV_KEY = "sv26.favorites";
  const CONTROL_KEY = "sv26.control";
  const RATINGS_KEY = "sv26.ratings";
  const VIEWS = ["overview", "compare", "destination", "decide", "map"];
  const CATEGORY_KEYS = Object.keys(data.preferences);

  let portfolioView = "all";
  let controlFilter = "all";
  let matrixSort = "fit";
  let favorites = readJson(FAV_KEY, []);
  let control = readJson(CONTROL_KEY, {});
  let ratings = readJson(RATINGS_KEY, {});
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
    else if (view === "map") {
      if (!mapInitialized) initMap();
      else if (map) setTimeout(() => map.invalidateSize(), 50);
    }
  }

  function renderActive(){
    const { view, param } = getRoute();
    renderView(view, param);
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
            <span class="chip">${icon("route")} ${destination.travel}</span>
            <span class="chip">${icon("payments")} ${destination.budget}</span>
            <span class="chip">${icon("thermostat")} ${destination.climate.feel}</span>
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
              <span class="chip chip--light">${icon("route")} ${destination.travel}</span>
              <span class="chip chip--light">${icon("payments")} ${destination.budget}</span>
              <span class="chip chip--light">${icon("thermostat")} ${destination.climate.feel}</span>
              <span class="fit fit--solid"><strong>${fitScore(destination)}%</strong> fit</span>
              <button class="iconButton iconButton--solid ${active ? "is-active" : ""}" type="button" data-favorite="${destination.id}" aria-label="Toggle favourite">${icon("star")}</button>
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
            <div class="links">${destination.links.map(([label, href]) => `<a target="_blank" rel="noreferrer" href="${href}">${label}</a>`).join("")}</div>
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

  // ============ MAP ============

  function initMap(){
    if (!window.L) return;
    map = L.map("vacationMap", { scrollWheelZoom:false }).setView([47.9, 6.8], 4.2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const base = L.circleMarker([47.5596, 7.5886], { radius:9, color:"#b68a38", fillColor:"#b68a38", fillOpacity:.85 }).addTo(map);
    base.bindPopup(`<div class="popup"><h3>Basel</h3><p>Starting point for the comparison.</p></div>`);

    data.destinations.forEach(destination => {
      const color = destination.type === "urban" ? "#526c5a" : "#173955";
      const marker = L.circleMarker(destination.coords, { radius:8, color, fillColor:color, fillOpacity:.82 }).addTo(map);
      marker.bindPopup(`<div class="popup"><h3>${destination.title}</h3><p>${destination.vibe}</p><p><strong>${fitScore(destination)}% fit</strong> · ${destination.travel}</p><a href="#/destination/${destination.id}">Open details</a></div>`);
    });

    const bounds = L.latLngBounds([[47.5596, 7.5886], ...data.destinations.map(destination => destination.coords)]);
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
    if (!field) return;
    const [id, key] = field.dataset.controlField.split(":");
    ensureControl(id)[key] = field.value;
    save(CONTROL_KEY, control);
  });

  window.addEventListener("hashchange", route);
  route();
})();
