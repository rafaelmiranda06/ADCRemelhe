/* ============================================
   Ironbridge FC — Fan Hub
   Beginner-friendly, commented starter script.
   Everything is plain JS: no frameworks, no build step.
   ============================================ */

/* ---- 1. Data (would come from an API/backend later) ---- */

const squad = [
  { number: 1, name: "M. Voss", position: "Goalkeeper" },
  { number: 4, name: "D. Reyes", position: "Defender" },
  { number: 5, name: "K. Adeyemi", position: "Defender" },
  { number: 8, name: "T. Fernandes", position: "Midfielder" },
  { number: 10, name: "L. Marchetti", position: "Midfielder" },
  { number: 11, name: "S. Okafor", position: "Forward" },
  { number: 14, name: "R. Lindqvist", position: "Forward" },
  { number: 22, name: "J. Park", position: "Defender" },
];

const fixtures = [
  { date: "12 Sep", opponent: "Kestrel United", venue: "Home", result: null },
  { date: "05 Sep", opponent: "Northgate Athletic", venue: "Away", result: "W 2-1" },
  { date: "29 Aug", opponent: "Vale Rovers", venue: "Home", result: "D 1-1" },
  { date: "22 Aug", opponent: "Harrow Town", venue: "Away", result: "L 0-2" },
];

const news = [
  { date: "2 Sep 2026", title: "New signing joins midfield ahead of derby", body: "The club has strengthened its options in central midfield with a two-year deal." },
  { date: "30 Aug 2026", title: "Ticket prices frozen for the new season", body: "Season card holders will see no price increase for the fourth year running." },
  { date: "24 Aug 2026", title: "Youth academy graduate named in matchday squad", body: "A product of the club's academy has been included in the senior squad for the first time." },
];

let pollVotes = { voss: 0, marchetti: 0, okafor: 0 };
const pollLabels = { voss: "M. Voss", marchetti: "L. Marchetti", okafor: "S. Okafor" };

let comments = [
  { name: "GreenTerrace92", text: "That second half performance was something else!" },
];

/* ---- 2. Render functions ---- */

function renderSquad() {
  const grid = document.getElementById("squadGrid");
  grid.innerHTML = squad.map(player => `
    <div class="player-card">
      <div class="player-number">${player.number}</div>
      <div class="player-name">${player.name}</div>
      <div class="player-pos">${player.position}</div>
    </div>
  `).join("");
}

function renderFixtures() {
  const tbody = document.querySelector("#fixturesTable tbody");
  tbody.innerHTML = fixtures.map(f => {
    let resultCell = "Upcoming";
    let cls = "";
    if (f.result) {
      if (f.result.startsWith("W")) cls = "result-win";
      else if (f.result.startsWith("L")) cls = "result-loss";
      else cls = "result-draw";
      resultCell = f.result;
    }
    return `
      <tr>
        <td>${f.date}</td>
        <td>${f.opponent}</td>
        <td>${f.venue}</td>
        <td class="${cls}">${resultCell}</td>
      </tr>
    `;
  }).join("");
}

function renderPoll() {
  const container = document.getElementById("pollOptions");
  const total = Object.values(pollVotes).reduce((a, b) => a + b, 0);
  document.getElementById("pollTotal").textContent = total;

  container.innerHTML = Object.keys(pollVotes).map(key => {
    const votes = pollVotes[key];
    const pct = total === 0 ? 0 : Math.round((votes / total) * 100);
    return `
      <div class="poll-option">
        <button data-key="${key}">
          <span class="poll-bar" style="width:${pct}%"></span>
          <span>${pollLabels[key]} — ${votes} vote${votes === 1 ? "" : "s"} (${pct}%)</span>
        </button>
      </div>
    `;
  }).join("");

  container.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      pollVotes[key]++;
      renderPoll();
    });
  });
}

function renderComments() {
  const list = document.getElementById("commentList");
  list.innerHTML = comments.map(c => `
    <div class="comment">
      <strong>${escapeHtml(c.name)}</strong>: ${escapeHtml(c.text)}
    </div>
  `).join("");
  list.scrollTop = list.scrollHeight;
}

function renderNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = news.map(item => `
    <div class="news-card">
      <div class="news-date">${item.date}</div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </div>
  `).join("");
}

/* Basic safety: avoid raw HTML injection from user-typed comments */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---- 3. Countdown to next match ---- */

function startCountdown() {
  // Set this to your next real fixture date/time.
  const matchDate = new Date("2026-09-12T15:00:00");

  function update() {
    const now = new Date();
    const diff = matchDate - now;
    const el = document.getElementById("countdown");

    if (diff <= 0) {
      el.textContent = "Kick-off!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    el.textContent = `${days}d ${hours}h ${mins}m`;
  }

  update();
  setInterval(update, 60 * 1000);
}

/* ---- 4. Event wiring ---- */

function setupNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
}

function setupCommentForm() {
  const form = document.getElementById("commentForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("commentName").value.trim();
    const text = document.getElementById("commentText").value.trim();
    if (!name || !text) return;

    comments.push({ name, text });
    renderComments();
    form.reset();
  });
}

/* ---- 5. Init ---- */

document.addEventListener("DOMContentLoaded", () => {
  renderSquad();
  renderFixtures();
  renderPoll();
  renderComments();
  renderNews();
  startCountdown();
  setupNav();
  setupCommentForm();
});
