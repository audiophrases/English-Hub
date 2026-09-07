/* ==========================================================================
   English Hub — teacher editing

   Teacher Mode can edit a class's units.json and commit it straight back to
   the repo through the GitHub Contents API. GitHub Pages redeploys within a
   minute or so, and students see the new content on their next reload.

   THE TOKEN
   ---------
   Committing needs a GitHub token, which this asks for the first time you
   save and keeps in sessionStorage — it is gone when the tab closes and it
   is never written into the page or the repo. Make one at
   https://github.com/settings/personal-access-tokens/new

     - Repository access -> Only select repositories -> English-Hub
     - Permissions -> Repository permissions -> Contents -> Read and write
     - Give it a short expiry; you can always mint another.

   Scope it to this one repository. A token pasted into a page is only as
   safe as the browser it is typed into, so a fine-grained token that can
   touch nothing else is the difference between a bad day and a very bad one.
   ========================================================================== */

const HUB_GH_REPO = 'audiophrases/English-Hub';
const HUB_GH_BRANCH = 'main';
const HUB_GH_TOKEN_KEY = 'hubGithubToken';
const HUB_GH_API = 'https://api.github.com';

let hubEditorConfig = null;   // { path, getUnits, setUnits, onChange }
let hubEditingUnitId = null;

function hubEditorInit(config) {
    hubEditorConfig = config;
}

/* --- units.json ----------------------------------------------------------- */

// Cache-bust: GitHub Pages will happily serve a stale units.json right after
// a commit, which makes a successful save look like it did nothing.
function hubLoadUnits(path) {
    return fetch(path + '?v=' + Date.now(), { cache: 'no-store' }).then(function (res) {
        if (!res.ok) throw new Error('Could not load ' + path + ' (' + res.status + ')');
        return res.json();
    });
}

/* --- token ---------------------------------------------------------------- */

function hubGithubToken() {
    try { return sessionStorage.getItem(HUB_GH_TOKEN_KEY); } catch (e) { return null; }
}

function hubSetGithubToken(token) {
    try { sessionStorage.setItem(HUB_GH_TOKEN_KEY, token); } catch (e) {}
}

function hubClearGithubToken() {
    try { sessionStorage.removeItem(HUB_GH_TOKEN_KEY); } catch (e) {}
}

/* --- GitHub Contents API -------------------------------------------------- */

// btoa() throws on anything above U+00FF, and these units are full of
// Catalan accents, so encode to UTF-8 bytes first.
function hubBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

function hubGithubHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };
}

function hubGithubMessage(res, body) {
    if (res.status === 401) return 'GitHub rejected the token. It may be expired or mistyped.';
    if (res.status === 403) return 'That token is not allowed to write here. Check it has Contents: Read and write on English-Hub.';
    if (res.status === 404) return 'GitHub cannot see ' + HUB_GH_REPO + '. Check the token grants access to that repository.';
    if (res.status === 409) return 'Someone else changed this file first. Reload the page and make the edit again.';
    if (res.status === 422) return 'GitHub refused the commit: ' + ((body && body.message) || 'unprocessable request') + '.';
    return 'GitHub returned ' + res.status + ((body && body.message) ? ': ' + body.message : '') + '.';
}

// The Contents API needs the blob SHA of the file it is replacing.
function hubGithubSha(path, token) {
    const url = HUB_GH_API + '/repos/' + HUB_GH_REPO + '/contents/' + path + '?ref=' + HUB_GH_BRANCH;
    return fetch(url, { headers: hubGithubHeaders(token), cache: 'no-store' }).then(function (res) {
        if (!res.ok) {
            return res.json().catch(function () { return null; }).then(function (body) {
                throw new Error(hubGithubMessage(res, body));
            });
        }
        return res.json().then(function (body) { return body.sha; });
    });
}

function hubCommitUnits(path, units, message) {
    const token = hubGithubToken();
    if (!token) return Promise.reject(new Error('No GitHub token in this session.'));

    const content = JSON.stringify(units, null, 2) + '\n';

    return hubGithubSha(path, token).then(function (sha) {
        return fetch(HUB_GH_API + '/repos/' + HUB_GH_REPO + '/contents/' + path, {
            method: 'PUT',
            headers: Object.assign({ 'Content-Type': 'application/json' }, hubGithubHeaders(token)),
            body: JSON.stringify({
                message: message,
                content: hubBase64(content),
                sha: sha,
                branch: HUB_GH_BRANCH
            })
        });
    }).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (body) {
            if (!res.ok) throw new Error(hubGithubMessage(res, body));
            return body;
        });
    });
}

