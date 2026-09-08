/* ==========================================================================
   English Hub — teacher authentication (Google Sign-In)
   --------------------------------------------------------------------------
   This reuses the SAME Google OAuth client as PinPlay's student login, so
   there is no second client to keep in step. The client ID is public by
   design — it ships in the page and PinPlay serves it at
   https://api.pinplay.win/api/student/config

   ONE-TIME SETUP — the origin must be authorised or the button 400s:

     1. Open  https://console.cloud.google.com/apis/credentials
     2. Open the Web client ending  ...8aacskg99idu0uqnbr181id33gf8fet4
     3. Under "Authorised JavaScript origins" add:
            https://audiophrases.github.io
            http://localhost:8000          (only if you test locally)
        Leave PinPlay's existing origins alone — add, don't replace.

   To authorise another teacher later, add their address to HUB_ALLOWED_EMAILS.

   NOTE: this is a public static site, so this check runs in the browser and
   is a courtesy lock, not real security. Anyone who opens "View source" can
   read the teacher notes. Keep genuinely private material off this site.

   Sharing the client with PinPlay means a token minted there carries the same
   "aud", so the check below leans on HUB_ALLOWED_EMAILS to keep this to the
   teacher account. That is fine for a courtesy lock; it is not a keep-out.
   ========================================================================== */

const HUB_CLIENT_ID = '673678320233-8aacskg99idu0uqnbr181id33gf8fet4.apps.googleusercontent.com';

// Lowercase only - the address from Google is lowercased before it is compared.
const HUB_ALLOWED_EMAILS = [
    'eugenimonfort@iecomaruga.cat',
    'eugenime@gmail.com',
    'emonfor3@xtec.cat'
];

const HUB_AUTH_KEY = 'hubTeacherEmail';

/* -------------------------------------------------------------------------- */

function hubIsConfigured() {
    return typeof HUB_CLIENT_ID === 'string'
        && HUB_CLIENT_ID.endsWith('.apps.googleusercontent.com');
}

function hubSignedInEmail() {
    try { return sessionStorage.getItem(HUB_AUTH_KEY); } catch (e) { return null; }
}

function hubIsSignedIn() {
    const email = hubSignedInEmail();
    return !!email && HUB_ALLOWED_EMAILS.indexOf(email) !== -1;
}

function hubSignOut() {
    try { sessionStorage.removeItem(HUB_AUTH_KEY); } catch (e) {}
    if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }
    location.reload();
}

// Reads the payload out of the Google ID token (a JWT: header.payload.signature).
function hubDecodeJwt(token) {
    const part = String(token || '').split('.')[1];
    if (!part) return null;
    let b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    b64 += '='.repeat((4 - (b64.length % 4)) % 4);
    try {
        const json = decodeURIComponent(atob(b64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

function hubShowAuthError(message) {
    const box = document.getElementById('hubAuthError');
    if (box) {
        box.textContent = message;
        box.classList.remove('hidden');
    } else {
        alert(message);
    }
}

// Google calls this with the signed credential once the user picks an account.
function hubHandleCredential(response) {
    const payload = hubDecodeJwt(response && response.credential);

    if (!payload || payload.aud !== HUB_CLIENT_ID || payload.email_verified === false) {
        hubShowAuthError('That sign-in could not be verified. Please try again.');
        return;
    }

    const email = String(payload.email || '').toLowerCase();
    if (HUB_ALLOWED_EMAILS.indexOf(email) === -1) {
        hubShowAuthError(email
            ? email + ' is not authorised for Teacher Mode.'
            : 'That account is not authorised for Teacher Mode.');
        return;
    }

    try { sessionStorage.setItem(HUB_AUTH_KEY, email); } catch (e) {}
    if (typeof window.onHubAuthSuccess === 'function') window.onHubAuthSuccess(email);
}

// The GSI library loads async, so wait for it rather than assuming it is there.
function hubWhenGsiReady(onReady, onTimeout) {
    let waited = 0;
    (function check() {
        if (window.google && google.accounts && google.accounts.id) { onReady(); return; }
        waited += 100;
        if (waited >= 8000) { if (onTimeout) onTimeout(); return; }
        setTimeout(check, 100);
    })();
}

let hubGsiInitialised = false;

// Draws the real Google button into the element with the given id.
// Call it only once the container is visible — a hidden container renders 0px wide.
function hubRenderSignIn(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!hubIsConfigured()) {
        container.innerHTML = '<p class="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">'
            + 'Google Sign-In is not set up yet.<br>Paste your OAuth Client ID into '
            + '<code class="font-mono text-xs">auth.js</code> to switch it on.</p>';
        return;
    }

    hubWhenGsiReady(function () {
        if (!hubGsiInitialised) {
            google.accounts.id.initialize({
                client_id: HUB_CLIENT_ID,
                callback: hubHandleCredential,
                auto_select: false,
                cancel_on_tap_outside: true
            });
            hubGsiInitialised = true;
        }
        container.innerHTML = '';
        google.accounts.id.renderButton(container, options || {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: 260
        });
    }, function () {
        container.innerHTML = '<p class="text-sm text-rose-600 dark:text-rose-400">'
            + 'Could not reach Google Sign-In. Check the connection and reload.</p>';
    });
}
