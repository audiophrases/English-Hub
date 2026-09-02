const fs = require('fs');

function injectGoogleSignIn(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add GSI to <head>
    if (!content.includes('accounts.google.com/gsi/client')) {
        content = content.replace('</head>', '    <script src="https://accounts.google.com/gsi/client" async defer></script>\n</head>');
    }

    // 2. Add Modal to initApp
    if (!content.includes('gsiModal')) {
        const modalHtml = `
                    <!-- Google Sign-In Modal -->
                    <div id="gsiModal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                        <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-slate-200 dark:border-slate-800">
                            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i data-lucide="lock" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Teacher Login Required</h3>
                            <p class="text-slate-600 dark:text-slate-400 mb-6">Please sign in with your authorized Google account to access Teacher Mode.</p>
                            <div id="g_id_onload"
                                 data-client_id="YOUR_GOOGLE_CLIENT_ID"
                                 data-callback="handleCredentialResponse"
                                 data-auto_prompt="false">
                            </div>
                            <div class="g_id_signin flex justify-center mb-4" data-type="standard" data-size="large" data-theme="outline" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left"></div>
                            <button onclick="closeGsiModal()" class="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
                        </div>
                    </div>`;
        
        // Find where initApp sets app.innerHTML
        // A robust place is right before the closing </main> or </div> of app.innerHTML
        content = content.replace(/<\/div>\s*`;\s*renderGrid\(\);/, modalHtml + '\n                </div>\n            `;\n\n            renderGrid();');
    }

    // 3. Replace setView with auth logic
    if (!content.includes('isAuthenticatedTeacher')) {
        const oldSetView = `
        function setView(view) {
            if (currentView === view) return;
            currentView = view;
            updateToggleUI();
            renderGrid();
            renderResourceCorner();
            if (selectedUnit) {
                renderDrawerContent();
            }
        }`;

        const newAuthLogic = `
        let isAuthenticatedTeacher = sessionStorage.getItem('teacherAuth') === 'true';

        function handleCredentialResponse(response) {
            try {
                const payloadBase64 = response.credential.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
                
                if (payload.email === 'eugenimonfort@iecomaruga.cat') {
                    isAuthenticatedTeacher = true;
                    sessionStorage.setItem('teacherAuth', 'true');
                    closeGsiModal();
                    performSetView('teacher');
                } else {
                    alert('Access Denied: Unauthorized email address.');
                }
            } catch(e) {
                console.error('Error decoding JWT', e);
            }
        }

        function closeGsiModal() {
            const modal = document.getElementById('gsiModal');
            if(modal) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }
        }

        function setView(view) {
            if (view === 'teacher' && !isAuthenticatedTeacher) {
                const modal = document.getElementById('gsiModal');
                if(modal) {
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                }
                return;
            }
            performSetView(view);
        }

        function performSetView(view) {
            if (currentView === view) return;
            currentView = view;
            updateToggleUI();
            renderGrid();
            renderResourceCorner();
            if (selectedUnit) {
                renderDrawerContent();
            }
        }`;

        // Find setView using a regex since spaces might vary
        content = content.replace(/function setView\(view\) \{[\s\S]*?\n\s*\}/, newAuthLogic);
    }

    // 4. Update the URL link rendering to only show for teacher
    content = content.replace(/\$\{p\.url \? `/g, '${p.url && currentView === \'teacher\' ? `');

    fs.writeFileSync(filePath, content);
    console.log('Successfully updated with GSI: ' + filePath);
}

injectGoogleSignIn('C:/Users/Admin/English Hub/index.html');
injectGoogleSignIn('C:/Users/Admin/English Hub/3ESO/index.html');
