window.BlueAuth = {
    init: function() {
        this.injectStyles();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.injectHTML());
        } else {
            this.injectHTML();
        }
        
        window.sbClient = supabase.createClient(
            'https://zuzvozgjsppkxvdlptmk.supabase.co', 
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enZvemdqc3Bwa3h2ZGxwdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTM2MTYsImV4cCI6MjA5NTQ2OTYxNn0.M-g00y8s9FYwzzVg2mqJoazwQkOsk35gukoOqDZ32r0'
        );

        window.sbClient.auth.onAuthStateChange((event, session) => {
            this.updateUI(session);
        });
    },

    injectStyles: function() {
        if (document.getElementById('blue-auth-styles')) return;
        const style = document.createElement('style');
        style.id = 'blue-auth-styles';
        style.innerHTML = `
            .header-wrapper { height: 90px; background: var(--irina-gradient); display: flex; align-items: center; justify-content: space-between; padding: 0 45px; flex-shrink: 0; color: white; font-family: 'Montserrat', sans-serif; }
            .brand-left { display: flex; flex-direction: column; }
            .blue-lab-text { font-weight: 900; font-size: 26px; }
            .blueprint-subtext { font-weight: 700; font-size: 11px; text-transform: uppercase; }
            .vincha-title { font-weight: 900; font-size: 24px; text-transform: uppercase; background: white; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: var(--irina-gradient); filter: drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white); }
            .auth-zone { display: flex; align-items: center; gap: 15px; }
            
            .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; }
            .modal-content { background:white; padding:30px; border-radius:20px; text-align:center; max-width:400px; color:#333; }
            .google-btn { background:#4285f4; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:bold; }
            .auth-btn { background:#fff; color:#bc8abf; border:none; padding:8px 15px; border-radius:9px; cursor:pointer; font-size:12px; font-weight:700; }
            .user-profile { display:flex; align-items:center; gap:10px; font-size:12px; }
            .user-avatar { width:30px; height:30px; border-radius:50%; border: 2px solid white; object-fit: cover; }
            .user-name-display { font-weight: 600; margin-right: 5px; }
        `;
        document.head.appendChild(style);
    },

    injectHTML: function() {
        const target = document.getElementById('blue-header');
        if (!target) {
            console.warn("BlueAuth: No se encontró el contenedor #blue-header.");
            return;
        }
        
        target.innerHTML = `
            <div class="header-wrapper">
                <div class="brand-left">
                    <span class="blue-lab-text">BLUE LAB</span>
                    <span class="blueprint-subtext">Blueprint Integrations Lab</span>
                </div>
                <div class="vincha-title">Irina Hire Selection</div>
                <div class="auth-zone">
                    <button id="loginBtn" class="auth-btn" onclick="document.getElementById('loginModal').style.display='flex'">ACCEDER</button>
                    <div id="userZone" style="display:none;" class="user-profile">
                        <img id="userAvatar" class="user-avatar" src="">
                        <span id="userNameDisplay" class="user-name-display"></span>
                        <button class="auth-btn" onclick="window.sbClient.auth.signOut()">SALIR</button>
                    </div>
                </div>
            </div>
            <div id="loginModal" class="modal">
                <div class="modal-content">
                    <h2>BlueLab Acceso</h2>
                    <button class="google-btn" onclick="window.BlueAuth.login()">INGRESAR CON GOOGLE</button>
                </div>
            </div>
        `;
    },

    login: async function() {
        await window.sbClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
    },

    updateUI: function(session) {
        const loginBtn = document.getElementById('loginBtn');
        const userZone = document.getElementById('userZone');
        const nameSpan = document.getElementById('userNameDisplay');
        const avatarImg = document.getElementById('userAvatar');

        if (session) {
            localStorage.setItem('applicantId', session.user.id);
            if(loginBtn) loginBtn.style.display = 'none';
            if(userZone) {
                userZone.style.display = 'flex';
                if(avatarImg) avatarImg.src = session.user.user_metadata.avatar_url || '';
                if(nameSpan) nameSpan.innerText = session.user.user_metadata.full_name || '';
            }
        } else {
            localStorage.removeItem('applicantId');
            if(loginBtn) loginBtn.style.display = 'block';
            if(userZone) userZone.style.display = 'none';
        }
    }
};
window.BlueAuth.init();
