/* security.js - Security Dashboard Logic */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = DB.getCurrentUser();
    if (!currentUser || currentUser.role !== 'security') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        DB.logout();
    });

    const parcelsList = document.getElementById('parcels-list');
    
    function renderParcels() {
        const parcels = DB.getParcels().filter(p => p.status === 'pending');
        parcelsList.innerHTML = '';

        if (parcels.length === 0) {
            parcelsList.innerHTML = '<p class="text-muted">No pending parcels.</p>';
            return;
        }

        parcels.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="flex justify-between align-center mb-1">
                    <h3 class="golden-text">${p.studentName}</h3>
                    <span class="badge badge-warning">${p.gate}</span>
                </div>
                <p><strong>Phone:</strong> ${p.phone}</p>
                <p><strong>Date LOG:</strong> ${new Date(p.date).toLocaleString()}</p>
                <p class="mt-1" style="font-size: 0.8rem; color: var(--text-muted);">Awaiting Pickup</p>
            `;
            parcelsList.appendChild(card);
        });
    }

    // Add Parcel
    document.getElementById('add-parcel-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('parcel-phone').value.trim();
        const name = document.getElementById('parcel-name').value.trim();
        const gate = document.getElementById('parcel-gate').value;
        const msgDiv = document.getElementById('parcel-msg');

        // Note: For simplicity, we just add the parcel using phone as the primary lookup.
        const parcels = DB.getParcels();
        
        // Generate a random Barcode ID for pickup verify
        const barcodeId = 'BAR-' + DB.generateId().substring(1, 7).toUpperCase();

        const newParcel = {
            id: DB.generateId(),
            phone: phone,
            studentName: name,
            gate: gate,
            status: 'pending', // 'pending' or 'delivered'
            date: new Date().toISOString(),
            barcodeId: barcodeId
        };

        parcels.push(newParcel);
        DB.setParcels(parcels);

        msgDiv.textContent = `Parcel logged successfully at ${gate}!`;
        msgDiv.className = 'alert alert-success';
        msgDiv.classList.remove('hidden');

        document.getElementById('add-parcel-form').reset();
        renderParcels();
        setTimeout(() => msgDiv.classList.add('hidden'), 3000);
    });

    // Verify Parcel
    document.getElementById('verify-parcel-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const barcode = document.getElementById('verify-barcode').value.trim();
        const msgDiv = document.getElementById('verify-msg');

        const parcels = DB.getParcels();
        const index = parcels.findIndex(p => p.barcodeId === barcode && p.status === 'pending');

        if (index > -1) {
            parcels[index].status = 'delivered';
            parcels[index].deliveredDate = new Date().toISOString();
            DB.setParcels(parcels);

            msgDiv.textContent = `Success! Parcel for ${parcels[index].studentName} marked as delivered.`;
            msgDiv.className = 'alert alert-success';
            document.getElementById('verify-parcel-form').reset();
            renderParcels();
        } else {
            msgDiv.textContent = "Invalid or expired Barcode.";
            msgDiv.className = 'alert alert-error';
        }
        msgDiv.classList.remove('hidden');
        setTimeout(() => msgDiv.classList.add('hidden'), 3000);
    });

    renderParcels();
});
