const fs = require('fs');

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add URL to all products in the units array
    content = content.replace(/type:\s*("[^"]+"),\s*desc:\s*("[^"]+")\s*}/g, 'type: $1, desc: $2, url: "https://classroom.google.com/h" }');

    const searchRegex = /<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">\s*<h4 class="font-bold text-lg text-slate-900 dark:text-white mb-2">\$\{p\.type\}<\/h4>\s*<p class="text-slate-600 dark:text-slate-400 leading-relaxed">\$\{p\.desc\}<\/p>\s*<\/div>/;

    const replacement = 
`<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h4 class="font-bold text-lg text-slate-900 dark:text-white mb-1">\${p.type}</h4>
                                            <p class="text-slate-600 dark:text-slate-400 leading-relaxed">\${p.desc}</p>
                                        </div>
                                        \${p.url ? \`
                                            <a href="\${p.url}" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all shadow-sm border border-blue-100 dark:border-blue-800 font-medium text-sm">
                                                <span>Open Task</span>
                                                <i data-lucide="external-link" class="w-4 h-4"></i>
                                            </a>
                                        \` : ''}
                                    </div>`;

    if(searchRegex.test(content)) {
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content);
        console.log('Successfully updated: ' + filePath);
    } else {
        console.log('Could not find the HTML chunk to replace in: ' + filePath);
    }
}

updateFile('C:/Users/Admin/English Hub/index.html');
updateFile('C:/Users/Admin/English Hub/3ESO/index.html');
