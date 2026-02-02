document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
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

    // Accordion Logic for LOCTI
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Close others (optional - can keep multiple open if preferred)
            // accordions.forEach(other => {
            //     if (other !== item) other.classList.remove('active');
            // });

            item.classList.toggle('active');

            const icon = item.querySelector('.accordion-header ion-icon');
            if (item.classList.contains('active')) {
                icon.setAttribute('name', 'chevron-up-outline');
            } else {
                icon.setAttribute('name', 'chevron-down-outline');
            }
        });
    });

    // Scroll Animation (Fade in on scroll)
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

    // Elements to animate
    document.querySelectorAll('.card, .feature-text, .feature-visual, .tic-item, .cartelera, .sitios').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
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



// DOM Elements
const button = document.getElementById('commentBtn');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');
const commentSection = document.getElementById('commentSection');
const commentForm = document.getElementById('commentForm');
const emailInput = document.getElementById('email');

// State
let isLoggedIn = false;
let userEmail = sessionStorage.getItem('blogUserEmail') || '';
let comments = JSON.parse(localStorage.getItem('blogComments')) || [];
let visibleComments = 5;

// Init
function init() {
    if (userEmail) {
        isLoggedIn = true;
        updateUIState();
    }
    renderComments();
}

// Update UI based on login state
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

// Render Comments
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

    // Load More Button
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

// Main Button Handler
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
            visibleComments = 5; // Reset view to top
            renderComments();
        } else {
            alert('Por favor escribe un comentario.');
        }
    }
});

// Login Form Submit
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

// Run Init
init();