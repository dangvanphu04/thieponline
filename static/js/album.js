// Sample wedding photos data
const weddingPhotos = [
    {
        id: 1,
        src: '/static/images/album/pre1.jpg',
        category: 'pre-wedding',
        title: 'Buổi chụp ảnh đầu tiên',
        date: '15/04/2024',
        description: 'Ngày đầu tiên chụp ảnh tiền hôn lễ tại Đà Lạt',
        likes: 128,
        views: 542
    },
    {
        id: 2,
        src: '/static/images/album/pre2.jpg',
        category: 'pre-wedding',
        title: 'Dưới hoa anh đào',
        date: '20/04/2024',
        description: 'Chụp ảnh tại vườn hoa anh đào',
        likes: 95,
        views: 432
    },
    {
        id: 3,
        src: '/static/images/album/ceremony1.jpg',
        category: 'ceremony',
        title: 'Lễ ăn hỏi',
        date: '01/06/2024',
        description: 'Lễ ăn hỏi tại nhà cô dâu',
        likes: 156,
        views: 623
    },
    {
        id: 4,
        src: '/static/images/album/family1.jpg',
        category: 'family',
        title: 'Hai gia đình',
        date: '01/06/2024',
        description: 'Hai gia đình chung vui',
        likes: 89,
        views: 387
    },
    {
        id: 5,
        src: '/static/images/album/friends1.jpg',
        category: 'friends',
        title: 'Bạn bè thân thiết',
        date: '01/06/2024',
        description: 'Tập thể bạn bè chung vui',
        likes: 112,
        views: 478
    },
    {
        id: 6,
        src: '/static/images/album/pre3.jpg',
        category: 'pre-wedding',
        title: 'Hoàng hôn biển',
        date: '25/04/2024',
        description: 'Chụp ảnh tại bãi biển Nha Trang',
        likes: 145,
        views: 589
    },
    {
        id: 7,
        src: '/static/images/album/ceremony2.jpg',
        category: 'ceremony',
        title: 'Trao nhẫn cưới',
        date: '01/06/2024',
        description: 'Khoảnh khắc trao nhẫn',
        likes: 201,
        views: 756
    },
    {
        id: 8,
        src: '/static/images/album/reception1.jpg',
        category: 'reception',
        title: 'Tiệc chiêu đãi',
        date: '01/06/2024',
        description: 'Tiệc chiêu đãi tại nhà hàng',
        likes: 134,
        views: 521
    }
];

// Initialize album
let currentCategory = 'all';
let currentPhotoIndex = 0;

// DOM Elements
const photoGrid = document.getElementById('photoGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const photoTitle = document.getElementById('photo-title');
const photoDate = document.getElementById('photo-date');
const photoDescription = document.getElementById('photo-description');
const closeLightbox = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const totalPhotos = document.getElementById('totalPhotos');
const totalViews = document.getElementById('totalViews');
const totalLikes = document.getElementById('totalLikes');

// Generate photo grid
function renderPhotos() {
    photoGrid.innerHTML = '';
    const filteredPhotos = currentCategory === 'all' 
        ? weddingPhotos 
        : weddingPhotos.filter(photo => photo.category === currentCategory);
    
    filteredPhotos.forEach((photo, index) => {
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item';
        photoElement.dataset.id = photo.id;
        photoElement.dataset.index = index;
        
        photoElement.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}" class="photo-img" onerror="this.src='/static/images/default.jpg'">
            <div class="photo-overlay">
                <span class="photo-category">${getCategoryName(photo.category)}</span>
                <h4>${photo.title}</h4>
                <p>${photo.date}</p>
                <div class="photo-stats">
                    <span><i class="fas fa-heart"></i> ${photo.likes}</span>
                    <span><i class="fas fa-eye"></i> ${photo.views}</span>
                </div>
            </div>
        `;
        
        photoElement.addEventListener('click', () => openLightbox(index));
        photoGrid.appendChild(photoElement);
    });
    
    updateStats();
}

// Get category name in Vietnamese
function getCategoryName(category) {
    const categories = {
        'all': 'Tất cả',
        'pre-wedding': 'Tiền hôn lễ',
        'ceremony': 'Lễ cưới',
        'reception': 'Tiệc cưới',
        'family': 'Gia đình',
        'friends': 'Bạn bè'
    };
    return categories[category] || category;
}

// Open lightbox
function openLightbox(index) {
    const filteredPhotos = currentCategory === 'all' 
        ? weddingPhotos 
        : weddingPhotos.filter(photo => photo.category === currentCategory);
    
    if (filteredPhotos[index]) {
        currentPhotoIndex = index;
        const photo = filteredPhotos[index];
        
        lightboxImg.src = photo.src;
        photoTitle.textContent = photo.title;
        photoDate.textContent = `Ngày: ${photo.date}`;
        photoDescription.textContent = photo.description;
        
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Update photo views
        photo.views++;
        updateStats();
    }
}

// Close lightbox
function closeLightboxFunc() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Navigate photos
function navigatePhoto(direction) {
    const filteredPhotos = currentCategory === 'all' 
        ? weddingPhotos 
        : weddingPhotos.filter(photo => photo.category === currentCategory);
    
    if (direction === 'prev') {
        currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    } else {
        currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
    }
    
    openLightbox(currentPhotoIndex);
}

// Update statistics
function updateStats() {
    const total = weddingPhotos.length;
    const views = weddingPhotos.reduce((sum, photo) => sum + photo.views, 0);
    const likes = weddingPhotos.reduce((sum, photo) => sum + photo.likes, 0);
    
    totalPhotos.textContent = total;
    totalViews.textContent = views;
    totalLikes.textContent = likes;
}

// Copy share link
function copyShareLink() {
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.select();
    shareUrl.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareUrl.value);
    
    alert('Đã sao chép liên kết chia sẻ!');
}

// File upload functionality
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');

if (dropArea) {
    // Click to select files
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    if (files.length > 10) {
        alert('Vui lòng chọn tối đa 10 ảnh!');
        return;
    }
    
    // Here you would upload files to server
    console.log('Files selected:', files);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderPhotos();
    
    // Category filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderPhotos();
        });
    });
    
    // Lightbox events
    closeLightbox.addEventListener('click', closeLightboxFunc);
    prevBtn.addEventListener('click', () => navigatePhoto('prev'));
    nextBtn.addEventListener('click', () => navigatePhoto('next'));
    
    // Close lightbox on outside click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxFunc();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightboxFunc();
            if (e.key === 'ArrowLeft') navigatePhoto('prev');
            if (e.key === 'ArrowRight') navigatePhoto('next');
        }
    });
});