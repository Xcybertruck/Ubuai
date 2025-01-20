document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const toggleCodeViewBtn = document.getElementById('toggleCodeView');
    const toggleHistoryBtn = document.getElementById('toggleHistory');
    const saveStateBtn = document.getElementById('saveState');
    const codeView = document.getElementById('codeView');
    const historyView = document.getElementById('history');
    const historyList = document.getElementById('historyList');
    const gifInput = document.getElementById('gifInput');
    const gifPreview = document.getElementById('gifPreview');
    const functionCodeElement = document.getElementById('functionCode');
    const eventHandlerCodeElement = document.getElementById('eventHandlerCode');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLoginBtn = document.getElementById('toggleLogin');
    const toggleSignupBtn = document.getElementById('toggleSignup');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const toggleSettingsBtn = document.getElementById('toggleSettings');
    const settings = document.getElementById('settings');
    const editBioBtn = document.getElementById('editBio');
    const saveBioBtn = document.getElementById('saveBio');
    const changeUsernameBtn = document.getElementById('changeUsername');
    const useBiometrics = document.getElementById('useBiometrics');
    const themeToggle = document.getElementById('themeToggle');
    const toggleAdminPanelBtn = document.getElementById('toggleAdminPanel');
    const adminPanel = document.getElementById('adminPanel');
    const editSiteBtn = document.getElementById('editSite');
    const bioEdit = document.getElementById('bioEdit');
    const passwordReset = document.getElementById('passwordReset');
    const resetPasswordBtn = document.getElementById('resetPassword');
    const logoLoader = document.getElementById('logoLoader');
    const logoImage = document.getElementById('logoImage');
    const body = document.body;

    let shapes = [];
    let showCode = false;
    let showHistory = false;
    let stateId = 1;
    let currentGif = null;
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    let currentUser = localStorage.getItem('currentUser');

    // Function to apply changes to shapes and GIF if present
    function applyShapeChange() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (currentGif) {
            ctx.drawImage(currentGif, 0, 0, canvas.width, canvas.height);
        }

        shapes.forEach(shape => {
            ctx.fillStyle = shape.color;
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Event handler for adding a shape
    function addShape() {
        shapes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 50 + 10,
            color: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
        });
        applyShapeChange();
    }

    // Save the current state to localStorage and history UI
    function saveCurrentState() {
        const state = {
            id: stateId++,
            shapes: [...shapes],
            gif: currentGif ? currentGif.src : null
        };
        localStorage.setItem(`state_${state.id}`, JSON.stringify(state));
        
        const historyItem = document.createElement('div');
        historyItem.textContent = `State ${state.id}`;
        historyItem.className = 'history-item';
        historyItem.addEventListener('click', () => loadState(state.id));
        historyList.appendChild(historyItem);

        if (!showHistory) {
            toggleHistoryBtn.click();
        }
    }

    // Load a saved state from localStorage
    function loadState(id) {
        const state = JSON.parse(localStorage.getItem(`state_${id}`));
        if (state) {
            shapes = state.shapes;
            if (state.gif) {
                const img = new Image();
                img.onload = () => {
                    currentGif = img;
                    applyShapeChange();
                };
                img.src = state.gif;
            } else {
                currentGif = null;
                applyShapeChange();
            }
        }
    }

    // Handle GIF upload
    gifInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type === 'image/gif') {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    gifPreview.src = event.target.result;
                    gifPreview.style.display = 'block';
                    currentGif = img;
                    applyShapeChange();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Toggle code visibility
    toggleCodeViewBtn.addEventListener('click', function() {
        showCode = !showCode;
        codeView.style.display = showCode ? 'block' : 'none';
        if (showCode) {
            functionCodeElement.textContent = applyShapeChange.toString();
            eventHandlerCodeElement.textContent = addShape.toString();
        }
    });

    // Toggle history visibility
    toggleHistoryBtn.addEventListener('click', function() {
        showHistory = !showHistory;
        historyView.style.display = showHistory ? 'block' : 'none';
    });

    // Save current state
    saveStateBtn.addEventListener('click', saveCurrentState);

    // Add shape when canvas is clicked
    canvas.addEventListener('click', addShape);

    // Login and Signup functionality
    function showForm(form) {
        form.style.display = 'block';
    }

    function hideAllForms() {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
    }

    toggleLoginBtn.addEventListener('click', () => showForm(loginForm));
    toggleSignupBtn.addEventListener('click', () => showForm(signupForm));

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        if (users[username] && users[username].password === password) {
            localStorage.setItem('currentUser', username);
            hideAllForms();
            currentUser = username;
            checkAgreement(username);
        } else {
            alert('Invalid credentials');
        }
    });

    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        if (!users[username]) {
            users[username] = { password: password, ipAddresses: [], agreementAccepted: false };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            hideAllForms();
            currentUser = username;
            checkAgreement(username);
        } else {
            alert('Username already exists');
        }
    });

    // User Agreement
    function checkAgreement(username) {
        if (!users[username].agreementAccepted) {
            if (confirm('Do you agree to our terms against violent content?')) {
                users[username].agreementAccepted = true;
                localStorage.setItem('users', JSON.stringify(users));
                return true;
            }
            return false;
        }
        return true;
    }

    // Bio editing
    editBioBtn.addEventListener('click', function() {
        const user = users[currentUser];
        document.getElementById('bioContent').value = user.bio || '';
        document.getElementById('socialLink1').value = user.socialLinks ? user.socialLinks[0] || '' : '';
        document.getElementById('socialLink2').value = user.socialLinks ? user.socialLinks[1] || '' : '';
        bioEdit.style.display = 'block';
    });

    saveBioBtn.addEventListener('click', function() {
        const user = users[currentUser];
        user.bio = document.getElementById('bioContent').value;
        user.socialLinks = [document.getElementById('socialLink1').value, document.getElementById('socialLink2').value];
        localStorage.setItem('users', JSON.stringify(users));
        bioEdit.style.display = 'none';
    });

    // Username change restriction
    changeUsernameBtn.addEventListener('click', function() {
        const user = users[currentUser];
        const lastChange = localStorage.getItem(`${currentUser}_usernameChange`) || 0;
        const now = Date.now();
        if (now - lastChange > 30 * 24 * 60 * 60 * 1000) { // 30 days in milliseconds
            const newUsername = prompt('Enter new username:');
            if (newUsername && !users[newUsername]) {
                delete users[currentUser];
                users[newUsername] = user;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', newUsername);
                localStorage.setItem(`${newUsername}_usernameChange`, now);
                currentUser = newUsername;
                alert('Username changed successfully.');
            } else {
                alert('Username already exists or invalid.');
            }
        } else {
            alert('You can only change your username once every 30 days.');
        }
    });

    // Biometrics for login (placeholder)
    useBiometrics.addEventListener('change', function() {
        const user = users[currentUser];
        user.useBiometrics = this.checked;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Biometric settings updated. This is just a placeholder; in real scenarios, use platform-specific APIs.');
    });

    // Theme toggle
    function setTheme(isDark) {
        if (isDark) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    const savedTheme = localStorage.getItem('theme');
    themeToggle.checked = savedTheme === 'dark';
    setTheme(themeToggle.checked);

    themeToggle.addEventListener('change', function(e) {
        setTheme(e.target.checked);
    });

    // Admin panel (for simplicity, admin check is just a hardcoded username)
    toggleAdminPanelBtn.addEventListener('click', function() {
        if (currentUser === 'admin') { // Replace with proper admin verification
            adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
        } else {
            alert('You do not have admin privileges.');
        }
    });

    editSiteBtn.addEventListener('click', function() {
        alert('Site edit functionality would go here. Admins can edit site content, settings, etc.');
    });

    // Password Reset (placeholder)
    resetPasswordBtn.addEventListener('click', function() {
        const newPassword = document.getElementById('newPassword').value;
        if (newPassword) {
            users[currentUser].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            passwordReset.style.display = 'none';
            alert('Password reset successfully.');
        }
    });

    // Logo Loader
    if (localStorage.getItem('userLogo')) {
        logoImage.src = localStorage.getItem('userLogo');
    }

    if (localStorage.getItem('showLoader') === 'false') {
        logoLoader.style.display = 'none';
    } else {
        setTimeout(() => logoLoader.style.display = 'none', 2000); // Show loader for 2 seconds
    }

    document.getElementById('userLogo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoImage.src = event.target.result;
                localStorage.setItem('userLogo', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('showLoader').addEventListener('change', function(e) {
        localStorage.setItem('showLoader', !e.target.checked);
    });

    // Initial draw
    applyShapeChange();

    // Load existing history from localStorage on page load
    for (let i = 1; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('state_')) {
            const state = JSON.parse(localStorage.getItem(key));
            const historyItem = document.createElement('div');
            historyItem.textContent = `State ${state.id}`;
            historyItem.className = 'history-item';
            historyItem.addEventListener('click', () => loadState(state.id));
            historyList.appendChild(historyItem);
            stateId = Math.max(stateId, state.id + 1);
        }
    }
});