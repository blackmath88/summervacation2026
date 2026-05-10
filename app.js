(function(){
  const data = window.vacationData;
  const PREF_KEY = "sv26.preferences";
  const FAV_KEY = "sv26.favorites";
  const CONTROL_KEY = "sv26.control";
  const RANK_KEY = "sv26.ranking";

  let portfolioView = "all";
  let controlFilter = "all";
  let preferences = readJson(PREF_KEY, defaultPreferences());
  let favorites = readJson(FAV_KEY, []);
  let control = readJson(CONTROL_KEY, {});
  let ranking = readJson(RANK_KEY, []);
  let map;

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

  function blendedScore(destination){
    const boardWeight = destination.board?.weight;
    if (!boardWeight) return fitScore(destination);
    return Math.round((fitScore(destination) * 0.58) + (boardWeight * 0.42));
  }

  function climateDot(value){
    const min = 10;
    const max = 32;
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  }

  function icon(name){
    return `<span class="material-symbols-outlined" aria-hidden="true">${name}</span>`;
  }

  function renderSummary(){
    document.getElementById("summary").innerHTML = data.summaries.map(item => `
      <article class="summaryCard">
        <span>${icon(item.icon)}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join("");
  }

  function renderPortfolio(){
    const list = portfolioView === "favorites"
      ? data.destinations.filter(destination => favorites.includes(destination.id))
      : data.destinations;
    document.getElementById("emptyPortfolio").hidden = !(portfolioView === "favorites" && list.length === 0);
    document.getElementById("portfolio").innerHTML = list.map(destination => cardTemplate(destination)).join("");
  }

  function cardTemplate(destination){
    const score = blendedScore(destination);
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
            <a class="primaryLink" href="#${destination.id}">Open details</a>
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

  function renderDetails(){
    document.getElementById("detailsList").innerHTML = data.destinations.map(destination => `
      <article class="detail" id="${destination.id}">
        <div class="detail__hero" style="background-image:url('${destination.image}')">
          <div>
            <p class="eyebrow">${destination.category}</p>
            <h3>${destination.title}</h3>
            <p>${destination.vibe}</p>
          </div>
        </div>
        <div class="detail__body">
          ${boardTemplate(destination)}
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
        </div>
      </article>
    `).join("");
  }

  function boardTemplate(destination){
    if (!destination.board) return "";
    return `
      <div class="boardRead">
        <div class="boardRead__head">
          <div>
            <h4>Board Read</h4>
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
    `;
  }

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
        <article class="controlCard">
          <div class="controlCard__top">
            <div>
              <h3>${destination.title}</h3>
              <span class="chip">${blendedScore(destination)}% shared fit</span>
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
  }

  function escapeHtml(value){
    return String(value || "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }

  function escapeAttr(value){
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  function renderShortlist(){
    const candidates = data.destinations
      .filter(destination => ensureControl(destination.id).status === "active" && favorites.includes(destination.id))
      .map(destination => destination.id);
    ranking = ranking.filter(id => candidates.includes(id));
    candidates.forEach(id => { if (!ranking.includes(id)) ranking.push(id); });
    save(RANK_KEY, ranking);

    const html = ranking.length
      ? ranking.map((id, index) => {
        const destination = data.destinations.find(item => item.id === id);
        return `<li><strong>${index + 1}. ${destination.title}</strong><span class="rankButtons"><button type="button" data-rank-up="${id}" aria-label="Move ${destination.title} up">↑</button><button type="button" data-rank-down="${id}" aria-label="Move ${destination.title} down">↓</button></span></li>`;
      }).join("")
      : `<li><span>Star active destinations to build the shortlist.</span></li>`;
    document.getElementById("shortlist").innerHTML = html;
  }

  function toggleFavorite(id){
    favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    save(FAV_KEY, favorites);
    renderAll();
  }

  function moveRank(id, direction){
    const index = ranking.indexOf(id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= ranking.length) return;
    [ranking[index], ranking[next]] = [ranking[next], ranking[index]];
    save(RANK_KEY, ranking);
    renderShortlist();
  }

  function initMap(){
    if (!window.L || map) return;
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
      marker.bindPopup(`<div class="popup"><h3>${destination.title}</h3><p>${destination.vibe}</p><p><strong>${blendedScore(destination)}% fit</strong> · ${destination.travel}</p><a href="#${destination.id}">Open details</a></div>`);
    });

    const bounds = L.latLngBounds([[47.5596, 7.5886], ...data.destinations.map(destination => destination.coords)]);
    map.fitBounds(bounds.pad(.18));
  }

  function refreshMapPopups(){
    if (!map) return;
    map.eachLayer(layer => {
      if (layer.getPopup && layer.getPopup()) layer.closePopup();
    });
  }

  function renderAll(){
    renderSummary();
    renderPortfolio();
    renderPreferences();
    renderDetails();
    renderControl();
    refreshMapPopups();
  }

  document.addEventListener("click", event => {
    const favorite = event.target.closest("[data-favorite]");
    if (favorite) toggleFavorite(favorite.dataset.favorite);

    const pref = event.target.closest("[data-pref]");
    if (pref) {
      preferences[pref.dataset.pref] = Number(pref.dataset.weight);
      save(PREF_KEY, preferences);
      renderAll();
    }

    const view = event.target.closest("[data-view]");
    if (view) {
      portfolioView = view.dataset.view;
      document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("is-active", button === view));
      renderPortfolio();
    }

    const filter = event.target.closest("[data-control-filter]");
    if (filter) {
      controlFilter = filter.dataset.controlFilter;
      document.querySelectorAll("[data-control-filter]").forEach(button => button.classList.toggle("is-active", button === filter));
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
    renderControl();
  });

  document.addEventListener("input", event => {
    const field = event.target.closest("[data-control-field]");
    if (!field) return;
    const [id, key] = field.dataset.controlField.split(":");
    ensureControl(id)[key] = field.value;
    save(CONTROL_KEY, control);
  });

  renderAll();
  initMap();
})();
