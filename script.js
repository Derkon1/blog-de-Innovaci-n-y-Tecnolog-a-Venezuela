document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let particles = [];
        const image = new Image();
        image.src = 'Imagenes/hero-bg.jpg';

        image.onload = () => {
            initParticles();
            animate();
        };

        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
            const w = image.width * scale;
            const h = image.height * scale;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2;

            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempCtx.drawImage(image, x, y, w, h);

            const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
            particles = [];

            const step = 4;
            for (let y = 0; y < canvas.height; y += step) {
                for (let x = 0; x < canvas.width; x += step) {
                    const index = (y * canvas.width + x) * 4;
                    const r = imageData[index];
                    const g = imageData[index + 1];
                    const b = imageData[index + 2];
                    const a = imageData[index + 3];

                    if (a > 128) {
                        particles.push({
                            ox: x,
                            oy: y,
                            x: x,
                            y: y,
                            color: `rgb(${r},${g},${b})`,
                            vx: (Math.random() - 0.5) * 15,
                            vy: (Math.random() - 0.5) * 15 - 5
                        });
                    }
                }
            }
        }

        let scrollPct = 0;
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            scrollPct = Math.min(scrollPos / (window.innerHeight * 0.6), 1.5);
        });

        window.addEventListener('resize', () => {
            initParticles();
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const targetX = p.ox + p.vx * scrollPct * 250;
                const targetY = p.oy + p.vy * scrollPct * 250;

                p.x += (targetX - p.x) * 0.2;
                p.y += (targetY - p.y) * 0.2;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = 1 - (scrollPct * 0.5);
                ctx.fillRect(p.x, p.y, 3, 3);
            }

            requestAnimationFrame(animate);
        }
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('ion-icon');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('name', 'close-outline');
            } else {
                icon.setAttribute('name', 'grid-outline');
            }
        });
    }

    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            item.classList.toggle('active');

            const icon = item.querySelector('.accordion-header ion-icon');
            if (item.classList.contains('active')) {
                icon.setAttribute('name', 'chevron-up-outline');
            } else {
                icon.setAttribute('name', 'chevron-down-outline');
            }
        });
    });

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-text, .feature-visual, .tic-item, .cartelera, .sitios').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});

const div = document.createElement('div');
div.id = 'commentSection';
div.classList.add('comment-section');
div.innerHTML = `
    <h2>Comentarios</h2>
    <form id="commentForm">
        <input type="email" id="email" placeholder="Correo Electronico" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit">Ingresar Sesión</button>
    </form>
    <div id="comments"></div>
`;
document.body.appendChild(div);

const button = document.getElementById('commentBtn');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');
const commentSection = document.getElementById('commentSection');
const commentForm = document.getElementById('commentForm');
const emailInput = document.getElementById('email');

let isLoggedIn = false;
let userEmail = sessionStorage.getItem('blogUserEmail') || '';
let comments = JSON.parse(localStorage.getItem('blogComments')) || [];
let visibleComments = 5;

function init() {
    if (userEmail) {
        isLoggedIn = true;
        updateUIState();
    }
    renderComments();
}

function updateUIState() {
    if (isLoggedIn) {
        button.textContent = 'Comentar';
        commentInput.disabled = false;
        commentInput.placeholder = `Comenta como ${userEmail}...`;
    } else {
        button.textContent = 'Iniciar Sesión';
        commentInput.disabled = true;
        commentInput.placeholder = 'Escribe tu comentario...';
    }
}

function renderComments() {
    commentsList.innerHTML = '';
    const reversedComments = comments.slice().reverse();
    const toShow = reversedComments.slice(0, visibleComments);

    toShow.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-item glass-dark';
        div.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.email}</span>
                <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <p class="comment-body">${comment.text}</p>
        `;
        commentsList.appendChild(div);
    });

    if (visibleComments < comments.length) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'btn-secondary load-more-btn';
        loadMoreBtn.textContent = 'Ver más comentarios';
        loadMoreBtn.onclick = () => {
            visibleComments += 5;
            renderComments();
        };
        commentsList.appendChild(loadMoreBtn);
    }
}

button.addEventListener('click', () => {
    if (!isLoggedIn) {
        commentSection.style.display = 'block';
    } else {
        const text = commentInput.value.trim();
        if (text) {
            const newComment = {
                email: userEmail,
                text: text,
                date: new Date().toISOString()
            };
            comments.push(newComment);
            localStorage.setItem('blogComments', JSON.stringify(comments));

            commentInput.value = '';
            visibleComments = 5;
            renderComments();
        } else {
            alert('Por favor escribe un comentario.');
        }
    }
});

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (email) {
        isLoggedIn = true;
        userEmail = email;
        sessionStorage.setItem('blogUserEmail', email);

        commentSection.style.display = 'none';
        updateUIState();
        commentInput.focus();
    }
});

init();