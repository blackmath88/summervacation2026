(function(){
  const data = window.vacationData;
  const PREF_KEY = "sv26.preferences";
  const FAV_KEY = "sv26.favorites";
  const CONTROL_KEY = "sv26.control";
  const RANK_KEY = "sv26.ranking";
  const VIEWS = ["overview", "compare", "destination", "decide", "map"];

  let portfolioView = "all";
  let controlFilter = "all";
  let preferences = readJson(PREF_KEY, defaultPreferences());
  let favorites = readJson(FAV_KEY, []);
  let control = readJson(CONTROL_KEY, {});
  let ranking = readJson(RANK_KEY, []);
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

  function defaultPreferences(){
    return Object.fromEntries(Object.entries(data.preferences).map(([key, pref]) => [key, pref.weight]));
  }

  function ensureControl(id){
    if (!control[id]) control[id] = { status: "active", note: "", pro: "", con: "" };
    return control[id];
  }

  function fitScore(destination){
    let total = 0;
    let max = 0;
    Object.keys(data.preferences).forEach(key => {
      const weight = Number(preferences[key] || 0);
      total += weight * Number(destination.scores[key] || 0);
      max += weight * 3;
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
    else if (view === "compare") { renderPortfolio(); renderPreferences(); }
    else if (view === "destination") renderDestination(param);
    else if (view === "decide") renderControl();
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

  function topShortlist(limit){
    const candidates = data.destinations
      .filter(d => ensureControl(d.id).status === "active" && favorites.includes(d.id));
    if (candidates.length === 0) return [];
    const ranked = ranking
      .map(id => candidates.find(d => d.id === id))
      .filter(Boolean);
    candidates.forEach(d => { if (!ranked.includes(d)) ranked.push(d); });
    return limit ? ranked.slice(0, limit) : ranked;
  }

  function renderOverview(){
    renderSummaryOnce();
    const top = topShortlist(3);
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

  function renderPreferences(){
    document.getElementById("preferencesGrid").innerHTML = Object.entries(data.preferences).map(([key, pref]) => {
      const value = Number(preferences[key] || 1);
      return `
        <article class="prefCard">
          <div class="prefCard__head">
            <span class="prefIcon">${icon(pref.icon)}</span>
            <div>
              <strong>${pref.label}</strong>
              <p>${pref.description}</p>
            </div>
          </div>
          <div class="prefButtons" role="group" aria-label="${pref.label} weight">
            ${[1,2,3].map(weight => `<button type="button" class="${value === weight ? "is-active" : ""}" data-pref="${key}" data-weight="${weight}">${weight}</button>`).join("")}
          </div>
        </article>
      `;
    }).join("");
  }

  // ============ DESTINATION DEEP DIVE ============

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

  // ============ DECIDE ============

  function renderControl(){
    const filtered = data.destinations.filter(destination => {
      const state = ensureControl(destination.id);
      if (controlFilter === "active") return state.status === "active";
      if (controlFilter === "out") return state.status === "out";
      if (controlFilter === "favorites") return favorites.includes(destination.id);
      return true;
    });
    document.getElementById("controlGrid").innerHTML = filtered.map(destination => {
      const state = ensureControl(destination.id);
      const active = favorites.includes(destination.id);
      return `
        <article class="controlCard ${state.status === "out" ? "is-out" : ""}">
          <div class="controlCard__top">
            <div>
              <h3><a href="#/destination/${destination.id}" class="ghostLink">${destination.title}</a></h3>
              <span class="chip">${fitScore(destination)}% shared fit</span>
            </div>
            <button class="iconButton ${active ? "is-active" : ""}" type="button" data-favorite="${destination.id}" aria-label="Toggle favourite for ${destination.title}">${icon("star")}</button>
          </div>
          <div class="controlCard__row">
            <select data-status="${destination.id}" aria-label="Status for ${destination.title}">
              <option value="active" ${state.status === "active" ? "selected" : ""}>Active</option>
              <option value="out" ${state.status === "out" ? "selected" : ""}>Out of the race</option>
            </select>
          </div>
          <div class="fieldGrid">
            <div class="field"><label>Top pro</label><input data-control-field="${destination.id}:pro" value="${escapeAttr(state.pro)}"></div>
            <div class="field"><label>Top con</label><input data-control-field="${destination.id}:con" value="${escapeAttr(state.con)}"></div>
          </div>
          <div class="field"><label>Note</label><textarea data-control-field="${destination.id}:note">${escapeHtml(state.note)}</textarea></div>
        </article>
      `;
    }).join("");
    renderShortlist();
    renderDecideSummary();
  }

  function renderDecideSummary(){
    const summaryEl = document.getElementById("decideSummary");
    if (!summaryEl) return;
    const active = data.destinations.filter(d => ensureControl(d.id).status === "active");
    const activeFavs = active.filter(d => favorites.includes(d.id));
    const out = data.destinations.filter(d => ensureControl(d.id).status === "out");
    const top = topShortlist(1)[0];
    if (top) {
      summaryEl.innerHTML = `${activeFavs.length} active favourite${activeFavs.length === 1 ? "" : "s"} · ${out.length} out · current top: <strong>${top.title}</strong> (${fitScore(top)}% fit).`;
    } else {
      summaryEl.innerHTML = `${active.length} active · ${out.length} out · star a destination to start a shortlist.`;
    }
  }

  function renderShortlist(){
    const candidates = data.destinations
      .filter(destination => ensureControl(destination.id).status === "active" && favorites.includes(destination.id))
      .map(destination => destination.id);
    ranking = ranking.filter(id => candidates.includes(id));
    candidates.forEach(id => { if (!ranking.includes(id)) ranking.push(id); });
    save(RANK_KEY, ranking);

    const shortlistEl = document.getElementById("shortlist");
    if (!shortlistEl) return;
    const html = ranking.length
      ? ranking.map((id, index) => {
        const destination = data.destinations.find(item => item.id === id);
        return `<li><strong>${index + 1}. ${destination.title}</strong><span class="rankButtons"><button type="button" data-rank-up="${id}" aria-label="Move ${destination.title} up">↑</button><button type="button" data-rank-down="${id}" aria-label="Move ${destination.title} down">↓</button></span></li>`;
      }).join("")
      : `<li><span>Star active destinations to build the shortlist.</span></li>`;
    shortlistEl.innerHTML = html;
  }

  function toggleFavorite(id){
    favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    save(FAV_KEY, favorites);
    renderActive();
  }

  function moveRank(id, direction){
    const index = ranking.indexOf(id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= ranking.length) return;
    [ranking[index], ranking[next]] = [ranking[next], ranking[index]];
    save(RANK_KEY, ranking);
    renderShortlist();
    renderDecideSummary();
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

    const pref = event.target.closest("[data-pref]");
    if (pref) {
      preferences[pref.dataset.pref] = Number(pref.dataset.weight);
      save(PREF_KEY, preferences);
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
      renderControl();
    }

    const up = event.target.closest("[data-rank-up]");
    if (up) moveRank(up.dataset.rankUp, -1);
    const down = event.target.closest("[data-rank-down]");
    if (down) moveRank(down.dataset.rankDown, 1);
  });

  document.addEventListener("change", event => {
    const status = event.target.closest("[data-status]");
    if (!status) return;
    ensureControl(status.dataset.status).status = status.value;
    save(CONTROL_KEY, control);
    if (getRoute().view === "decide") renderControl();
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
