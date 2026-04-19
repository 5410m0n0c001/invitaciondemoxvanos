// ENVELOPE VIDEO ANIMATION
const envelopeScreen = document.getElementById('envelope-screen');
const envelopeVideo = document.getElementById('envelope-video');
const envelopeHint = document.querySelector('.envelope-hint');

// State control for opening
let isEnvelopeOpened = false;

// Force first frame rendering
if (envelopeVideo) {
    envelopeVideo.addEventListener('loadedmetadata', () => {
        envelopeVideo.currentTime = 0.1;
    }, { once: true });
}

const handleEnvelopeClick = () => {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true; 

    // Capture hero video reference for gesture-locked playback
    const heroVideo = document.getElementById('hero-video');

    // Define function BEFORE calling it (Fixes ReferenceError in mobile/safari)
    const openInvitation = () => {
        if (isEnvelopeOpened === 'fully_done') return;
        isEnvelopeOpened = 'fully_done';
        
        if (typeof emergencyTimeout !== 'undefined') clearTimeout(emergencyTimeout);
        if (envelopeScreen) {
            envelopeScreen.classList.add('hidden');
            
            // SAFETY: Re-trigger hero video when envelope fades (in case browser suspended it)
            if (heroVideo && heroVideo.paused) {
                heroVideo.play().catch(() => {});
            }

            // Start secondary visuals after a slight delay to sync with fade
            setTimeout(() => {
                envelopeScreen.style.display = 'none';
                
                // Start Sakura petals
                if (typeof initSakura === 'function') initSakura();

                // Start Butterflies
                if (typeof initButterflies === 'function') initButterflies();

                // Start Typing
                if (typeof startHeroTyping === 'function') startHeroTyping();

                // START GUIDED TOUR
                if (typeof startGuidedTour === 'function') startGuidedTour();
            }, 1000);
        }
        
        // Start countdown
        if (typeof startCountdown === 'function') startCountdown();
        
        // Final UI visibility check
        document.body.classList.add('ui-visible');
    };

    // VISUAL PRIORITY: Immediately start envelope animation
    if (envelopeVideo) {
        envelopeVideo.play().catch(e => {
            console.log('Envelope animation play failed, opening manually:', e);
            openInvitation();
        });

        // Completion logic
        envelopeVideo.onended = () => {
            openInvitation();
        };
    } else {
        openInvitation();
    }

    // HERO VIDEO: Explicitly play within user gesture to unlock on mobile
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }

    // AUDIO CONTEXT: Try to play music in parallel after animation starts
    const bgMusic = document.getElementById('bg-music');
    const audioBtn = document.getElementById('audio-btn');
    const bgMusicVideo = document.getElementById('audio-btn-video');

    if (bgMusic) {
        bgMusic.play().then(() => {
            if (audioBtn) audioBtn.classList.add('playing');
            if (bgMusicVideo) bgMusicVideo.play().catch(e => console.log('Music video play failed:', e));
        }).catch(err => {
            console.log('Background music failed to trigger:', err);
        });
    }

    // Visual feedback: Hide hint immediately
    if (envelopeHint) envelopeHint.style.display = 'none';

    // FALLBACK: Emergency opening if video is stuck or fails (1.5s)
    const emergencyTimeout = setTimeout(() => {
        if (envelopeScreen && !envelopeScreen.classList.contains('hidden')) {
            openInvitation();
        }
    }, 1500);
};


if (envelopeScreen) {
    const handleInteraction = (e) => {
        // Prevent double fire (touchend followed by click)
        if (e.type === 'touchend') {
            e.preventDefault();
        }
        handleEnvelopeClick();
    };

    envelopeScreen.addEventListener('click', handleInteraction);
    envelopeScreen.addEventListener('touchend', handleInteraction, { passive: false });
}


