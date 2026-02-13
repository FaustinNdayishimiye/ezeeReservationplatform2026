/**
 * Ezee Reservation System - Frontend Auth Simulation
 * 
 * Uses localStorage to simulate a database and session management.
 * 
 * SECURITY WARNING: 
 * This is for demonstration purposes only. 
 * specific user data is stored in plain text in the browser.
 */

const AUTH_KEYS = {
    USERS: 'ezee_users',
    SESSION: 'ezee_session'
};

const Auth = {
    /**
     * Initialize with a default admin if none exist
     */
    init: function() {
        const users = this.getUsers();
        if (users.length === 0) {
            // Create default admin
            this.signup('Admin User', 'admin@ezee.com', 'admin123');
            console.log('Default admin created: admin@ezee.com / admin123');
        }
    },

    /**
     * Get all registered users from localStorage
     */
    getUsers: function() {
        const usersJSON = localStorage.getItem(AUTH_KEYS.USERS);
        return usersJSON ? JSON.parse(usersJSON) : [];
    },

    /**
     * Save users to localStorage
     */
    saveUsers: function(users) {
        localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    },

    /**
     * Register a new user
     */
    signup: function(name, email, password) {
        const users = this.getUsers();
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // In production, this MUST be hashed
            role: 'admin',
            joined: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);
        
        return { success: true, message: 'Account created successfully' };
    },

    /**
     * Authenticate a user
     */
    login: function(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Create session (exclude password)
            const sessionUser = { ...user };
            delete sessionUser.password;
            
            localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    /**
     * Log out current user
     */
    logout: function() {
        localStorage.removeItem(AUTH_KEYS.SESSION);
        window.location.href = 'login.html';
    },

    /**
     * Get current logged in user
     */
    getCurrentUser: function() {
        const sessionJSON = localStorage.getItem(AUTH_KEYS.SESSION);
        return sessionJSON ? JSON.parse(sessionJSON) : null;
    },

    /**
     * Check if user is logged in, if not redirect to login
     * Call this at the top of protected pages
     */
    requireAuth: function() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
        }
        return user;
    }
};

// Initialize on load
Auth.init();
