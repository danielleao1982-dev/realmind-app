// RealMind v5 — SPA simples com roteamento por hash e dados no localStorage
const $ = (sel) => document.querySelector(sel);

const state = {
  entries: JSON.parse(localStorage.getItem("rm_entries") || "[]"),
  tasks: JSON.parse(localStorage.getItem("rm_tasks") || "[]"),
  settings: Object.assign({
    highContrast: true,
    notifications: false,
    language: "pt-BR",
    realityChecksPerDay: 4
  }, JSON.parse(localStorage.getItem("rm_settings") || "{}"))
};

function save() {
  localStorage.setItem("rm_entries", JSON.stringify(state.entries));
  localStorage.setItem("rm_tasks", JSON.stringify(state.tasks));
  localStorage.setItem("rm_settings", JSON.stringify(state.settings));
}

function route() {
  const hash = location.hash || "#/inicio";
  const view = hash.split("?")[0];
  const app = $("#app");
  highlightTab(view);

  const views = {
    "#/inicio": renderHome,
    "#/realidade": renderReality,
    "#/respirar": renderBreath,
    "#/agenda": renderAgenda,
    "#/diario": renderJournal,
    "#/sos": renderSOS,
    "#/estatisticas": renderStats,
    "#/config": renderConfig,
  };

  (views[view] || renderHome)(app);
}

function highlightTab(view) {
  document.querySelectorAll(".tab").forEach(a => {
    a.classList.toggle("bg-sky-100", a.getAttribute("href") === view);
    a.classList.toggle("dark:bg-sky-900/40", a.getAttribute("href") === view);
    a.classList.toggle("font-semibold", a.getAttribute("href") === view);
  });
}

function renderHome(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h1 class="text-xl font-bold mb-1">Bem-vindo(a)</h1>
        <p class="opacity-80">Use o RealMind diariamente para registrar seu humor, fazer testes de realidade e praticar respiração.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-3">
        ${quickCard("#/realidade", "Teste de realidade", "Faça agora um rápido check de realidade.")}
        ${quickCard("#/respirar", "Respiração guiada", "Ciclo 4-4-4 ou 4-7-8.")}
        ${quickCard("#/diario", "Diário", "Registre pensamentos e gatilhos.")}
      </div>
      <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 class="font-semibold mb-2">Últimas entradas</h2>
        <div id="lastEntries" class="space-y-2"></div>
      </div>
    </section>
  `;
  const last = state.entries.slice(-5).reverse();
  $("#lastEntries").innerHTML = last.map(e => `
    <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
      <div>
        <div class="font-medium">${e.title || "Sem título"}</div>
        <div class="text-xs opacity-70">${new Date(e.ts).toLocaleString()}</div>
      </div>
      <div class="text-sm opacity-80">${e.mood || "—"}</div>
    </div>
  `).join("") || `<div class="opacity-70 text-sm">Sem registros ainda.</div>`;
}

function quickCard(href, title, desc) {
  return `
  <a href="${href}" class="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 transition block">
    <div class="font-semibold">${title}</div>
    <div class="text-sm opacity-70">${desc}</div>
  </a>`;
}

function renderReality(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">Teste de Realidade</h1>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Observe as mãos e conte os dedos.</li>
        <li>Leia uma frase, olhe para outro lugar e releia. Mudou?</li>
        <li>Belisque levemente o braço. A dor parece real?</li>
        <li>Verifique a hora em um relógio e depois novamente.</li>
      </ol>
      <button id="btnRealityOk" class="px-4 py-2 rounded-xl bg-sky-600 text-white">Concluí</button>
      <div id="realityLog" class="text-sm opacity-70"></div>
    </section>
  `;
  $("#btnRealityOk").onclick = () => {
    const log = JSON.parse(localStorage.getItem("rm_reality_log") || "[]");
    log.push(Date.now());
    localStorage.setItem("rm_reality_log", JSON.stringify(log));
    $("#realityLog").textContent = "Registrado! Bom trabalho.";
  };
}

function renderBreath(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">Respiração guiada</h1>
      <div class="flex items-center gap-2">
        <label class="text-sm opacity-80">Padrão:</label>
        <select id="breathPattern" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700">
          <option value="4-4-4">4-4-4</option>
          <option value="4-7-8">4-7-8</option>
        </select>
        <button id="breathStart" class="px-4 py-2 rounded-xl bg-sky-600 text-white">Iniciar</button>
      </div>
      <div id="breathCircle" class="w-48 h-48 mx-auto rounded-full border-4 border-sky-500 flex items-center justify-center text-2xl font-bold">Pronto</div>
      <p class="text-center opacity-70">Siga as instruções: Inspirar — Segurar — Expirar</p>
    </section>
  `;
  $("#breathStart").onclick = () => startBreath($("#breathPattern").value);
}

let breathTimer;
function startBreath(pattern) {
  clearInterval(breathTimer);
  const [i,s,e] = pattern.split("-").map(n => parseInt(n, 10));
  const circle = $("#breathCircle");
  let phase = 0, t = 0;

  function step() {
    if (phase === 0) { circle.textContent = "Inspirar"; t = i; }
    if (phase === 1) { circle.textContent = "Segurar"; t = s; }
    if (phase === 2) { circle.textContent = "Expirar"; t = e; }
    phase = (phase + 1) % 3;
  }
  step();
  breathTimer = setInterval(step, 1000 * t);
}

function renderAgenda(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">Agenda</h1>
      <form id="taskForm" class="flex gap-2">
        <input id="taskTxt" class="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700" placeholder="Nova tarefa...">
        <input id="taskDate" type="datetime-local" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700">
        <button class="px-4 py-2 rounded-xl bg-sky-600 text-white">Adicionar</button>
      </form>
      <ul id="taskList" class="space-y-2"></ul>
    </section>
  `;
  $("#taskForm").onsubmit = (e) => {
    e.preventDefault();
    const txt = $("#taskTxt").value.trim();
    if (!txt) return;
    state.tasks.push({ id: crypto.randomUUID(), txt, when: $("#taskDate").value || null, done: false });
    save(); route();
  };
  const list = $("#taskList");
  list.innerHTML = state.tasks.slice().reverse().map(t => `
    <li class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
      <div>
        <div class="font-medium ${t.done ? 'line-through opacity-60' : ''}">${t.txt}</div>
        ${t.when ? `<div class="text-xs opacity-70">${new Date(t.when).toLocaleString()}</div>` : ''}
      </div>
      <div class="flex gap-2">
        <button data-id="${t.id}" class="btn-done px-3 py-1 rounded border">${t.done ? 'Refazer' : 'Concluir'}</button>
        <button data-id="${t.id}" class="btn-del px-3 py-1 rounded border">Excluir</button>
      </div>
    </li>
  `).join("") || `<div class="opacity-70 text-sm">Nada por aqui ainda.</div>`;
  list.querySelectorAll(".btn-done").forEach(b => b.onclick = () => {
    const t = state.tasks.find(x => x.id === b.dataset.id); t.done = !t.done; save(); route();
  });
  list.querySelectorAll(".btn-del").forEach(b => b.onclick = () => {
    const idx = state.tasks.findIndex(x => x.id === b.dataset.id); state.tasks.splice(idx,1); save(); route();
  });
}

