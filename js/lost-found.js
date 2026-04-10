/* lost-found.js - Lost & Found Logic */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = DB.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Dynamic Back button based on role
    document.getElementById('back-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser.role === 'admin') window.location.href = 'admin.html';
        else if (currentUser.role === 'security') window.location.href = 'security.html';
        else window.location.href = 'student.html';
    });

    const itemsList = document.getElementById('items-list');

    function renderItems() {
        const items = DB.getLostFound();
        itemsList.innerHTML = '';

        if (items.length === 0) {
            itemsList.innerHTML = '<p class="text-center text-muted">No items reported.</p>';
            return;
        }

        items.reverse().forEach(item => {
            const card = document.createElement('div');
            card.className = 'card mb-2';
            
            // Allow removal if current user is the reporter OR if current user is admin/security
            const canRemove = (item.reporterId === currentUser.id) || (currentUser.role === 'admin') || (currentUser.role === 'security');

            let descriptionHtml = item.description;
            if (item.resolved) {
                descriptionHtml = `<s>${item.description}</s> <span style="color: var(--success); font-size: 0.9rem;">(Founded by ${item.resolvedBy})</span>`;
            }

            card.innerHTML = `
                <div class="flex justify-between align-center mb-1">
                    <span class="badge ${item.type === 'lost' ? 'badge-danger' : 'badge-success'}">
                        ${item.type.toUpperCase()}
                    </span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(item.date).toLocaleDateString()}</span>
                </div>
                <p class="mb-1" style="font-size: 1.1rem;">${descriptionHtml}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">
                    Reported by: ${item.reporterName} (Phone: ${item.reporterPhone})
                </p>
                ${(canRemove && !item.resolved) ? `<button class="btn-secondary btn-small mt-2" onclick="resolveItem('${item.id}')" style="width:auto;">Mark as Found</button>` : ''}
            `;
            itemsList.appendChild(card);
        });
    }

    document.getElementById('report-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.querySelector('input[name="item-type"]:checked').value;
        const description = document.getElementById('item-desc').value.trim();
        const msgDiv = document.getElementById('report-msg');

        if (!description) return;

        const items = DB.getLostFound();
        const newItem = {
            id: DB.generateId(),
            type: type, // 'lost' or 'found'
            description: description,
            reporterId: currentUser.id,
            reporterName: currentUser.name,
            reporterPhone: currentUser.phone,
            date: new Date().toISOString()
        };

        items.push(newItem);
        DB.setLostFound(items);

        msgDiv.textContent = 'Post added to the community board!';
        msgDiv.className = 'alert alert-success';
        msgDiv.classList.remove('hidden');

        document.getElementById('report-item-form').reset();
        renderItems();

        setTimeout(() => msgDiv.classList.add('hidden'), 3000);
    });

    window.resolveItem = function(itemId) {
        if(confirm("Are you sure you want to mark this item as found?")) {
            let items = DB.getLostFound();
            const index = items.findIndex(i => i.id === itemId);
            if(index > -1) {
                items[index].resolved = true;
                items[index].resolvedBy = currentUser.name;
                DB.setLostFound(items);
                renderItems();
            }
        }
    };

    renderItems();
});
