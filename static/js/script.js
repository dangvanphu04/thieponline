// Countdown Timer đến ngày 07/01/2026 16:00
function updateWeddingCountdown() {
    const weddingDate = new Date('2026-01-07T16:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('countdown-days').textContent = days.toString().padStart(3, '0');
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Update countdown message based on time left
        updateCountdownMessage(days);
    } else {
        document.querySelector('.countdown-timer-large').innerHTML = 
            '<div class="wedding-day-announcement"><h3 style="color: #e94057; font-size: 2.5rem;">🎉 HÔM NAY LÀ NGÀY CƯỚI! 🎉</h3><p style="font-size: 1.2rem; margin-top: 15px;">Chúc mừng đôi trẻ trăm năm hạnh phúc!</p></div>';
        document.querySelector('.countdown-message').textContent = 'Giờ phút hạnh phúc đã đến!';
    }
}

function updateCountdownMessage(days) {
    const messages = [
        { days: 0, message: "Hôm nay là ngày cưới! 🎉" },
        { days: 1, message: "Chỉ còn 1 ngày nữa thôi!" },
        { days: 7, message: "Còn 1 tuần nữa là đến ngày vui!" },
        { days: 30, message: "Còn 1 tháng nữa, hãy chuẩn bị thật tốt!" },
        { days: 60, message: "Còn 2 tháng nữa, thời gian trôi nhanh quá!" },
        { days: 100, message: "Còn hơn 3 tháng nữa đến ngày trọng đại" },
        { days: 365, message: "Còn 1 năm nữa, bắt đầu đếm ngược nào!" }
    ];
    
    const countdownMessage = document.querySelector('.countdown-message');
    const message = messages.find(m => days <= m.days) || 
                   { message: `Còn ${days} ngày nữa đến hôn lễ` };
    
    countdownMessage.textContent = message.message;
}

// Form gửi lời chúc mừng
document.getElementById('congratulationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('guestName').value,
        phone: document.getElementById('guestPhone').value,
        relationship: document.querySelector('input[name="relationship"]:checked').value,
        message: document.getElementById('congratulationMessage').value,
        gift: document.getElementById('giftOption').value,
        attendance: document.querySelector('input[name="attendance"]:checked').value,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/send_congratulations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        const responseDiv = document.getElementById('congratulationResponse');
        responseDiv.innerHTML = `
            <div class="message ${result.success ? 'success' : 'error'}">
                <i class="fas fa-${result.success ? 'check-circle' : 'exclamation-circle'}"></i>
                ${result.message}
            </div>
        `;
        
        if (result.success) {
            // Reset form
            document.getElementById('congratulationForm').reset();
            document.getElementById('charCount').textContent = '0';
            
            // Reload wishes
            loadWishes();
            
            // Show success animation
            showSuccessAnimation();
        }
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            responseDiv.innerHTML = '';
        }, 5000);
        
    } catch (error) {
        document.getElementById('congratulationResponse').innerHTML = `
            <div class="message error">
                <i class="fas fa-exclamation-circle"></i>
                Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại!
            </div>
        `;
    }
});

// Character counter for message
document.getElementById('congratulationMessage').addEventListener('input', function() {
    const charCount = this.value.length;
    document.getElementById('charCount').textContent = charCount;
    
    if (charCount > 500) {
        this.value = this.value.substring(0, 500);
        document.getElementById('charCount').textContent = '500';
        document.getElementById('charCount').style.color = '#e94057';
    } else if (charCount > 450) {
        document.getElementById('charCount').style.color = '#FF9800';
    } else {
        document.getElementById('charCount').style.color = '#666';
    }
});

// Load wishes from server
async function loadWishes() {
    try {
        const response = await fetch('/get_wishes');
        const wishes = await response.json();
        
        const container = document.getElementById('wishesContainer');
        container.innerHTML = '';
        
        if (wishes.length === 0) {
            container.innerHTML = '<div class="no-wishes">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc mừng!</div>';
            return;
        }
        
        wishes.forEach(wish => {
            const wishElement = createWishElement(wish);
            container.appendChild(wishElement);
        });
        
        // Show load more button if there are more wishes
        if (wishes.length >= 5) {
            document.getElementById('loadMoreBtn').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading wishes:', error);
    }
}

function createWishElement(wish) {
    const div = document.createElement('div');
    div.className = 'wish-item';
    
    const relationshipIcons = {
        'groom': 'fas fa-male',
        'bride': 'fas fa-female',
        'both': 'fas fa-heart',
        'friend': 'fas fa-user-friends'
    };
    
    const relationshipColors = {
        'groom': '#4169e1',
        'bride': '#e94057',
        'both': '#8a2387',
        'friend': '#4CAF50'
    };
    
    const iconClass = relationshipIcons[wish.relationship] || 'fas fa-user';
    const color = relationshipColors[wish.relationship] || '#666';
    
    div.innerHTML = `
        <div class="wish-header">
            <div class="wish-author">
                <div class="author-icon" style="background: ${color}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="author-info">
                    <h4>${wish.name}</h4>
                    <p class="wish-meta">
                        <span class="relationship">${getRelationshipText(wish.relationship)}</span>
                        <span class="wish-time">${formatTime(wish.timestamp)}</span>
                    </p>
                </div>
            </div>
            <div class="attendance-badge attendance-${wish.attendance}">
                ${getAttendanceText(wish.attendance)}
            </div>
        </div>
        <div class="wish-content">
            <p>${wish.message}</p>
        </div>
        ${wish.gift && wish.gift !== 'none' ? 
            `<div class="wish-gift">
                <i class="fas fa-gift"></i> 
                <span>${getGiftText(wish.gift)}</span>
            </div>` : ''}
    `;
    
    return div;
}

function getRelationshipText(relationship) {
    const texts = {
        'groom': 'Bên nhà trai',
        'bride': 'Bên nhà gái',
        'both': 'Cả hai bên',
        'friend': 'Bạn bè'
    };
    return texts[relationship] || '';
}

function getAttendanceText(attendance) {
    const texts = {
        'yes': 'Sẽ tham dự',
        'maybe': 'Có thể tham dự',
        'no': 'Không tham dự'
    };
    return texts[attendance] || '';
}

function getGiftText(gift) {
    const texts = {
        'envelope': 'Phong bì mừng',
        'item': 'Quà tặng',
        'flower': 'Hoa tươi',
        'other': 'Quà mừng'
    };
    return texts[gift] || 'Quà mừng';
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showSuccessAnimation() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.cssText = `
        position: fixed;
        font-size: 2rem;
        color: #e94057;
        z-index: 1000;
        pointer-events: none;
        animation: floatUp 1.5s ease-out forwards;
    `;
    
    document.body.appendChild(heart);
    
    // Random position
    const startX = Math.random() * window.innerWidth;
    heart.style.left = startX + 'px';
    heart.style.bottom = '100px';
    
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 1500);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Start countdown
    updateWeddingCountdown();
    setInterval(updateWeddingCountdown, 1000);
    
    // Load wishes
    loadWishes();
    
    // Load more button
    document.getElementById('loadMoreBtn').addEventListener('click', loadWishes);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add CSS for float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-100px) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});