function renderJournal(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">Diário</h1>
      <form id="entryForm" class="space-y-2">
        <input id="entryTitle" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700" placeholder="Título (opcional)">
        <select id="entryMood" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700">
          <option value="">Humor</option>
          <option>Calmo</option><option>Neutro</option><option>Ansioso</option><option>Triste</option><option>Feliz</option>
        </select>
        <textarea id="entryTxt" rows="5" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700" placeholder="Escreva aqui..."></textarea>
        <button class="px-4 py-2 rounded-xl bg-sky-600 text-white">Salvar</button>
      </form>
      <div id="entries" class="space-y-2"></div>
    </section>
  `;
  $("#entryForm").onsubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      title: $("#entryTitle").value.trim(),
      mood: $("#entryMood").value,
      txt: $("#entryTxt").value.trim()
    };
    state.entries.push(entry); save(); route();
  };
  const wrap = $("#entries");
  wrap.innerHTML = state.entries.slice().reverse().map(e => `
    <article class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
      <div class="flex items-center justify-between">
        <div class="font-medium">${e.title || 'Sem título'}</div>
        <div class="text-xs opacity-70">${new Date(e.ts).toLocaleString()}</div>
      </div>
      <div class="text-sm opacity-80">${e.mood || '—'}</div>
      <p class="mt-2 whitespace-pre-wrap">${e.txt || ''}</p>
    </article>
  `).join("") || `<div class="opacity-70 text-sm">Sem entradas ainda.</div>`;
}

function renderSOS(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">SOS</h1>
      <div class="space-y-2">
        <a class="block p-3 rounded-xl bg-red-600 text-white text-center" href="tel:188">Ligar 188 — CVV</a>
        <a class="block p-3 rounded-xl bg-sky-600 text-white text-center" href="https://www.gov.br/saude/pt-br/assuntos/saude-mental" target="_blank" rel="noopener">Saúde Mental — Ministério da Saúde</a>
      </div>
      <p class="text-xs opacity-70">Emergência? Procure o SAMU (192) ou o serviço local.</p>
    </section>
  `;
}

function renderStats(app) {
  const log = JSON.parse(localStorage.getItem("rm_reality_log") || "[]");
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">Estatísticas</h1>
      <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
        Checks de realidade feitos: <strong>${log.length}</strong>
      </div>
    </section>
  `;
}

function renderConfig(app) {
  app.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-bold">Configurações</h1>
      <label class="flex items-center gap-2">
        <input id="setHigh" type="checkbox" ${state.settings.highContrast ? "checked" : ""}>
        Alto contraste (melhora legibilidade)
      </label>
      <label class="flex items-center gap-2">
        <input id="setNotif" type="checkbox" ${state.settings.notifications ? "checked" : ""}>
        Notificações (requer permissão)
      </label>
      <div class="text-xs opacity-70">Idioma: ${state.settings.language}</div>
      <button id="btnExport" class="px-3 py-2 rounded-xl border">Exportar backup</button>
      <input id="importFile" type="file" accept="application/json" class="hidden"/>
      <button id="btnImport" class="px-3 py-2 rounded-xl border">Importar backup</button>
    </section>
  `;
  $("#setHigh").onchange = (e) => { state.settings.highContrast = e.target.checked; save(); document.documentElement.style.setProperty("--tw-text-opacity", "1"); };
  $("#setNotif").onchange = async (e) => {
    if (e.target.checked) {
      const perm = await Notification.requestPermission();
      state.settings.notifications = (perm === "granted");
    } else {
      state.settings.notifications = false;
    }
    save();
  };
  $("#btnExport").onclick = () => {
    const data = {entries: state.entries, tasks: state.tasks, settings: state.settings};
    const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "realmind-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };
  $("#btnImport").onclick = () => $("#importFile").click();
  $("#importFile").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        state.entries = data.entries || []; state.tasks = data.tasks || []; state.settings = Object.assign(state.settings, data.settings || {});
        save(); route();
      } catch(err){ alert("Arquivo inválido."); }
    };
    reader.readAsText(file);
  };
}

window.addEventListener("hashchange", route);
window.addEventListener("load", () => {
  // Alto contraste padrão
  if (state.settings.highContrast) document.body.classList.add("contrast");
  route();
  // Registrar SW
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