/* --- editor UI ------------------------------------------------------------ */

function hubEsc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const HUB_INPUT_CLASS = 'w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 '
    + 'bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 '
    + 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow';

const HUB_LABEL_CLASS = 'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';

function hubField(label, name, value, rows) {
    const control = rows
        ? '<textarea data-field="' + name + '" rows="' + rows + '" class="' + HUB_INPUT_CLASS + ' resize-y">' + hubEsc(value) + '</textarea>'
        : '<input type="text" data-field="' + name + '" value="' + hubEsc(value) + '" class="' + HUB_INPUT_CLASS + '">';
    return '<div><label class="' + HUB_LABEL_CLASS + '">' + hubEsc(label) + '</label>' + control + '</div>';
}

function hubRowButton(action, icon, title) {
    return '<button type="button" data-action="' + action + '" title="' + hubEsc(title) + '" '
        + 'class="shrink-0 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 '
        + 'dark:hover:bg-rose-900/20 transition-colors"><i data-lucide="' + icon + '" class="w-4 h-4"></i></button>';
}

function hubVocabRow(entry) {
    const v = entry || { term: '', def: '', example: '', example2: '' };
    return '<div data-row="vocab" class="flex gap-2 items-start">'
        + '<input type="text" data-field="term" value="' + hubEsc(v.term) + '" placeholder="term" class="' + HUB_INPUT_CLASS + ' flex-1">'
        + '<input type="text" data-field="def" value="' + hubEsc(v.def) + '" placeholder="definició" class="' + HUB_INPUT_CLASS + ' flex-1">'
        + '<input type="text" data-field="example" value="' + hubEsc(v.example) + '" placeholder="example sentence" class="' + HUB_INPUT_CLASS + ' flex-[2]">'
        + '<input type="text" data-field="example2" value="' + hubEsc(v.example2) + '" placeholder="second example (optional)" class="' + HUB_INPUT_CLASS + ' flex-[2]">'
        + hubRowButton('remove-row', 'trash-2', 'Remove this word')
        + '</div>';
}

function hubProductRow(entry) {
    const p = entry || { type: '', desc: '', url: '' };
    return '<div data-row="product" class="flex gap-2 items-start">'
        + '<input type="text" data-field="type" value="' + hubEsc(p.type) + '" placeholder="Written Task" class="' + HUB_INPUT_CLASS + ' flex-1">'
        + '<input type="text" data-field="desc" value="' + hubEsc(p.desc) + '" placeholder="what students do" class="' + HUB_INPUT_CLASS + ' flex-[2]">'
        + '<input type="text" data-field="url" value="' + hubEsc(p.url) + '" placeholder="https://classroom.google.com/..." class="' + HUB_INPUT_CLASS + ' flex-[2]">'
        + hubRowButton('remove-row', 'trash-2', 'Remove this task')
        + '</div>';
}

function hubGrammarPointRow(entry) {
    const g = entry || { id: '', label: '' };
    return '<div data-row="grammarPoint" class="flex gap-2 items-start">'
        + '<input type="text" data-field="id" value="' + hubEsc(g.id) + '" placeholder="COND2_B1_01" class="' + HUB_INPUT_CLASS + ' flex-1 font-mono">'
        + '<input type="text" data-field="label" value="' + hubEsc(g.label) + '" placeholder="Second conditional" class="' + HUB_INPUT_CLASS + ' flex-[2]">'
        + hubRowButton('remove-row', 'trash-2', 'Remove this grammar point')
        + '</div>';
}

function hubSectionHead(title, note) {
    return '<h4 class="text-sm font-bold text-slate-900 dark:text-white">' + hubEsc(title)
        + (note ? ' <span class="font-normal text-slate-400">' + hubEsc(note) + '</span>' : '') + '</h4>';
}

function hubAddButton(action, label) {
    return '<button type="button" data-action="' + action + '" class="text-sm font-semibold text-blue-600 '
        + 'dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5">'
        + '<i data-lucide="plus" class="w-4 h-4"></i>' + hubEsc(label) + '</button>';
}