// SCROLL REVEAL & ANIMATIONS UNIFIED
const revealElements = document.querySelectorAll('.reveal, .card-flip-up, .scale-pulse, .text-reveal, .slide-in-left, .slide-in-right, .btn-zoom-pulse, .typing-container, .timeline-item');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            
            // Handle Typing Effect - Fixed visibility conflict
            if (el.classList.contains('typing-container')) {
                if (!el.dataset.typed) {
                    typeEffect(el);
                    el.dataset.typed = "true";
                }
            }
            
            // ALWAYS add active class for .reveal compatibility and opacity
            el.classList.add('active');
            
            // Optional: unobserve standard reveals to save resources, 
            // but keep for repeatable animations if desired.
            if (!el.classList.contains('typing-container')) {
                // observer.unobserve(el); // Keep observed if we want repeat, but user didn't ask
            }
        }
    });
};

function typeEffect(element) {
    const text = element.textContent.trim();
    element.textContent = "";
    element.style.visibility = "visible";
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            element.classList.add('done');
        }
    }, 70);
}

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// SCROLL HANDLER: Toggle body class for conditional styling (e.g., laterals)
window.addEventListener('scroll', () => {
    const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    if (window.scrollY > heroHeight * 0.8) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// COUNTDOWN TIMER (Live mode targeting July 18, 2026)
const targetDate = new Date("2026-07-18T14:30:00").getTime();
const countdownContainer = document.querySelector('.countdown-container');
const celebrationSound = document.getElementById('celebration-sound');
const balloonsContainer = document.getElementById('balloons-container');

function startCountdown() {
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(countdown);
            if (countdownContainer) countdownContainer.innerHTML = "<h3>¡El gran día ha llegado!</h3>";
            triggerCelebration();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById('days')) document.getElementById('days').innerText = days.toString().padStart(2, '0');
        if (document.getElementById('hours')) document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        if (document.getElementById('minutes')) document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        if (document.getElementById('seconds')) document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }, 1000);
}

// SAKURA ANIMATION
function initSakura() {
    const container = document.getElementById('sakura-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        createPetal(container);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    const size = Math.random() * 10 + 10 + 'px';
    petal.style.width = size;
    petal.style.height = size;
    
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = Math.random() * 3 + 4 + 's';
    petal.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(petal);
    
    petal.addEventListener('animationiteration', () => {
        petal.style.left = Math.random() * 100 + '%';
    });
}

// HERO TYPING ANIMATION
async function startHeroTyping() {
    const nameText = "Ángela Alegría Becerra";
    const line2 = "Te invito a celebrar conmigo este día tan especial";

    const namesEl = document.querySelector('.names-cursive');
    if (namesEl) {
        namesEl.style.opacity = "1"; // Ensure it's visible before typing
    }

    try {
        await typeWriter("type-name", nameText, 60);
        await typeWriter("type-line-2", line2, 40);
    } catch (e) {
        console.log("Typing animation interrupted or element missing", e);
    }
}

/* BUTTERFLIES LOGIC (Randomized & Natural) */
function initButterflies() {
    const container = document.getElementById('butterflies-container');
    if (!container) return;

    // Initial batch randomly distributed
    for (let i = 0; i < 6; i++) {
        setTimeout(() => createButterfly(container, true), i * 1500);
    }
    
    // Continuous random spawn
    setInterval(() => createButterfly(container, false), 10000);

    // Intersection Observer for Section Corners
    const cornerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const corners = entry.target.querySelectorAll('.section-corner');
                corners.forEach(c => c.classList.add('reveal-corner'));
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        cornerObserver.observe(section);
    });
}

function createButterfly(container, initial = false) {
    const butterfly = document.createElement('img');
    butterfly.src = 'mariposa.png';
    butterfly.className = 'butterfly';
    
    // Spawn across the whole screen width, including edges
    const startX = Math.random() * 100; 
    const startY = initial 
        ? Math.random() * 100 
        : -20; 
        
    const duration = 15 + Math.random() * 15; 
    const translateX = (Math.random() - 0.5) * 500;
    const rotate = (Math.random() - 0.5) * 360; // More rotation freedom
    const size = 12 + Math.random() * 15; 
    const opacity = 0.35 + Math.random() * 0.4;

    butterfly.style.left = startX + '%';
    butterfly.style.top = initial ? startY + '%' : '110%'; 
    butterfly.style.width = size + 'px';
    butterfly.style.opacity = opacity;
    butterfly.style.setProperty('--translateX', translateX + 'px');
    butterfly.style.setProperty('--rotate', rotate + 'deg');
    
    // Smooth flying animation with flapping
    butterfly.style.animation = `flyNatural ${duration}s ease-in-out forwards, wingFlap 0.6s ease-in-out infinite`;

    container.appendChild(butterfly);
    
    setTimeout(() => butterfly.remove(), duration * 1000);
}

