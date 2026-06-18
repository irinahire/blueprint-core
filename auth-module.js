window.BlueAuth = {
    init: function() {
        this.injectStyles();
        
        // Esperamos a que el DOM esté completamente cargado antes de inyectar
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
            .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; }
            .modal-content { background:white; padding:30px; border-radius:20px; text-align:center; max-width:400px; color:#333; }
            .google-btn { background:#4285f4; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:bold; }
            .auth-btn { background:#fff; color:#bc8abf; border:none; padding:8px 15px; border-radius:9px; cursor:pointer; font-size:12px; font-weight:700; }
            .user-profile { display:flex; align-items:center; gap:10px; color:white; font-size:12px; }
            .user-avatar { width:30px; height:30px; border-radius:50%; border: 2px solid white; }
        `;
        document.head.appendChild(style);
    },

    injectHTML: function() {
        // Prioridad absoluta: busca el ID 'auth-container'
        const target = document.getElementById('auth-container') || 
                       document.querySelector('.header') || 
                       document.querySelector('.top-vincha');
        
        if (!target) {
            console.warn("BlueAuth: No se encontró un contenedor para inyectar.");
            return;
        }
        
        target.innerHTML = `
            <button id="loginBtn" class="auth-btn" onclick="document.getElementById('loginModal').style.display='flex'">ACCEDER</button>
            <div id="userZone" style="display:none;" class="user-profile">
                <img id="userAvatar" class="user-avatar" src="">
                <button class="auth-btn" onclick="window.sbClient.auth.signOut()">SALIR</button>
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
        if (session) {
            localStorage.setItem('applicantId', session.user.id);
            if(loginBtn) loginBtn.style.display = 'none';
            if(userZone) {
                userZone.style.display = 'flex';
                document.getElementById('userAvatar').src = session.user.user_metadata.avatar_url || '';
            }
        } else {
            localStorage.removeItem('applicantId');
            if(loginBtn) loginBtn.style.display = 'block';
            if(userZone) userZone.style.display = 'none';
        }
    }
};
window.BlueAuth.init();