function hubEditorMarkup(unit) {
    const student = unit.student || {};
    const teacher = unit.teacher || {};
    const vocab = unit.vocab || [];
    const products = student.products || [];
    const grammarPoints = unit.grammarPoints || [];

    return [
        '<div class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">',
        '<div class="bg-slate-50 dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col border border-slate-200 dark:border-slate-800">',

        '<div class="px-7 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">',
        '<div>',
        '<p class="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Editing unit ' + hubEsc(unit.id) + '</p>',
        '<h3 class="text-xl font-bold text-slate-900 dark:text-white">' + hubEsc(unit.title) + '</h3>',
        '</div>',
        '<button type="button" data-action="close" class="p-2 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"><i data-lucide="x"></i></button>',
        '</div>',

        '<div class="flex-1 overflow-y-auto px-7 py-6 space-y-7">',

        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
        hubField('Title', 'title', unit.title),
        hubField('Short title', 'shortTitle', unit.shortTitle),
        hubField('Grammar focus', 'grammar', unit.grammar),
        hubField('Lucide icon', 'icon', unit.icon),
        '</div>',

        '<div class="space-y-3">',
        hubSectionHead('Student view'),
        hubField('Repte', 'student.repte', student.repte, 3),
        '</div>',

        '<div class="space-y-3">',
        hubSectionHead('Final products', '(the link opens from Teacher Mode)'),
        '<div data-list="products" class="space-y-2">',
        products.map(hubProductRow).join(''),
        '</div>',
        hubAddButton('add-product', 'Add a task'),
        '</div>',

        '<div class="space-y-3">',
        hubSectionHead('Vocabulary'),
        '<div data-list="vocab" class="space-y-2">',
        vocab.map(hubVocabRow).join(''),
        '</div>',
        hubAddButton('add-vocab', 'Add a word'),
        '</div>',

        '<div class="space-y-3">',
        hubSectionHead('Grammar points', '(ids from the ESL Grammar Studio sheet)'),
        '<div data-list="grammarPoints" class="space-y-2">',
        grammarPoints.map(hubGrammarPointRow).join(''),
        '</div>',
        hubAddButton('add-grammar', 'Add a grammar point'),
        '</div>',

        '<div class="space-y-4 p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">',
        hubSectionHead('Teacher view', '(never rendered for students)'),
        hubField('Repte', 'teacher.repte', teacher.repte, 3),
        hubField('Competencies', 'teacher.competencies', teacher.competencies),
        hubField('Methodology', 'teacher.methodology', teacher.methodology, 2),
        hubField('Assessment', 'teacher.assessment', teacher.assessment, 2),
        '</div>',

        '<div data-panel="token" class="hidden space-y-3 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40">',
        '<h4 class="text-sm font-bold text-amber-900 dark:text-amber-300">A GitHub token is needed to save</h4>',
        '<p class="text-sm text-amber-800/90 dark:text-amber-200/80 leading-relaxed">',
        'Create a fine-grained token with <strong>Contents: Read and write</strong> on <strong>English-Hub</strong> only, then paste it here. ',
        'It stays in this tab for this session and is never saved to the site. ',
        '<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener" class="underline font-semibold">Create one</a>.',
        '</p>',
        '<input type="password" data-field="token" placeholder="github_pat_..." autocomplete="off" class="' + HUB_INPUT_CLASS + '">',
        '</div>',

        '</div>',

        '<div class="px-7 py-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">',
        '<p data-role="status" class="text-sm text-slate-500 dark:text-slate-400 min-h-[1.25rem]"></p>',
        '<div class="flex items-center gap-3 shrink-0">',
        '<button type="button" data-action="close" class="px-4 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>',
        '<button type="button" data-action="save" class="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">',
        '<i data-lucide="git-commit" class="w-4 h-4"></i>Save to GitHub</button>',
        '</div>',
        '</div>',

        '</div>',
        '</div>'
    ].join('');
}

function hubEditorRoot() {
    let root = document.getElementById('hubEditorRoot');
    if (!root) {
        root = document.createElement('div');
        root.id = 'hubEditorRoot';
        document.body.appendChild(root);
    }
    return root;
}

function hubEditorClose() {
    hubEditingUnitId = null;
    hubEditorRoot().innerHTML = '';
}

function hubEditorStatus(message, tone) {
    const el = hubEditorRoot().querySelector('[data-role="status"]');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'text-sm min-h-[1.25rem] ' + (
        tone === 'error' ? 'text-rose-600 dark:text-rose-400 font-medium'
        : tone === 'ok' ? 'text-emerald-600 dark:text-emerald-400 font-medium'
        : 'text-slate-500 dark:text-slate-400'
    );
}

function hubReadRows(root, list, fields) {
    const rows = root.querySelectorAll('[data-list="' + list + '"] [data-row]');
    const out = [];
    rows.forEach(function (row) {
        const entry = {};
        let filled = false;
        fields.forEach(function (name) {
            const input = row.querySelector('[data-field="' + name + '"]');
            const value = input ? input.value.trim() : '';
            entry[name] = value;
            if (value) filled = true;
        });
        if (filled) out.push(entry);   // drop rows left entirely blank
    });
    return out;
}