function typeWriter(elementId, text, speed) {
    return new Promise((resolve) => {
        const element = document.getElementById(elementId);
        if (!element) return resolve();
        
        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        element.parentNode.appendChild(cursor);

        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Remove cursor after typing is done
                if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                setTimeout(resolve, 500); // Wait bit before next line
            }
        }, speed);
    });
}
// Sound loop counter
let soundPlayCount = 0;
const maxSoundPlays = 4;

let isCelebrating = false;
function triggerCelebration() {
    if (isCelebrating) return;
    isCelebrating = true;
    
    // Clear and reset to ensure exactly 3 balloons
    if (balloonsContainer) balloonsContainer.innerHTML = '';
    
    if (celebrationSound && soundPlayCount < maxSoundPlays) {
        celebrationSound.play()
            .then(() => {
                soundPlayCount++;
                celebrationSound.onended = () => {
                    if (soundPlayCount < maxSoundPlays) {
                        celebrationSound.play();
                        soundPlayCount++;
                    }
                };
            })
            .catch(e => console.log('Audio error:', e));
    }
    
    if (balloonsContainer) {
        balloonsContainer.style.display = 'block';
        balloonsContainer.classList.add('active');
        spawnBalloons();
    }
}

function spawnBalloons() {
    // Strictly 3 balloons for a clean, premium look, moving ONLY UPward
    if (!balloonsContainer) return;
    balloonsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const balloon = document.createElement('img');
            balloon.src = 'globos.png';
            balloon.className = 'balloon-img';
            balloonsContainer.appendChild(balloon);
        }, i * 3000); // 3-second stagger for a majestic ascending loop
    }
}

// FLOATING NAV ACTIVE STATE (Optimized with IntersectionObserver)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.floating-nav ul li a');

const sectionOptions = {
    threshold: 0.4,
    rootMargin: "0px"
};

const sectionCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Check if there's already an active link to avoid double highlights
            const currentActive = document.querySelector('.floating-nav ul li a.active');
            if (currentActive && currentActive.getAttribute('href') === `#${id}`) return;

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

const sectionObserver = new IntersectionObserver(sectionCallback, sectionOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// AUDIO PLAYER
const audioBtn = document.getElementById('audio-btn');
const bgMusic = document.getElementById('bg-music');
const bgMusicVideo = document.getElementById('audio-btn-video');

if (audioBtn && bgMusic) {
    audioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioBtn.classList.add('playing');
                if (bgMusicVideo) bgMusicVideo.play();
                audioBtn.setAttribute('aria-label', "Pausar música");
            }).catch(err => {
                console.warn("Audio blocked:", err);
                // Even if audio fails, toggle the UI for user feedback
                audioBtn.classList.add('playing');
                if (bgMusicVideo) bgMusicVideo.play();
            });
        } else {
            bgMusic.pause();
            audioBtn.classList.remove('playing');
            if (bgMusicVideo) bgMusicVideo.pause();
            audioBtn.setAttribute('aria-label', "Reproducir música");
        }
    });
    
    // Safety sync: Ensure video matches audio state if changed programmatically
    bgMusic.onplay = () => {
        audioBtn.classList.add('playing');
        if (bgMusicVideo) bgMusicVideo.play();
    };
    bgMusic.onpause = () => {
        audioBtn.classList.remove('playing');
        if (bgMusicVideo) bgMusicVideo.pause();
    };
}

// CLIPBOARD COPY
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('¡Número de cuenta copiado!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
// SHARING & CALENDAR INTEGRATION
const calendarBtn = document.getElementById('calendar-btn');
const calendarOptions = document.getElementById('calendar-options');
const shareBtn = document.getElementById('share-btn-sticky');

if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Invitación a los XV Años de Angela Alegría',
            text: '¡Acompáñame a celebrar mis XV años! Te espero con mucha ilusión.',
            url: window.location.href.split('?')[0] // Clean URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy URL to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Enlace de invitación copiado al portapapeles.');
            } catch (err) {
                console.error('Clipboard error:', err);
            }
        }
    });
}

