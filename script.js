document.addEventListener('DOMContentLoaded', () => {

    /* --- Global Elements --- */
    const isAboutPage = document.body.classList.contains('about-page');
    const isHomePage = document.body.classList.contains('home-page');
    const isProjectsPage = document.querySelector('.projects-section');

    // --- About Page: Video & Lightbox Logic ---
    if (isAboutPage) {
        // 1. Video Play-on-Hover
        const videoBlock = document.querySelector('.about-video-block');
        const video = videoBlock ? videoBlock.querySelector('video') : null;

        if (videoBlock && video) {
            videoBlock.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log("Auto-play blocked", e));
            });

            videoBlock.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }

        // 2. Moodboard Lightbox Viewer
        const moodboardItems = Array.from(document.querySelectorAll('.moodboard-item'));
        const lightbox = document.getElementById('moodboard-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxVideo = document.getElementById('lightbox-video');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        let currentIndex = 0;

        function updateLightbox(index) {
            const item = moodboardItems[index];
            const img = item.querySelector('img');
            const video = item.querySelector('video');

            // Toggle visibility
            if (video) {
                lightboxVideo.src = video.src;
                lightboxVideo.style.display = 'block';
                lightboxImg.style.display = 'none';
                // Store YouTube URL if available
                lightboxVideo.dataset.youtubeUrl = video.dataset.youtubeUrl || '';
            } else if (img) {
                lightboxImg.src = img.src;
                lightboxImg.style.display = 'block';
                lightboxVideo.style.display = 'none';
                lightboxVideo.src = ""; // Stop video if switching to image
                lightboxVideo.dataset.youtubeUrl = '';
            }

            // Build Exhibition Style Caption
            const artist = item.dataset.artist || "";
            const title = item.dataset.title || "";
            const year = item.dataset.year || "";
            const medium = item.dataset.medium || "";
            const dims = item.dataset.dims || "";

            lightboxCaption.innerHTML = `
                ${artist ? `<span class="artist">${artist}</span>` : ""}
                ${title ? `<span class="title">${title}</span>` : ""}
                <span class="meta">
                    ${year ? `${year}${medium || dims ? "," : ""}` : ""}
                    ${medium ? ` ${medium}${dims ? "," : ""}` : ""}
                    ${dims ? ` ${dims}` : ""}
                </span>
            `;

            currentIndex = index;
        }

        function openLightbox(index) {
            updateLightbox(index);
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % moodboardItems.length;
            updateLightbox(currentIndex);
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + moodboardItems.length) % moodboardItems.length;
            updateLightbox(currentIndex);
        }

        // Listeners
        moodboardItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

        // YouTube link for lightbox videos
        if (lightboxVideo) {
            lightboxVideo.addEventListener('click', (e) => {
                const youtubeUrl = lightboxVideo.dataset.youtubeUrl;
                if (youtubeUrl) {
                    window.open(youtubeUrl, '_blank');
                    e.stopPropagation();
                }
            });
        }

        // Close on backdrop click (outside content)
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-main')) {
                    closeLightbox();
                }
            });
        }
        if (lightbox && lightboxImg) {
            // Keyboard support
            window.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'ArrowRight') showNext();
                    if (e.key === 'ArrowLeft') showPrev();
                }
            });
        }
    }

    // 3. Grid & Moodboard Video: Play-on-Hover (Global)
    const gridVideos = document.querySelectorAll('.moodboard-item video, .neutral-media-tile video');
    gridVideos.forEach(v => {
        const container = v.closest('.moodboard-item') || v.closest('.neutral-media-tile');
        if (container) {
            // Ensure video is ready for hover-play
            v.muted = true;
            v.preload = "auto";
            v.pause();

            container.addEventListener('mouseenter', () => {
                // Force a reload if not ready
                if (v.readyState < 3) v.load();

                v.play().catch(e => {
                    console.log("Hover play blocked, retrying...", e);
                    v.muted = true;
                    v.play();
                });
            });
            container.addEventListener('mouseleave', () => {
                v.pause();
                v.currentTime = 0;
            });
        }
    });


    /* --- Random Hover Colors for Nav --- */
    const rgbBright = ['#FF0000', '#FFFF00', '#FF00FF', '#00FFFF', '#00FF00', '#0000FF'];
    const navBoxes = document.querySelectorAll('.nav-box');
    navBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            const randColor = rgbBright[Math.floor(Math.random() * rgbBright.length)];
            box.style.setProperty('--nav-hover-color', randColor);
        });
    });

    /* --- Projects page: Neutral-style title toggle (click open / click close) --- */
    const rgbMuted = ['#ff9999', '#ffff99', '#ff99ff', '#99ffff', '#99ff99', '#9999ff'];
    if (isProjectsPage) {
        const entries = document.querySelectorAll('.project-entry-neutral');

        entries.forEach((entry) => {
            // Assign a random muted color to this individual project block
            const randColor = rgbMuted[Math.floor(Math.random() * rgbMuted.length)];
            entry.style.setProperty('--highlight-color', randColor);
        });

        function setExpanded(entry, open) {
            const head = entry.querySelector('.project-head-neutral');
            const detail = entry.querySelector('.project-detail-neutral');
            if (!detail || !head) return;

            entry.classList.toggle('is-expanded', open);
            entry.dataset.projectExpanded = open ? 'true' : 'false';
            head.setAttribute('aria-expanded', open ? 'true' : 'false');
            detail.setAttribute('aria-hidden', open ? 'false' : 'true');

            if (open) {
                detail.style.maxHeight = detail.scrollHeight + 'px';
            } else {
                detail.style.maxHeight = '';
            }
        }

        function syncOpenHeights() {
            document.querySelectorAll('.project-entry-neutral.is-expanded .project-detail-neutral').forEach((detail) => {
                detail.style.maxHeight = detail.scrollHeight + 'px';
            });
        }

        entries.forEach((entry) => {
            const head = entry.querySelector('.project-head-neutral');
            const detail = entry.querySelector('.project-detail-neutral');
            if (!head || !detail) return;

            head.addEventListener('click', (e) => {
                e.preventDefault();
                const willOpen = !entry.classList.contains('is-expanded');

                setExpanded(entry, willOpen);
            });

            head.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    head.click();
                }
            });
        });

        window.addEventListener('resize', () => {
            syncOpenHeights();
        });

        // Video Play-on-Hover for Project Videos
        const projectVideos = document.querySelectorAll('.project-video-hover');
        projectVideos.forEach(videoBlock => {
            const video = videoBlock.querySelector('video');
            if (video) {
                videoBlock.addEventListener('mouseenter', () => {
                    video.play().catch(e => console.log("Auto-play blocked", e));
                });

                videoBlock.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });
    }

    /* --- Random Gallery Logic (Shrink & Shift) --- */
    if (isHomePage) {
        const gallery = document.getElementById('gallery-bleed');
        const hajiraBtn = document.getElementById('hajira-btn');

        const mediaPool = [
            { type: 'image', path: 'images/factor_ij.jpg' },
            { type: 'image', path: 'images/gevleugelde.jpg' },
            { type: 'image', path: 'images/idfa_vr.jpg' },
            { type: 'image', path: 'images/uni_image.png' },
            { type: 'video', path: 'images/Ik ben nog niet weg.mp4' },
            { type: 'video', path: 'images/banner.mp4' },
            { type: 'video', path: 'images/trailer_ikben.mp4' }
        ];

        // Ensure the FIRST item is always the same (e.g., factor_ij.jpg)
        const initialItem = mediaPool[0];

        function addItem(item, isNew = true) {
            // If adding a NEW item, shrink all current ones
            if (isNew) {
                const currentItems = gallery.querySelectorAll('.gallery-item');
                currentItems.forEach(el => el.classList.add('old'));
            }

            const div = document.createElement('div');
            div.className = 'gallery-item';
            // New items are full height by default (no 'old' class)

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.path;
                img.alt = "Hajira Portfolio Media";
                div.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.src = item.path;
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                div.appendChild(video);
            }

            // Prepend so newest is on the left
            if (gallery.firstChild) {
                gallery.insertBefore(div, gallery.firstChild);
            } else {
                gallery.appendChild(div);
            }
        }

        function addRandomItem() {
            const randomIndex = Math.floor(Math.random() * mediaPool.length);
            const item = mediaPool[randomIndex];
            addItem(item, true);
        }

        // Initial Load (Always start with the same first picture)
        // Set isNew to false for the very first item so it starts full height
        addItem(initialItem, false);

        // Click Logic: Prepend new items, shrink others
        hajiraBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addRandomItem();
        });
    }

});
