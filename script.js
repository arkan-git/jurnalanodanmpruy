import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB8sXemNSShtsOTo4apsHOMbqsQvZgDgxg",
    authDomain: "anompruyjurnalkita.firebaseapp.com",
    projectId: "anompruyjurnalkita",
    storageBucket: "anompruyjurnalkita.firebasestorage.app",
    messagingSenderId: "469933972418",
    appId: "1:469933972418:web:1392857763a7bf92e5945b",
    measurementId: "G-Q8ZR6CXEE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal, .fade-in-up');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 2. Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 3. Login System ---
    const GREETINGS = {
        "ano": [
            "Halo, Arkan! ✨",
            "Hai, Genteng! 😎",
            "Halo, Rusa! 🔥",
            "Hai, Capruk! 🚀",
            "Halo, Ano! 🚀",
            "Halo, Bestie! ✨",
            "مرحباً يا حبيبي",
            "Hai MSG! 💖",
        ],
        "mpruy": [
            "Halo, Samiya! ✨",
            "Hola, Samiya! 💃",
            "Hai MBG! 💖",
            "مرحباً سامية ✨",
            "Hai cantik! ✨",
            "Halo, Mpruy! ✨",
            "Halo, Bestie! ✨",
            "مرحباً يا حبيبتي"
        ]
    };

    const loginOverlay = document.getElementById('loginOverlay');
    const loginBtn = document.getElementById('loginBtn');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const floatingAddBtn = document.getElementById('floatingAddBtn');
    const musicPlayer = document.getElementById('musicPlayer');
    const userGreeting = document.getElementById('userGreeting');

    function updateGreeting() {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser && GREETINGS[loggedInUser] && userGreeting) {
            const list = GREETINGS[loggedInUser];
            let currentGreeting = userGreeting.innerText;

            // Cari sapaan baru yang berbeda dari yang sekarang (kalau list > 1)
            let filteredList = list.filter(g => g !== currentGreeting);
            let finalSelectionList = filteredList.length > 0 ? filteredList : list;
            const randomGreeting = finalSelectionList[Math.floor(Math.random() * finalSelectionList.length)];

            // Efek transisi halus
            userGreeting.style.opacity = '0';
            setTimeout(() => {
                userGreeting.innerText = randomGreeting;
                userGreeting.style.opacity = '1';
            }, 500);
        }
    }

    // Update sapaan setiap 2 menit (120000 ms)
    setInterval(updateGreeting, 120000);

    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (floatingAddBtn) floatingAddBtn.style.display = 'block';
        if (musicPlayer) musicPlayer.style.display = 'flex';
        updateGreeting(); // Jalankan sapaan acak saat pertama kali load
        autoPlayMusic();
    } else {
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (floatingAddBtn) floatingAddBtn.style.display = 'none';
        if (musicPlayer) musicPlayer.style.display = 'none';
    }

    loginBtn.addEventListener('click', () => {
        const pwd = loginPassword.value.toLowerCase();
        if (GREETINGS[pwd]) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loggedInUser', pwd);
            updateGreeting();
            autoPlayMusic();

            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.style.display = 'none';
                floatingAddBtn.style.display = 'block';
                if (musicPlayer) musicPlayer.style.display = 'flex';
            }, 500);
        } else {
            loginError.style.display = 'block';
        }
    });

    loginPassword.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // --- Sistem Playlist Musik ---
    const playlist = [
        { src: 'music.mp3', title: 'Bercinta lewat kata - Donne Maula' },
        { src: 'music2.mp3', title: 'Love Epiphany - Reality Club' }
    ];
    let currentSongIndex = 0;

    function updateMusicInfo() {
        const bgMusic = document.getElementById('bgMusic');
        const musicTitle = document.getElementById('musicTitle');

        if (bgMusic && musicTitle) {
            bgMusic.src = playlist[currentSongIndex].src;
            musicTitle.innerText = playlist[currentSongIndex].title;
            musicTitle.classList.add('show');
            setTimeout(() => musicTitle.classList.remove('show'), 6000);
        }
    }

    function autoPlayMusic() {
        const bgMusic = document.getElementById('bgMusic');
        const musicToggleBtn = document.getElementById('musicToggleBtn');
        const musicTitle = document.getElementById('musicTitle');

        if (!bgMusic) return;

        bgMusic.play().then(() => {
            onMusicStarted(musicToggleBtn, musicTitle);
        }).catch(() => {
            bgMusic.muted = true;
            bgMusic.play().then(() => {
                onMusicStarted(musicToggleBtn, musicTitle);
            });
        });
    }

    function onMusicStarted(btn, title) {
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            btn.classList.remove('blinking');
        }
        if (title) {
            title.classList.add('show');
            setTimeout(() => title.classList.remove('show'), 6000);
        }
    }

    const unlockAudio = () => {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic && bgMusic.muted) {
            bgMusic.muted = false;
        }
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('scroll', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    autoPlayMusic();

    // --- 4. Add Content Modal & Logic ---
    const addModal = document.getElementById('addModal');
    const closeAddModal = document.getElementById('closeAddModal');
    const inputType = document.getElementById('inputType');
    const titleGroup = document.getElementById('titleGroup');
    const tagGroup = document.getElementById('tagGroup');
    const descGroup = document.getElementById('descGroup');
    const imageGroup = document.getElementById('imageGroup');
    const saveBtn = document.getElementById('saveBtn');
    const inputImage = document.getElementById('inputImage');
    const dateGroup = document.getElementById('dateGroup');

    const storyDetailModal = document.getElementById('storyDetailModal');
    const closeStoryDetail = document.getElementById('closeStoryDetail');
    const storyDetailBody = document.getElementById('storyDetailBody');
    const backToJournal = document.getElementById('backToJournal');

    floatingAddBtn.addEventListener('click', () => {
        addModal.style.display = 'flex';
    });

    closeStoryDetail.addEventListener('click', () => {
        storyDetailModal.style.display = 'none';
    });

    backToJournal.addEventListener('click', () => {
        storyDetailModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === storyDetailModal) storyDetailModal.style.display = 'none';
    });

    closeAddModal.addEventListener('click', () => {
        addModal.style.display = 'none';
    });

    inputType.addEventListener('change', () => {
        const val = inputType.value;
        const titleLabel = document.querySelector('label[for="inputTitle"]');
        const inputTitle = document.getElementById('inputTitle');

        if (val === 'cerita') {
            imageGroup.style.display = 'block';
            titleGroup.style.display = 'block';
            tagGroup.style.display = 'block';
            descGroup.style.display = 'block';
            dateGroup.style.display = 'block';
            titleLabel.innerText = "Judul Cerita";
            inputTitle.placeholder = "Contoh: Ngopi Sore, Jalan-jalan...";
        } else if (val === 'cerita_saja') {
            imageGroup.style.display = 'none';
            titleGroup.style.display = 'block';
            tagGroup.style.display = 'block';
            descGroup.style.display = 'block';
            dateGroup.style.display = 'block';
            titleLabel.innerText = "Judul Cerita";
            inputTitle.placeholder = "Contoh: Ngopi Sore, Jalan-jalan...";
        } else if (val === 'wishlist') {
            imageGroup.style.display = 'none';
            titleGroup.style.display = 'block';
            tagGroup.style.display = 'none';
            descGroup.style.display = 'none';
            dateGroup.style.display = 'none';
            titleLabel.innerText = "Isi Wishlist";
            inputTitle.placeholder = "Contoh: Pergi kulineran...";
        } else {
            imageGroup.style.display = 'block';
            titleGroup.style.display = 'none';
            tagGroup.style.display = 'none';
            descGroup.style.display = 'none';
            dateGroup.style.display = 'none';
        }
    });

    // --- FUNGSI KOMPRES FOTO AGAR MUAT DI FIRESTORE GRATIS ---
    async function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Ukuran foto dikecilkan agar hemat tempat
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress jadi JPEG kualitas 0.6 (sangat hemat data)
                    resolve(canvas.toDataURL('image/jpeg', 0.6));
                };
            };
        });
    }

    // --- REAL-TIME DATA LOAD FROM FIRESTORE ---
    function subscribeToData() {
        const galleryGrid = document.getElementById('galleryGrid');
        const storyList = document.getElementById('storyList');
        const wishlistContainer = document.getElementById('wishlistContainer');

        // 1. Photos
        onSnapshot(query(collection(db, "photos"), orderBy("createdAt", "desc")), (snapshot) => {
            galleryGrid.innerHTML = '';
            snapshot.forEach((docSnap) => {
                const photo = docSnap.data();
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.style.position = 'relative';

                div.innerHTML = `
                    <img src="${photo.url}" alt="Photo" loading="lazy">
                    <button class="delete-btn" onclick="deletePhoto('${docSnap.id}')" title="Hapus Media"><i class="fa-solid fa-trash"></i></button>
                `;
                galleryGrid.appendChild(div);
            });
        });

        // 2. Stories
        onSnapshot(query(collection(db, "stories"), orderBy("date", "asc")), (snapshot) => {
            storyList.innerHTML = '';
            snapshot.forEach((docSnap) => {
                const story = docSnap.data();
                const div = document.createElement('div');
                div.className = 'story-card';
                div.style.position = 'relative';

                div.addEventListener('click', (e) => {
                    if (e.target.closest('.delete-btn')) return;
                    const dateFormatted = story.date ? new Date(story.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
                    storyDetailBody.innerHTML = `
                        <div class="detail-media">
                             ${story.imageUrl ? `<img src="${story.imageUrl}" alt="${story.title}">` : ''}
                        </div>
                        <div class="detail-header">
                            <span class="story-tag">${story.tag}</span>
                            <span style="font-style: italic; color: var(--text-muted);">By: ${story.author || 'Anonim'}</span>
                        </div>
                        <h2 class="detail-title">${story.title}</h2>
                        <div class="detail-desc">${story.desc.replace(/\n/g, '<br>')}</div>
                        ${story.date ? `<p style="color: var(--text-muted);"><i class="fa-regular fa-calendar-days"></i> ${dateFormatted}</p>` : ''}
                    `;
                    storyDetailModal.style.display = 'flex';
                });

                div.innerHTML = `
                    <button class="delete-btn story-delete" onclick="deleteStory('${docSnap.id}')" title="Hapus Cerita"><i class="fa-solid fa-trash"></i></button>
                    <div class="story-image" style="display: ${story.imageUrl ? 'block' : 'none'}">
                        <img src="${story.imageUrl}" alt="${story.title}" loading="lazy">
                    </div>
                    <div class="story-content">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span class="story-tag">${story.tag}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">By: ${story.author || 'Anonim'}</span>
                        </div>
                        <h3 class="story-title">${story.title}</h3>
                        <p class="story-desc">${story.desc}</p>
                        ${story.date ? `<small style="display: block; margin-top: 10px; color: var(--text-muted); font-family: var(--font-main);"><i class="fa-regular fa-calendar-days"></i> ${new Date(story.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</small>` : ''}
                    </div>
                `;
                storyList.appendChild(div);
            });
        });

        // 3. Wishlists
        onSnapshot(query(collection(db, "wishlists"), orderBy("createdAt", "desc")), (snapshot) => {
            wishlistContainer.innerHTML = '';
            snapshot.forEach((docSnap) => {
                const wish = docSnap.data();
                const li = document.createElement('li');
                li.className = 'wishlist-item' + (wish.checked ? ' checked' : '');
                li.innerHTML = `
                    <label class="checkbox-container">
                        <input type="checkbox" onchange="toggleWishlist('${docSnap.id}', ${wish.checked})" ${wish.checked ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span class="item-text">${wish.text}</span>
                    </label>
                    <button class="delete-btn" style="position:relative; top:0; right:0; margin-left:15px; display:inline-block; width:25px; height:25px; font-size:0.75rem;" onclick="deleteWishlist('${docSnap.id}')" title="Hapus Wishlist"><i class="fa-solid fa-trash"></i></button>
                `;
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.justifyContent = 'space-between';
                wishlistContainer.appendChild(li);
            });
        });
    }

    subscribeToData();

    // --- Firebase Functions ---
    window.deletePhoto = async function (id) {
        if (confirm("Yakin ingin menghapus foto ini?")) {
            try {
                await deleteDoc(doc(db, "photos", id));
            } catch (e) { console.error(e); }
        }
    };

    window.deleteStory = async function (id) {
        if (confirm("Yakin ingin menghapus cerita ini?")) {
            try {
                await deleteDoc(doc(db, "stories", id));
            } catch (e) { console.error(e); }
        }
    };

    window.deleteWishlist = async function (id) {
        if (confirm("Yakin ingin menghapus wishlist ini?")) {
            try {
                await deleteDoc(doc(db, "wishlists", id));
            } catch (e) { console.error(e); }
        }
    };

    window.toggleWishlist = async function (id, currentChecked) {
        const isChecking = !currentChecked;
        if (isChecking) {
            const wishlistOverlay = document.getElementById('wishlistSuccessOverlay');
            if (wishlistOverlay) {
                wishlistOverlay.style.display = 'flex';
                setTimeout(async () => {
                    wishlistOverlay.style.animation = 'fadeOutBg 0.5s forwards';
                    const successBox = document.getElementById('wishlistSuccessBox');
                    if (successBox) successBox.style.animation = 'popOut 0.5s forwards';

                    setTimeout(async () => {
                        await deleteDoc(doc(db, "wishlists", id));
                        wishlistOverlay.style.display = 'none';
                    }, 500);
                }, 2500);
            } else {
                await deleteDoc(doc(db, "wishlists", id));
            }
        } else {
            await updateDoc(doc(db, "wishlists", id), { checked: false });
        }
    };

    saveBtn.addEventListener('click', async () => {
        const val = inputType.value;
        const file = inputImage.files[0];
        const author = document.getElementById('inputAuthor').value;

        if ((val === 'foto' || val === 'cerita') && !file) {
            alert("Pilih foto terlebih dahulu!");
            return;
        }
        if (!author) {
            alert("Pilih siapa penulisnya terlebih dahulu!");
            return;
        }

        saveBtn.innerText = "Menghubungkan ke Cloud...";
        saveBtn.disabled = true;

        try {
            let photoData = null;

            if (file) {
                // Kompres foto biar ukurannya kecil (hemat database gratis)
                photoData = await compressImage(file);
            }

            if (val === 'wishlist') {
                const title = document.getElementById('inputTitle').value || 'Tanpa Keterangan';
                await addDoc(collection(db, "wishlists"), {
                    text: title,
                    checked: false,
                    createdAt: serverTimestamp()
                });
            } else {
                if (val === 'foto' || val === 'cerita') {
                    if (photoData) {
                        await addDoc(collection(db, "photos"), {
                            url: photoData,
                            createdAt: serverTimestamp()
                        });
                    }
                }

                if (val === 'cerita' || val === 'cerita_saja') {
                    const title = document.getElementById('inputTitle').value || 'Tanpa Judul';
                    const tag = document.getElementById('inputTag').value || 'Memori';
                    const desc = document.getElementById('inputDesc').value || '';
                    const date = document.getElementById('inputDate').value;

                    await addDoc(collection(db, "stories"), {
                        imageUrl: photoData,
                        title,
                        tag,
                        desc,
                        date,
                        author,
                        createdAt: serverTimestamp()
                    });
                }
            }

            // Reset form
            inputImage.value = '';
            document.getElementById('inputTitle').value = '';
            document.getElementById('inputTag').value = '';
            document.getElementById('inputDesc').value = '';
            document.getElementById('inputDate').value = '';
            document.getElementById('inputAuthor').value = '';
            addModal.style.display = 'none';

            const saveOverlay = document.getElementById('saveSuccessOverlay');
            if (saveOverlay) {
                saveOverlay.style.display = 'flex';
                setTimeout(() => {
                    saveOverlay.style.animation = 'fadeOutBg 0.5s forwards';
                    const saveBox = document.getElementById('saveSuccessBox');
                    if (saveBox) saveBox.style.animation = 'popOut 0.5s forwards';
                    setTimeout(() => { saveOverlay.style.display = 'none'; }, 500);
                }, 2500);
            }

        } catch (e) {
            console.error(e);
            alert("Gagal koneksi. Pastikan Firestore 'Rules' sudah diatur ke 'Test Mode'!");
        } finally {
            saveBtn.innerText = "Simpan Momen";
            saveBtn.disabled = false;
        }
    });

    // --- 9. Music Player Logic ---
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicNextBtn = document.getElementById('musicNextBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (musicToggleBtn && bgMusic) {
        musicToggleBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    musicToggleBtn.classList.remove('blinking');
                }).catch(err => console.log("Gagal putar musik"));
            } else {
                bgMusic.pause();
                musicToggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            }
        });

        if (musicNextBtn) {
            musicNextBtn.addEventListener('click', () => {
                currentSongIndex = (currentSongIndex + 1) % playlist.length;
                updateMusicInfo();
                bgMusic.play();
                musicToggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            });
        }

        bgMusic.addEventListener('ended', () => {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            updateMusicInfo();
            bgMusic.play();
        });
    }
});