if (calendarBtn && calendarOptions) {
    calendarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        calendarOptions.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!calendarOptions.contains(e.target)) {
            calendarOptions.classList.remove('active');
        }
    });

    const eventDetails = {
        title: "XV Años de Angela Alegría",
        description: "Te invito a celebrar mis XV años en este sueño hecho realidad.",
        location: "Jardín Villa Leona, C. San Luis 100, 62555 Jiutepec, Mor.",
        start: "20260718T150000",
        end: "20260719T000000"
    };

    // Google Calendar Link
    document.getElementById('cal-google').addEventListener('click', function(e) {
        e.preventDefault();
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(url, '_blank');
    });

    // Outlook Link
    document.getElementById('cal-outlook').addEventListener('click', function(e) {
        e.preventDefault();
        const url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.start}&enddt=${eventDetails.end}&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        window.open(url, '_blank');
    });

    // Apple/iCal Link
    document.getElementById('cal-apple').addEventListener('click', function(e) {
        e.preventDefault();
        const icsData = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `DTSTART:${eventDetails.start}`,
            `DTEND:${eventDetails.end}`,
            `SUMMARY:${eventDetails.title}`,
            `DESCRIPTION:${eventDetails.description}`,
            `LOCATION:${eventDetails.location}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'xv-angela-alegria.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// PHOTO UPLOAD & GLOBAL GALLERY (SUPABASE)
const SUPABASE_URL = 'https://fhnnqmbbeeobassvfeox.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobm5xbWJiZWVvYmFzc3ZmZW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDAyOTgsImV4cCI6MjA1NzgyMDMwNH0.7LrT_oGYH0cSMjLggJKo8y4s4NX5pLH-cGHBhjvXEW4';
const ALBUM_ID = 'boda-demo';

let supabaseClient = null;

const btnCamera = document.getElementById('btn-camera');
const photoInput = document.getElementById('photo-input');
const uploadStatus = document.getElementById('upload-status');
const uploadSuccess = document.getElementById('upload-success');
const photoGallery = document.getElementById('photo-gallery');

/**
 * Initialize Supabase and start watchers
 */
function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        fetchSupabaseGallery();
        initRealtime();
    } else {
        console.error('Supabase SDK not loaded');
        if (photoGallery) photoGallery.innerHTML = '<p class="text-danger">Error: No se pudo cargar el servicio de fotos.</p>';
    }
}

/**
 * Fetch photos from Supabase and render the gallery
 */
async function fetchSupabaseGallery() {
    if (!photoGallery) return;
    if (!supabaseClient) return;

    try {
        const { data, error } = await supabaseClient
            .from('fotos')
            .select('*')
            .eq('album_id', ALBUM_ID)
            .order('created_at', { ascending: false });

        if (error) throw error;
        renderSupabaseGallery(data);
    } catch (err) {
        console.error('Error fetching gallery:', err);
        photoGallery.innerHTML = '<p class="text-muted">Iniciando galería...</p>';
    }
}

/**
 * Render the gallery UI with photos from Supabase
 */
function renderSupabaseGallery(photos) {
    if (!photoGallery || !photos || photos.length === 0) {
        if (photoGallery) photoGallery.innerHTML = '<p class="text-muted mt-4">Aún no hay fotos. ¡Sé el primero en subir una!</p>';
        return;
    }

    let html = '';
    
    // Feature the latest photo
    const latest = photos[0];
    html += `
        <div class="photo-gallery-latest reveal active">
            <span class="photo-badge">Última Foto</span>
            <img src="${latest.url}" alt="Última foto subida" onclick="openVisor('${latest.url}')" style="cursor: pointer;">
        </div>
    `;

    // Thumbnails for the rest
    if (photos.length > 1) {
        html += '<div class="photo-gallery-grid reveal active">';
        const limit = Math.min(photos.length, 13);
        for (let i = 1; i < limit; i++) {
            const p = photos[i];
            html += `<img src="${p.url}" alt="Foto del evento" onclick="openVisor('${p.url}')" style="cursor: pointer;">`;
        }
        html += '</div>';
    }
    photoGallery.innerHTML = html;
}

/**
 * Real-time subscription for new photos
 */
function initRealtime() {
    if (!supabaseClient) return;
    supabaseClient
        .channel('public:fotos')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'fotos',
            filter: `album_id=eq.${ALBUM_ID}`
        }, (payload) => {
            console.log('Nueva foto recibida!', payload);
            fetchSupabaseGallery();
            showToast('¡Se ha compartido una nueva foto!');
        })
        .subscribe();
}

/**
 * Toast Notification System
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class='bx bx-camera'></i><span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Initial Fetch and Subscription
document.addEventListener('DOMContentLoaded', initSupabase);

// Camera and Upload Logic
if (btnCamera) {
    btnCamera.addEventListener('click', () => photoInput.click());
}

if (photoInput) {
    photoInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file || !supabaseClient) return;

        btnCamera.style.display = 'none';
        uploadStatus.style.display = 'flex';

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${ALBUM_ID}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabaseClient.storage
                .from('fotos-album')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('fotos-album')
                .getPublicUrl(filePath);

            // 3. Save to Database
            const { error: dbError } = await supabaseClient
                .from('fotos')
                .insert([{ url: publicUrl, album_id: ALBUM_ID }]);

            if (dbError) throw dbError;

            // Success UI
            uploadStatus.style.display = 'none';
            uploadSuccess.style.display = 'flex';
            
            setTimeout(() => {
                uploadSuccess.style.display = 'none';
                btnCamera.style.display = 'flex';
                photoInput.value = '';
            }, 3000);

        } catch (err) {
            console.error('Upload error:', err);
            uploadStatus.style.display = 'none';
            btnCamera.style.display = 'flex';
            photoInput.value = '';
            alert('Error al subir la foto: ' + (err.message || 'Intente de nuevo.'));
        }
    });
}
// QR CODE SHARING (Using static image)
function initQRCode() {
    const btnShareQr = document.getElementById('btn-share-qr');
    if (!btnShareQr) return;

    btnShareQr.addEventListener('click', async () => {
        try {
            // Use the absolute path for the QR image
            const qrUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'qr.png';
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const file = new File([blob], "codigo-qr-xv-angela.png", { type: "image/png" });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Código QR de mis XV Años',
                    text: 'Escanea este código para compartir tus fotos conmigo.',
                    url: window.location.href // Also include URL for context
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: 'Código QR de mis XV Años',
                    text: 'Escanea este código para compartir tus fotos conmigo.',
                    url: qrUrl
                });
            } else {
                // Fallback for desktop or non-sharing browsers: open in new tab
                window.open(qrUrl, '_blank');
            }
        } catch (err) {
            console.error('Error sharing QR:', err);
            // Simple link fallback
            if (navigator.share) {
                await navigator.share({
                    title: 'Álbum de Fotos de los XV Años',
                    text: '¡Sube tus fotos aquí!',
                    url: window.location.origin + window.location.pathname.replace('index.html', '') + 'smartlanding.html'
                });
            }
        }
    });
}

// HANDLE URL ACTIONS (Like auto-triggering camera)
function handleUrlActions() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action === 'take-photo') {
        const overlay = document.getElementById('qr-camera-overlay');
        const btnTakePhoto = document.getElementById('btn-qr-take-photo');
        const btnSkip = document.getElementById('btn-qr-skip');
        const btnCameraReal = document.getElementById('btn-camera');

        if (overlay) {
            overlay.style.display = 'flex';
            
            // If they want to take the photo
            btnTakePhoto.addEventListener('click', () => {
                overlay.style.display = 'none';
                const fotosSection = document.getElementById('fotos');
                if (fotosSection) {
                    fotosSection.scrollIntoView({ behavior: 'auto' });
                    if (btnCameraReal) btnCameraReal.click();
                }
            });

            // If they just want to see the invitation
            btnSkip.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        }
    }
}

// Initialize on Load
window.addEventListener('load', () => {
    initQRCode();
    handleUrlActions();
});

// Horizontal Background Drift on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const speed = 0.08;
    // Drift every section slightly horizontally
    document.querySelectorAll('section').forEach(section => {
        const xPos = (scrolled * speed) % 100;
        section.style.backgroundPosition = `${50 + (xPos * 0.2)}% 50%`;
    });
});

// TIMELINE ANIMATION (IntersectionObserver)
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => timelineObserver.observe(item));

// MENU TOGGLE LOGIC
const btnFoods = document.getElementById('btn-menu-foods');
const btnDrinks = document.getElementById('btn-menu-drinks');
const menuFoods = document.getElementById('menu-foods');
const menuDrinks = document.getElementById('menu-drinks');

if (btnFoods && btnDrinks) {
    btnFoods.addEventListener('click', () => {
        btnFoods.classList.add('active');
        btnDrinks.classList.remove('active');
        menuFoods.classList.add('active');
        menuDrinks.classList.remove('active');
    });

    btnDrinks.addEventListener('click', () => {
        btnDrinks.classList.add('active');
        btnFoods.classList.remove('active');
        menuDrinks.classList.add('active');
        menuFoods.classList.remove('active');
    });
}

// GUIDED TOUR LOGIC
function startGuidedTour() {
    if (!window.driver) {
        console.warn("Driver.js no está cargado.");
        return;
    }

    const driver = window.driver.js.driver;
    
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: 'Finalizar',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Atrás',
        progressText: 'Paso {{current}} de {{total}}',
        popoverClass: 'tour-popover',
        steps: [
            {
                element: '#audio-btn',
                popover: {
                    title: 'Música y Animación',
                    description: 'Disfruta de la experiencia completa con música. Puedes pausarla o reanudarla aquí.',
                    side: "left",
                    align: 'center'
                }
            },
            {
                element: '#hero',
                popover: {
                    title: 'Mis XV Años',
                    description: '¡Bienvenidos a mi invitación! Desliza para conocer todos los detalles de esta gran noche.',
                    side: "bottom",
                    align: 'center'
                }
            },
            {
                element: '.countdown-container',
                popover: {
                    title: 'Contador Regresivo',
                    description: 'Marca el tiempo que falta para que llegue el gran momento.',
                    side: "left",
                    align: 'center'
                }
            },
            {
                element: '#calendar-btn',
                popover: {
                    title: 'Agendar Día',
                    description: 'Toca este botón para añadir el evento a tu calendario.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#ubicacion',
                popover: {
                    title: 'Dónde y Cuándo',
                    description: 'Conoce los detalles de la recepción y usa los botones para abrir la ruta exacta en tu mapa.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '#itinerario',
                popover: {
                    title: 'Itinerario',
                    description: 'Acompáñanos minuto a minuto en cada momento especial que hemos preparado.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#codigo-vestimenta',
                popover: {
                    title: 'Código de Vestimenta',
                    description: 'Consulta las sugerencias para el evento.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#padrinos',
                popover: {
                    title: 'Familia',
                    description: 'Con amor y gratitud a quienes me han acompañado en este camino.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#menus',
                popover: {
                    title: 'Nuestra Propuesta',
                    description: 'Conoce el detalle del banquete y la coctelería que hemos seleccionado para ti.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#mesa-regalos',
                popover: {
                    title: 'Mesa de Regalos',
                    description: 'Si gustas tener un detalle, aquí encontrarás nuestras sugerencias.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#fotos',
                popover: {
                    title: 'Comparte tu Foto',
                    description: 'Este álbum es dinámico. Las fotos que tomes en el evento se mostrarán automáticamente en tiempo real.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#clima',
                popover: {
                    title: 'Clima en Tiempo Real',
                    description: 'Prepara tu visita conociendo las condiciones actuales del clima para el día del evento.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '#rsvp',
                popover: {
                    title: 'Confirma tu Asistencia',
                    description: 'Por favor, haz clic aquí para asegurar tu lugar. ¡Te esperamos!',
                    side: "top",
                    align: 'center'
                }
            }
        ],
        onDestroyStarted: () => {
            setTimeout(() => {
                if (!driverObj.hasNextStep() || confirm("¿Estás listo para explorar la invitación por ti mismo?")) {
                    driverObj.destroy();
                }
            }, 0);
        },
    });

    setTimeout(() => {
        driverObj.drive();
    }, 500);
}
