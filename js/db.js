/* db.js - State Management Simulation */

const initialUsers = [
    { id: 'admin1', phone: '0000000000', password: 'admin', role: 'admin', status: 'approved', name: 'Super Admin', idCard: 'ADMIN001' }
];

function initDB() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem('parcels')) {
        localStorage.setItem('parcels', JSON.stringify([]));
    }
    if (!localStorage.getItem('lostFound')) {
        localStorage.setItem('lostFound', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', null);
    }
}

// Init immediately
initDB();

const DB = {
    getUsers: () => JSON.parse(localStorage.getItem('users')),
    setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    
    getParcels: () => JSON.parse(localStorage.getItem('parcels')),
    setParcels: (parcels) => localStorage.setItem('parcels', JSON.stringify(parcels)),
    
    getLostFound: () => JSON.parse(localStorage.getItem('lostFound')),
    setLostFound: (items) => localStorage.setItem('lostFound', JSON.stringify(items)),
    
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
    setCurrentUser: (user) => localStorage.setItem('currentUser', JSON.stringify(user)),
    
    logout: () => {
        localStorage.setItem('currentUser', null);
        window.location.href = 'index.html';
    },

    generateId: () => '_' + Math.random().toString(36).substr(2, 9)
};
