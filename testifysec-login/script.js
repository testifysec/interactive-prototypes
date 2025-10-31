document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const signinBtn = document.querySelector('.signin-btn');
    const githubBtn = document.getElementById('githubBtn');
    const gitlabBtn = document.getElementById('gitlabBtn');
    const googleBtn = document.getElementById('googleBtn');

    function showError(input, message) {
        input.classList.add('error');
        
        let errorMsg = input.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            input.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    function clearError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    togglePasswordBtn.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
        if (isPassword) {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <path d="M21 4L3 22"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    });

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
        });

        input.addEventListener('blur', function() {
            if (this === emailInput && this.value) {
                if (!validateEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                }
            }
            
            if (this === passwordInput && this.value) {
                if (!validatePassword(this.value)) {
                    showError(this, 'Password must be at least 6 characters long');
                }
            }
        });
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        [emailInput, passwordInput].forEach(clearError);

        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(passwordInput, 'Password must be at least 6 characters long');
            isValid = false;
        }

        if (isValid) {
            signinBtn.classList.add('loading');
            signinBtn.disabled = true;
            
            setTimeout(() => {
                signinBtn.classList.remove('loading');
                signinBtn.disabled = false;
                
                console.log('Email login successful, redirecting to platform...');
                redirectToLogin();
            }, 2000);
        }
    });

    function redirectToLogin() {
        window.location.href = 'https://web.platform.testifysec.com/';
    }

    function handleOAuthLogin(provider) {
        const btn = event.target.closest('.oauth-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = `
            <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
            </svg>
            Signing in...
        `;
        btn.disabled = true;
        
        setTimeout(() => {
            console.log(`Authenticating with ${provider}...`);
            redirectToLogin();
        }, 1500);
    }

    githubBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleOAuthLogin('GitHub');
    });

    gitlabBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleOAuthLogin('GitLab');
    });

    googleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleOAuthLogin('Google');
    });
});