// auth-module.js
window.BlueAuth = {
    init: function() {
        // 1. Inyectar CSS y HTML necesario al cargar la página
        this.injectStyles();
        this.injectHTML();
        
        // 2. Inicializar Supabase
        window.sbClient = supabase.createClient(
            'https://zuzvozgjsppkxvdlptmk.supabase.co', 
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enZvemdqc3Bwa3h2ZGxwdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTM2MTYsImV4cCI6MjA5NTQ2OTYxNn0.M-g00y8s9FYwzzVg2mqJoazwQkOsk35gukoOqDZ32r0'
        );

        // 3. Escuchar sesión
        window.sbClient.auth.onAuthStateChange((event, session) => {
            this.updateUI(session);
        });
    },

    injectStyles: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; }
            .modal-content { background:white; padding:30px; border-radius:20px; text-align:center; max-width:400px; }
            .google-btn { background:#4285f4; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; }
            .user-profile { display:flex; align-items:center; gap:10px; }
            .user-avatar { width:40px; height:40px; border-radius:50%; }
        `;
        document.head.appendChild(style);
    },

    injectHTML: function() {
        const container = document.createElement('div');
        container.innerHTML = `
            <button id="loginBtn" onclick="document.getElementById('loginModal').style.display='flex'">ACCEDER</button>
            <div id="userZone" style="display:none;" class="user-profile">
                <img id="userAvatar" class="user-avatar" src="">
                <span id="userName"></span>
                <button onclick="window.sbClient.auth.signOut()">SALIR</button>
            </div>
            <div id="loginModal" class="modal">
                <div class="modal-content">
                    <h2>BlueLab Acceso</h2>
                    <button class="google-btn" onclick="window.BlueAuth.login()">INGRESAR CON GOOGLE</button>
                </div>
            </div>
        `;
        document.body.prepend(container);
    },

    login: async function() {
        await window.sbClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    },

    updateUI: function(session) {
        const loginBtn = document.getElementById('loginBtn');
        const userZone = document.getElementById('userZone');
        if (session) {
            localStorage.setItem('applicantId', session.user.id);
            loginBtn.style.display = 'none';
            userZone.style.display = 'flex';
            document.getElementById('userName').innerText = session.user.user_metadata.full_name;
            document.getElementById('userAvatar').src = session.user.user_metadata.avatar_url;
        } else {
            localStorage.removeItem('applicantId');
        }
    }
};

// Auto-inicializar al cargar
BlueAuth.init();
