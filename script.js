document.addEventListener('DOMContentLoaded', () => {

    /* --- Global Elements --- */
    const isAboutPage = document.body.classList.contains('about-page');
    const isHomePage = document.body.classList.contains('home-page');
    const isProjectsPage = document.querySelector('.projects-section');
    const rgbMuted = ['#ff9999', '#ffff99', '#ff99ff', '#99ffff', '#99ff99', '#9999ff'];

    // --- About Page: Index, Sub-Index, Detail Panel, Video & Lightbox ---
    if (isAboutPage) {
        const aboutIndex = document.getElementById('about-index');
        const subIndex = document.getElementById('about-sub-index');
        const detailPanel = document.getElementById('about-detail-panel');
        const detailClose = document.getElementById('detail-panel-close');
        const projectListEl = document.getElementById('index-project-list');
        const projectPanelsContainer = document.getElementById('project-panels-container');
        const projectsBtn = document.getElementById('index-projects-btn');

        let projectData = [];
        let activePanel = null;
        let hoverTarget = null;
        let subIndexOpen = false;
        const SUB_INDEX_CLOSE_MS = 420;
        const projectNumerals = ['(i)', '(ii)', '(iii)', '(iv)', '(v)', '(vi)', '(vii)'];

        function resetIdleTimer() {
            // Intentionally left blank: auto-closing on inactivity is disabled.
        }

        function clearHoverClasses() {
            document.querySelectorAll('.index-item, .index-project-name').forEach(el => {
                el.classList.remove('is-hovered');
            });
            aboutIndex?.classList.remove('is-hovering');
            subIndex?.classList.remove('is-hovering', 'all-highlight');
        }

        function setHoverState(target) {
            if (!target) {
                clearHoverClasses();
                if (!detailPanel?.classList.contains('is-open') && !subIndexOpen) {
                    document.body.classList.remove('is-interacting');
                }
                return;
            }

            document.body.classList.add('is-interacting');
            clearHoverClasses();
            target.classList.add('is-hovered');

            if (target.classList.contains('index-project-name')) {
                subIndex?.classList.add('is-hovering');
            } else if (aboutIndex?.contains(target)) {
                aboutIndex.classList.add('is-hovering');
                if (target.dataset.panel === 'projects' && subIndexOpen) {
                    subIndex?.classList.add('all-highlight');
                }
            }
        }

        function openSubIndex() {
            subIndexOpen = true;
            document.body.classList.add('sub-index-open', 'is-interacting');
            subIndex.classList.add('is-open');
            subIndex.setAttribute('aria-hidden', 'false');
            if (projectsBtn) projectsBtn.classList.add('is-selected');
        }

        function closeSubIndex(callback, instant = false) {
            if (!subIndexOpen && !subIndex?.classList.contains('is-open')) {
                if (callback) callback();
                return;
            }
        
            if (instant) {
                subIndex.classList.remove('is-open', 'is-closing');
                subIndex.setAttribute('aria-hidden', 'true');
                subIndexOpen = false;
                document.body.classList.remove('sub-index-open');
                if (callback) callback();
                return;
            }
        
            // immediately remove it from interaction/layout
            subIndex.classList.add('is-closing');
            subIndex.setAttribute('aria-hidden', 'true');
            subIndex.style.pointerEvents = 'none';
        
            // wait until animation visually finishes
            setTimeout(() => {
                subIndex.classList.remove('is-closing');
                subIndex.classList.remove('is-open');
                subIndex.style.pointerEvents = '';
        
                subIndexOpen = false;
                document.body.classList.remove('sub-index-open');
        
                if (callback) callback();
        
            }, 420);
        }

        function openPanel(panelId, projectIndex = null) {
            document.body.classList.add('panel-open', 'is-interacting');
            detailPanel.classList.add('is-open');
            detailPanel.setAttribute('aria-hidden', 'false');

            document.querySelectorAll('.detail-panel-content').forEach(panel => {
                panel.hidden = true;
            });

            clearHoverClasses();
            document.querySelectorAll('.index-item, .index-project-name').forEach(el => {
                el.classList.remove('is-selected');
            });

            if (projectIndex !== null) {
                const projectPanel = document.querySelector(`.detail-panel-content[data-project-index="${projectIndex}"]`);
                const projectBtn = document.querySelector(`.index-project-name[data-project-index="${projectIndex}"]`);
                if (projectPanel) {
                    projectPanel.hidden = false;
                    activePanel = `project-${projectIndex}`;
                }
                if (projectBtn) projectBtn.classList.add('is-selected');
                if (projectsBtn) projectsBtn.classList.add('is-selected');
            } else {
                const panel = document.querySelector(`.detail-panel-content[data-panel="${panelId}"]`);
                const navBtn = document.querySelector(`.index-item[data-panel="${panelId}"]`);
                if (panel) {
                    panel.hidden = false;
                    activePanel = panelId;
                }
                if (navBtn) navBtn.classList.add('is-selected');
            }

            initPanelVideos();
        }

        function closePanel() {
            document.body.classList.remove('panel-open');
            if (!hoverTarget && !subIndexOpen) {
                document.body.classList.remove('is-interacting');
            }
            detailPanel.classList.remove('is-open');
            detailPanel.setAttribute('aria-hidden', 'true');
            document.querySelectorAll('.detail-panel-content').forEach(panel => {
                panel.hidden = true;
            });
            if (!subIndexOpen) {
                document.querySelectorAll('.index-item, .index-project-name').forEach(el => {
                    el.classList.remove('is-selected');
                });
            } else if (projectsBtn) {
                document.querySelectorAll('.index-item:not([data-panel="projects"]), .index-project-name').forEach(el => {
                    el.classList.remove('is-selected');
                });
                projectsBtn.classList.add('is-selected');
            }
            activePanel = null;
        }

        function openProjectFromSubIndex(projectIndex) {
            if (subIndexOpen) {
                closeSubIndex(() => {
                    openPanel(null, projectIndex);
                });
            } else {
                openPanel(null, projectIndex);
            }
        }

        function initPanelVideos() {
            detailPanel.querySelectorAll('.neutral-media-tile video, .moodboard-item video').forEach(v => {
                v.muted = true;
                v.preload = 'auto';
            });
        }

        function renderProjectItem(fullTitle, shortTitle, index) {

            projectData.push({
                fullTitle,
                shortTitle,
                index
            });
        
        
            const li = document.createElement('li');
        
            const btn = document.createElement('button');
        
            btn.type = 'button';
            btn.className = 'index-project-name';
            btn.textContent = shortTitle;
            btn.dataset.projectIndex = String(index);
        
            li.appendChild(btn);
        
            if (projectListEl) {
                projectListEl.appendChild(li);
            }
        
        
            const panel = document.querySelector(
                `.project-panel-content[data-project-index="${index}"]`
            );
        
        
            if (panel) {
                const randColor = rgbMuted[
                    Math.floor(Math.random() * rgbMuted.length)
                ];
        
                panel.style.setProperty(
                    '--highlight-color',
                    randColor
                );
            }
        }

        async function loadProjects() {
            try {
                const response = await fetch('index.html?v=2');
                if (!response.ok) throw new Error('Network error');
        
                const html = await response.text();
        
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
        
                const entries = doc.querySelectorAll('.project-entry-neutral');
                console.log("NUMBER OF PROJECTS FOUND:", entries.length);

                entries.forEach((entry, i) => {
                    console.log("PROJECT", i, entry);
                });
                
                console.log("Fetched projects:", entries.length);
        
                if (!entries || entries.length === 0) {
                    throw new Error('No project entries found');
                }
        
                entries.forEach((entry, index) => {
                    const titleEl = entry.querySelector('.project-title-neutral');
                    const detailInner = entry.querySelector('.project-detail-neutral-inner');
        
                    if (!titleEl || !detailInner) {
                        console.warn("Missing title/detail:", entry);
                        return;
                    }
        
                    const fullTitle = titleEl.textContent.replace(/\s+/g, ' ').trim();
                    const titleForIndex = titleEl.getAttribute('data-index-title') || fullTitle;
                    const shortTitle = titleForIndex.match(/^\([ivx]+\)\s/i)
                        ? titleForIndex
                        : `${projectNumerals[index] || `(${index + 1})`} ${titleForIndex}`;
        
                    renderProjectItem(
                        fullTitle,
                        shortTitle,
                        index
                    );
                });

            } catch (err) {
                console.warn('Loading fallback projects for local/CORS compatibility:', err);
                const fallbackProjects = [
                    {
                        fullTitle: 'Factor IJ — Reversing the pinterest logic for an art-rental',
                        shortTitle: '(i) a Lot of coffee and art',
                        html: `<div class="project-detail-neutral-inner"><p>Reversing the pinterest logic for an art-rental platform and gallery in Amsterdam.</p></div>`
                    },
                    {
                        fullTitle: 'The Findlings — After tethered bottle caps became mandatory...',
                        shortTitle: '(ii) blue bottle caps are gone from the streets',
                        html: `<div class="project-detail-neutral-inner"><p>After tethered bottle caps became mandatory in Europe, loose caps disappeared. An investigation into urban artifacts.</p></div>`
                    },
                    {
                        fullTitle: 'Thesis — Testing VR as a tool for outgroup humanization',
                        shortTitle: '(iii) testing VR as a tool for outgroup humanization',
                        html: `<div class="project-detail-neutral-inner"><p>Testing virtual reality simulations to measure changes in perspective-taking and empathy towards outgroups.</p></div>`
                    },
                    {
                        fullTitle: 'TrendWatching — Amplify your edge',
                        shortTitle: '(iv) amplify your edge',
                        html: `<div class="project-detail-neutral-inner"><p>Consumer trends and strategic foresight analysis for modern brand positioning.</p></div>`
                    },
                    {
                        fullTitle: 'Greenwashing in organisations',
                        shortTitle: '(v) greenwashing in organisations',
                        html: `<div class="project-detail-neutral-inner"><p>Empirical study analyzing corporate environmental framing and public skepticism.</p></div>`
                    },
                    {
                        fullTitle: 'Take it to the web — Afghan girls education right',
                        shortTitle: '(vi) take it to the web',
                        html: `<div class="project-detail-neutral-inner"><p>Digital advocacy project supporting educational access for girls in Afghanistan.</p></div>`
                    },
                    {
                        fullTitle: 'Media Framing & Visibility of Migration',
                        shortTitle: '(vii) media framing & visibility of migration',
                        html: `<div class="project-detail-neutral-inner"><p>Digital advocacy project supporting educational access for girls in Afghanistan.</p></div>`
                    }
                ];
                fallbackProjects.forEach((proj, idx) => {
                    renderProjectItem(proj.fullTitle, proj.shortTitle, idx, proj.html);
                });
            }
        }

        // Main index hover & click
        if (aboutIndex) {
            aboutIndex.addEventListener('mouseenter', () => {
                document.body.classList.add('is-interacting');
            });

            aboutIndex.addEventListener('mouseover', (e) => {
                const target = e.target.closest('.index-item');
                if (target && aboutIndex.contains(target)) {
                    hoverTarget = target;
                    setHoverState(target);
                }
            });

            aboutIndex.addEventListener('mouseleave', () => {
                hoverTarget = null;
                clearHoverClasses();
                if (!activePanel && !subIndexOpen) {
                    document.body.classList.remove('is-interacting');
                }
            });

            aboutIndex.addEventListener('click', (e) => {
                const sectionBtn = e.target.closest('.index-item[data-panel]');
                if (!sectionBtn) return;
                e.preventDefault();

                if (sectionBtn.dataset.panel === 'projects') {
                    if (subIndexOpen) {
                        closeSubIndex();
                        closePanel();
                    } else {
                        closePanel();
                        openSubIndex();
                    }
                    return;
                }

                closeSubIndex(() => {
                    openPanel(sectionBtn.dataset.panel);
                }, true);
            });

            aboutIndex.querySelectorAll('.index-item').forEach(el => {
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        el.click();
                    }
                });
            });
        }

        // Sub-index hover & click
        if (subIndex) {
            subIndex.addEventListener('mouseenter', () => {
                document.body.classList.add('is-interacting', 'sub-index-hovering');
            });

            subIndex.addEventListener('mouseover', (e) => {
                const target = e.target.closest('.index-project-name');
                if (target && subIndex.contains(target)) {
                    hoverTarget = target;
                    setHoverState(target);
                }
            });

            subIndex.addEventListener('mouseleave', () => {
                hoverTarget = null;
                document.body.classList.remove('sub-index-hovering');
                subIndex.classList.remove('is-hovering', 'all-highlight');
                document.querySelectorAll('.index-project-name').forEach(el => {
                    el.classList.remove('is-hovered');
                });
                if (!activePanel && !subIndexOpen) {
                    document.body.classList.remove('is-interacting');
                }
            });

            subIndex.addEventListener('click', (e) => {
                const projectBtn = e.target.closest('.index-project-name');
                if (!projectBtn) return;
                e.preventDefault();
                openProjectFromSubIndex(parseInt(projectBtn.dataset.projectIndex, 10));
            });

            subIndex.addEventListener('keydown', (e) => {
                const projectBtn = e.target.closest('.index-project-name');
            
                if (!projectBtn) return;
            
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    projectBtn.click();
                }
            });
        }

        if (detailClose) {
            detailClose.addEventListener('click', closePanel);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (detailPanel?.classList.contains('is-open')) {
                    closePanel();
                } else if (subIndexOpen) {
                    closeSubIndex();
                }
            }
        });

        loadProjects().then(() => {
            detailPanel.querySelectorAll('.neutral-media-tile video, .moodboard-item video').forEach(v => {
                const container = v.closest('.neutral-media-tile') || v.closest('.moodboard-item');
                if (!container) return;
                v.muted = true;
                v.preload = 'auto';
                v.pause();
                container.addEventListener('mouseenter', () => {
                    if (v.readyState < 3) v.load();
                    v.play().catch(() => { v.muted = true; v.play(); });
                });
                container.addEventListener('mouseleave', () => {
                    v.pause();
                    v.currentTime = 0;
                });
            });
        });

        // Video Play-on-Hover (about panel)
        document.querySelectorAll('.about-video-block[data-sound="true"]').forEach((videoBlock) => {
            const video = videoBlock.querySelector('video');
            if (!video) return;

            video.muted = false;
            video.volume = 0.2;
            video.preload = 'metadata';

            videoBlock.addEventListener('mouseenter', () => {
                video.muted = false;
                video.volume = 0.2;
                video.play().catch(e => console.log("Auto-play blocked", e));
            });

            videoBlock.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });

        // Moodboard Lightbox Viewer
        function setupLightbox() {
            const moodboardItems = Array.from(document.querySelectorAll('.moodboard-item'));
            const lightbox = document.getElementById('moodboard-lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCaption = document.getElementById('lightbox-caption');
            const lightboxVideo = document.getElementById('lightbox-video');
            const closeBtn = document.querySelector('.lightbox-close');
            const prevBtn = document.getElementById('lightbox-prev');
            const nextBtn = document.getElementById('lightbox-next');

            if (!lightbox || moodboardItems.length === 0) return;

            let currentIndex = 0;

            function updateLightbox(index) {
                const item = moodboardItems[index];
                const img = item.querySelector('img');
                const vid = item.querySelector('video');

                if (vid) {
                    lightboxVideo.src = vid.src;
                    lightboxVideo.style.display = 'block';
                    lightboxImg.style.display = 'none';
                    lightboxVideo.dataset.youtubeUrl = vid.dataset.youtubeUrl || '';
                } else if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.style.display = 'block';
                    lightboxVideo.style.display = 'none';
                    lightboxVideo.src = "";
                    lightboxVideo.dataset.youtubeUrl = '';
                }

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
                document.body.style.overflow = 'hidden';
            }

            function closeLightboxFn() {
                lightbox.style.display = 'none';
                if (!detailPanel.classList.contains('is-open')) {
                    document.body.style.overflow = '';
                }
            }

            moodboardItems.forEach((item, index) => {
                item.addEventListener('click', () => openLightbox(index));
            });

            if (closeBtn) closeBtn.addEventListener('click', closeLightboxFn);
            if (prevBtn) prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateLightbox((currentIndex - 1 + moodboardItems.length) % moodboardItems.length);
            });
            if (nextBtn) nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateLightbox((currentIndex + 1) % moodboardItems.length);
            });

            if (lightboxVideo) {
                lightboxVideo.addEventListener('click', (e) => {
                    const youtubeUrl = lightboxVideo.dataset.youtubeUrl;
                    if (youtubeUrl) {
                        window.open(youtubeUrl, '_blank');
                        e.stopPropagation();
                    }
                });
            }

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-main')) {
                    closeLightboxFn();
                }
            });

            window.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') closeLightboxFn();
                    if (e.key === 'ArrowRight') updateLightbox((currentIndex + 1) % moodboardItems.length);
                    if (e.key === 'ArrowLeft') updateLightbox((currentIndex - 1 + moodboardItems.length) % moodboardItems.length);
                }
            });
        }

        setupLightbox();
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

