// static\js\script-fixed.js - FILE JS HOÀN CHỈNH

// Khởi tạo lịch với ngày Thứ Tư
function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    const month = 0; // Tháng 1
    const year = 2025;
    const weddingDay = 7;
    
    // Tạo ngày đầu tháng
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Lấy ngày trong tuần của ngày đầu tháng
    const firstDayOfWeek = firstDay.getDay(); // 0: CN, 1: T2, ...
    const totalDays = lastDay.getDate();
    
    // Xóa nội dung cũ
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
        
        // Tạo ngày 7 Thứ Tư
        if (i === weddingDay) {
            day.classList.add('wedding-day');
            day.innerHTML = `<strong>${i}</strong><br><small>Thứ Tư</small>`;
        } else {
            day.textContent = i;
        }
        
        calendarDays.appendChild(day);
    }
    
    // Thêm các ngày của tháng sau
    const totalCells = 42; // 6 hàng × 7 cột
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
    // Khởi tạo lịch
    initCalendar();
    
    // Xử lý form RSVP
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
                
                // Tự động ẩn thông báo sau 5 giây
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
    
    // Hiệu ứng hover cho các thành phần
    setupHoverEffects();
});

// Hiệu ứng hover
function setupHoverEffects() {
    // Hiệu ứng cho các thành phần gia đình
    document.querySelectorAll('.family').forEach(family => {
        family.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        family.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Hiệu ứng cho các ngày trong lịch
    document.querySelectorAll('.day:not(.other-month)').forEach(day => {
        day.addEventListener('mouseenter', function() {
            if (!this.classList.contains('wedding-day')) {
                this.style.backgroundColor = '#fff5f7';
                this.style.transform = 'scale(1.1)';
            }
        });
        
        day.addEventListener('mouseleave', function() {
            if (!this.classList.contains('wedding-day')) {
                this.style.backgroundColor = '';
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// Xử lý click vào link Google Maps với tọa độ
function initMapLinks() {
    const coordinates = "21°15'50.2\"N 106°36'44.2\"E";
    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(coordinates)}`;
    
    // Cập nhật tất cả các link bản đồ
    document.querySelectorAll('.map-link').forEach(link => {
        link.href = mapUrl;
        link.target = '_blank';
    });
    
    // Thêm link cho tọa độ
    const coordinateLink = document.querySelector('.map-coordinates a');
    if (coordinateLink) {
        coordinateLink.href = mapUrl;
        coordinateLink.target = '_blank';
    }
}

// Khởi tạo khi load trang
window.addEventListener('load', function() {
    initMapLinks();
    
    // Thêm hiệu ứng cho tiêu đề
    const titleLeft = document.querySelector('.title-left');
    const titleRight = document.querySelector('.title-right');
    
    if (titleLeft && titleRight) {
        setTimeout(() => {
            titleLeft.classList.add('animate__slideInLeft');
            titleRight.classList.add('animate__slideInRight');
        }, 500);
    }
});

// Thêm CSS loading
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(194, 24, 91, 0.3);
        border-radius: 50%;
        border-top-color: var(--primary-color);
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
`;
document.head.appendChild(style);