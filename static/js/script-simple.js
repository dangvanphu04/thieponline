// static\js/script-simple.js

// Khởi tạo lịch
function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    const month = 0; // Tháng 1
    const year = 2025;
    const weddingDay = 7;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    calendarDays.innerHTML = '';
    
    // Thêm các ngày của tháng trước
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.textContent = prevMonthLastDay - i;
        calendarDays.appendChild(day);
    }
    
    // Thêm các ngày của tháng hiện tại
    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        
        if (i === weddingDay) {
            day.classList.add('wedding-day');
            day.innerHTML = `<strong>${i}</strong><br><small>Thứ Tư</small>`;
        } else {
            day.textContent = i;
        }
        
        calendarDays.appendChild(day);
    }
    
    // Thêm các ngày của tháng sau
    const totalCells = 42;
    const filledCells = firstDayOfWeek + totalDays;
    const remainingCells = totalCells - filledCells;
    
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'day other-month';
        day.textContent = i;
        calendarDays.appendChild(day);
    }
}

// Xử lý form RSVP
document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    
    // Xử lý form
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Đang gửi...';
            submitBtn.disabled = true;
            
            const formData = {
                name: document.getElementById('guestName').value,
                phone: document.getElementById('guestPhone').value,
                guest_count: document.getElementById('guestCount').value,
                attendance: document.querySelector('input[name="attendance"]:checked').value,
                message: document.getElementById('guestMessage').value,
                timestamp: new Date().toISOString()
            };
            
            try {
                const response = await fetch('/rsvp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                const responseDiv = document.getElementById('responseMessage');
                responseDiv.className = result.success ? 'response-message success' : 'response-message error';
                responseDiv.innerHTML = `
                    <i class="fas fa-${result.success ? 'check-circle' : 'exclamation-circle'}"></i>
                    ${result.message}
                `;
                
                if (result.success) {
                    rsvpForm.reset();
                }
                
                setTimeout(() => {
                    responseDiv.innerHTML = '';
                    responseDiv.className = 'response-message';
                }, 5000);
                
            } catch (error) {
                const responseDiv = document.getElementById('responseMessage');
                responseDiv.className = 'response-message error';
                responseDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    Có lỗi xảy ra khi gửi biểu mẫu
                `;
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Thêm CSS cần thiết
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(194, 24, 91, 0.3);
        border-radius: 50%;
        border-top-color: #c2185b;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .response-message {
        margin-top: 20px;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        display: none;
    }
    
    .response-message.success {
        background: #e8f5e9;
        color: #2e7d32;
        border: 1px solid #a5d6a7;
        display: block;
    }
    
    .response-message.error {
        background: #ffebee;
        color: #c62828;
        border: 1px solid #ef9a9a;
        display: block;
    }
    
    .couple-names-heart {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin: 30px 0;
        flex-wrap: wrap;
    }
    
    .groom-name, .bride-name {
        font-family: 'Great Vibes', cursive;
        font-size: clamp(2rem, 6vw, 3.5rem);
        color: var(--text-color);
        font-weight: normal;
        text-align: center;
        flex: 1;
        min-width: 200px;
    }
    
    .groom-name {
        color: #4169e1;
    }
    
    .bride-name {
        color: #e91e63;
    }
    
    .heart-center-small {
        font-size: 2.5rem;
        color: #c2185b;
        animation: heartbeat 1.5s infinite;
        background: white;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 15px rgba(194, 24, 91, 0.3);
    }
    
    .calendar-note {
        text-align: center;
        margin-top: 30px;
        padding: 15px;
        background: var(--light-pink);
        border-radius: 10px;
        font-size: 1.1rem;
        color: var(--primary-color);
    }
    
    .calendar-note i {
        margin-right: 10px;
        animation: heartbeat 1.5s infinite;
    }
    
    :root {
        --primary-color: #c2185b;
        --light-pink: #fff5f7;
    }
`;
document.head.appendChild(style);