// UI related JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    const panels = document.querySelectorAll('.panel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show target panel, hide others
            panels.forEach(panel => {
                if (panel.id === target) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // Enhance table rows with status indicators
    function enhanceTableRows() {
        const rows = document.querySelectorAll('#citizens-table tbody tr');
        rows.forEach(row => {
            const civilStatusCell = row.cells[5];
            if (civilStatusCell) {
                const status = civilStatusCell.textContent.toLowerCase();
                if (status === 'married') {
                    civilStatusCell.innerHTML = `<span class="status-badge married"><i class="fas fa-heart"></i> Married</span>`;
                } else if (status === 'single') {
                    civilStatusCell.innerHTML = `<span class="status-badge single"><i class="fas fa-user"></i> Single</span>`;
                }
            }

            const genderCell = row.cells[4];
            if (genderCell) {
                const gender = genderCell.textContent.toLowerCase();
                if (gender === 'male') {
                    genderCell.innerHTML = `<span class="gender-badge male"><i class="fas fa-mars"></i> Male</span>`;
                } else if (gender === 'female') {
                    genderCell.innerHTML = `<span class="gender-badge female"><i class="fas fa-venus"></i> Female</span>`;
                }
            }
        });
    }

    // Add CSS for status badges
    const style = document.createElement('style');
    style.textContent = `
        .status-badge, .gender-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .status-badge.married {
            background-color: rgba(46, 204, 113, 0.1);
            color: #27ae60;
        }
        .status-badge.single {
            background-color: rgba(52, 152, 219, 0.1);
            color: #2980b9;
        }
        .gender-badge.male {
            background-color: rgba(52, 152, 219, 0.1);
            color: #2980b9;
        }
        .gender-badge.female {
            background-color: rgba(231, 76, 60, 0.1);
            color: #c0392b;
        }
        .btn-edit, .btn-delete {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
        }
    `;
    document.head.appendChild(style);

    // Override the displayCitizens function to add our enhancements
    const originalDisplayCitizens = window.displayCitizens;
    window.displayCitizens = function(citizens) {
        originalDisplayCitizens(citizens);
        enhanceTableRows();
        
        // Enhance action buttons
        const actionButtons = document.querySelectorAll('.btn-edit, .btn-delete');
        actionButtons.forEach(button => {
            if (button.classList.contains('btn-edit')) {
                button.innerHTML = `<i class="fas fa-edit"></i> Edit`;
            } else if (button.classList.contains('btn-delete')) {
                button.innerHTML = `<i class="fas fa-trash-alt"></i> Delete`;
            }
        });
    };

    // Add loading indicators
    const addLoadingIndicator = (element, message = 'Loading...') => {
        element.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> ${message}</div>`;
    };

    // Add notification system
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        });
    };

    // Add notification styles
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            background: white;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            padding: 1rem;
            z-index: 1000;
            max-width: 350px;
            animation: slideIn 0.3s ease;
        }
        .notification.hide {
            animation: slideOut 0.3s ease forwards;
        }
        .notification-icon {
            margin-right: 0.75rem;
            font-size: 1.25rem;
        }
        .notification.success .notification-icon {
            color: var(--success-color);
        }
        .notification.error .notification-icon {
            color: var(--danger-color);
        }
        .notification-message {
            flex: 1;
        }
        .notification-close {
            background: none;
            border: none;
            color: var(--text-lighter);
            cursor: pointer;
            padding: 0.25rem;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .loading-spinner {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            color: var(--text-lighter);
        }
    `;
    document.head.appendChild(notificationStyle);

    // Override alert with custom notifications
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (message.toLowerCase().includes('success')) {
            showNotification(message, 'success');
        } else {
            showNotification(message, 'error');
        }
    };

    // Add loading state to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;
                
                // Reset button after 3 seconds (assuming the operation completes)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 3000);
            }
        });
    });

    // Initial data load
    fetchCitizens();
});