// Pulls the form back into a unit object, leaving untouched keys (theme,
// gradient, id) exactly as they were.
function hubReadForm(root, original) {
    const value = function (name) {
        const el = root.querySelector('[data-field="' + name + '"]');
        return el ? el.value.trim() : '';
    };

    const updated = Object.assign({}, original);
    updated.title = value('title');
    updated.shortTitle = value('shortTitle');
    updated.grammar = value('grammar');
    updated.icon = value('icon');
    updated.vocab = hubReadRows(root, 'vocab', ['term', 'def', 'example', 'example2']);
    updated.grammarPoints = hubReadRows(root, 'grammarPoints', ['id', 'label']);

    updated.student = Object.assign({}, original.student, {
        repte: value('student.repte'),
        products: hubReadRows(root, 'products', ['type', 'desc', 'url'])
    });

    updated.teacher = Object.assign({}, original.teacher, {
        repte: value('teacher.repte'),
        competencies: value('teacher.competencies'),
        methodology: value('teacher.methodology'),
        assessment: value('teacher.assessment')
    });

    return updated;
}

function hubEditorSave() {
    const root = hubEditorRoot();
    const config = hubEditorConfig;
    const units = config.getUnits();
    const index = units.findIndex(function (u) { return u.id === hubEditingUnitId; });
    if (index === -1) { hubEditorStatus('That unit is no longer loaded. Reload the page.', 'error'); return; }

    const tokenPanel = root.querySelector('[data-panel="token"]');
    const tokenInput = root.querySelector('[data-field="token"]');
    const typed = tokenInput ? tokenInput.value.trim() : '';
    if (typed) hubSetGithubToken(typed);

    if (!hubGithubToken()) {
        tokenPanel.classList.remove('hidden');
        tokenPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (tokenInput) tokenInput.focus();
        hubEditorStatus('Paste a GitHub token, then save again.', 'error');
        return;
    }

    const updated = hubReadForm(root, units[index]);
    if (!updated.title) { hubEditorStatus('A unit needs a title.', 'error'); return; }

    const next = units.slice();
    next[index] = updated;

    const saveBtn = root.querySelector('[data-action="save"]');
    if (saveBtn) saveBtn.disabled = true;
    hubEditorStatus('Committing to GitHub...');

    const message = 'Update ' + config.path + ': unit ' + updated.id + ' (' + updated.title + ')';

    hubCommitUnits(config.path, next, message).then(function () {
        config.setUnits(next);
        if (config.onChange) config.onChange();
        hubEditorClose();
        hubToast('Saved. GitHub Pages usually redeploys within a minute.');
    }).catch(function (err) {
        if (saveBtn) saveBtn.disabled = false;
        const text = (err && err.message) || 'The commit failed.';
        hubEditorStatus(text, 'error');
        // A rejected token is worth forgetting so the next save re-prompts.
        if (text.indexOf('rejected the token') !== -1) {
            hubClearGithubToken();
            if (tokenPanel) tokenPanel.classList.remove('hidden');
        }
    });
}

function hubToast(message) {
    const el = document.createElement('div');
    el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-5 py-3 rounded-2xl '
        + 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium shadow-2xl';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 4500);
}

function hubEditUnit(unitId) {
    if (!hubEditorConfig || !hubIsSignedIn()) return;

    const unit = hubEditorConfig.getUnits().find(function (u) { return u.id === unitId; });
    if (!unit) return;

    hubEditingUnitId = unitId;
    const root = hubEditorRoot();
    root.innerHTML = hubEditorMarkup(unit);

    // Assigned, not added: reopening the editor must not stack a second
    // handler on the same root and fire every action twice.
    root.onclick = function (event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const action = button.getAttribute('data-action');

        if (action === 'close') hubEditorClose();
        else if (action === 'save') hubEditorSave();
        else if (action === 'remove-row') { button.closest('[data-row]').remove(); }
        else if (action === 'add-vocab' || action === 'add-product' || action === 'add-grammar') {
            const listName = action === 'add-vocab' ? 'vocab'
                : action === 'add-product' ? 'products' : 'grammarPoints';
            const rowHtml = action === 'add-vocab' ? hubVocabRow()
                : action === 'add-product' ? hubProductRow() : hubGrammarPointRow();
            const list = root.querySelector('[data-list="' + listName + '"]');
            list.insertAdjacentHTML('beforeend', rowHtml);
            if (window.lucide) lucide.createIcons();
            const added = list.lastElementChild.querySelector('input');
            if (added) added.focus();
        }
    };

    if (window.lucide) lucide.createIcons();
}
