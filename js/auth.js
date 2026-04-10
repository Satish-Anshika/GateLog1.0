/* auth.js - Authentication & Registration Logic */
document.addEventListener('DOMContentLoaded', () => {
    
    // Auto redirect if already logged in
    const currentUser = DB.getCurrentUser();
    if (currentUser) {
        if(currentUser.role === 'admin') window.location.href = 'admin.html';
        else if(currentUser.role === 'student') window.location.href = 'student.html';
        else if(currentUser.role === 'security') window.location.href = 'security.html';
    }

    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    
    // Toggles
    document.getElementById('show-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Registration Handler
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.querySelector('input[name="reg-role"]:checked').value;
        const name = document.getElementById('reg-name').value.trim();
        const idCard = document.getElementById('reg-idcard').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const errorDiv = document.getElementById('register-error');

        if (!name || !idCard || !phone || !password) {
            errorDiv.textContent = "All fields are required.";
            errorDiv.classList.remove('hidden');
            return;
        }

        const users = DB.getUsers();
        // Check uniqueness of phone
        if (users.some(u => u.phone === phone)) {
            errorDiv.textContent = "This phone number is already registered.";
            errorDiv.classList.remove('hidden');
            return;
        }

        const newUser = {
            id: DB.generateId(),
            name,
            idCard,
            phone,
            password,
            role,
            status: 'pending' // Admin must approve
        };

        users.push(newUser);
        DB.setUsers(users);

        document.getElementById('register-form').reset();
        errorDiv.classList.add('hidden');
        
        // Show success in login
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        const loginSuccessDiv = document.getElementById('login-success');
        loginSuccessDiv.textContent = "Registration successful! Please wait for Admin approval before logging in.";
        loginSuccessDiv.classList.remove('hidden');
        
        setTimeout(()=> loginSuccessDiv.classList.add('hidden'), 5000);
    });

    // Login Handler
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('login-phone').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorDiv = document.getElementById('login-error');
        const successDiv = document.getElementById('login-success');
        
        successDiv.classList.add('hidden');

        const users = DB.getUsers();
        const user = users.find(u => u.phone === phone && u.password === password);

        if (!user) {
            errorDiv.textContent = "Invalid phone number or password.";
            errorDiv.classList.remove('hidden');
            return;
        }

        if (user.status !== 'approved') {
            errorDiv.textContent = "Your account is pending admin approval.";
            errorDiv.classList.remove('hidden');
            return;
        }

        errorDiv.classList.add('hidden');
        DB.setCurrentUser(user);

        // Redirect based on role
        if(user.role === 'admin') window.location.href = 'admin.html';
        else if(user.role === 'student') window.location.href = 'student.html';
        else if(user.role === 'security') window.location.href = 'security.html';
    });
});
