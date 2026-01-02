// Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    document.getElementById('clock').innerText = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// Window Management
let zIndexCounter = 100;
const windowArea = document.getElementById('window-area');
const taskbarApps = document.getElementById('taskbar-apps');

const appContent = {
    'my-computer': {
        title: 'My Computer',
        icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png',
        type: 'explorer',
        render: () => `
            <div class="menu-bar">
                <div class="menu-item">File</div>
                <div class="menu-item">Edit</div>
                <div class="menu-item">View</div>
                <div class="menu-item">Help</div>
            </div>
            <div class="address-bar">
                <span>Address</span>
                <div class="address-input">My Computer</div>
            </div>
            <div class="explorer-body">
                <div class="explorer-item">
                    <img src="https://win98icons.alexmeub.com/icons/png/hard_disk_drive-1.png">
                    <span>(C:)</span>
                </div>
                <div class="explorer-item">
                    <img src="https://win98icons.alexmeub.com/icons/png/cd_drive-0.png">
                    <span>(D:)</span>
                </div>
                <div class="explorer-item">
                    <img src="https://win98icons.alexmeub.com/icons/png/control_panel-1.png">
                    <span>Control Panel</span>
                </div>
            </div>
        `
    },
    'raijin-bio': {
        title: 'Notepad',
        icon: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png',
        type: 'notepad',
        content: 'Raijin (雷神) is a god of lightning, thunder and storms in Japanese mythology/n/n(Select a file from the Lore folder to read more.)',
        render: function () {
            const textContent = this.content || '';
            return `
            <div class="menu-bar">
                <div class="menu-item">File</div>
                <div class="menu-item">Edit</div>
                <div class="menu-item">Search</div>
                <div class="menu-item">Help</div>
            </div>
            <textarea class="notepad-body">${textContent}</textarea>
        `}
    },
    'lore-folder': {
        title: 'Raijin Lore',
        icon: 'https://win98icons.alexmeub.com/icons/png/directory_open-0.png',
        type: 'explorer',
        render: () => `
            <div class="menu-bar">
                <div class="menu-item">File</div>
                <div class="menu-item">Edit</div>
                <div class="menu-item">View</div>
                <div class="menu-item">Help</div>
            </div>
            <div class="explorer-body">
                <div class="explorer-item" onclick="openNotepad('raijin_lore.txt')">
                    <img src="https://win98icons.alexmeub.com/icons/png/template_empty-2.png">
                    <span>raijin_lore.txt</span>
                </div>
                <div class="explorer-item" onclick="openNotepad('drums.txt')">
                    <img src="https://win98icons.alexmeub.com/icons/png/template_empty-2.png">
                    <span>drums.txt</span>
                </div>
                <div class="explorer-item" onclick="openNotepad('folklore.txt')">
                    <img src="https://win98icons.alexmeub.com/icons/png/template_empty-2.png">
                    <span>folklore.txt</span>
                </div>
            </div>
        `
    },
    'gallery': {
        title: 'Thunder_Gallery - Paint',
        icon: 'https://win98icons.alexmeub.com/icons/png/paint_file-2.png',
        type: 'generic',
        render: () => `
            <div style="padding:10px; text-align:center; background-color:#fff; height:100%; overflow-y:auto;">
                <p style="margin-top:0; color:#000;">Collection of sacred thunder imagery</p>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                    <div style="border: 2px solid #808080; padding: 2px;">
                        <img src="img/raijin_pixel.png" style="width: 150px; height: auto; display: block;" title="Raijin Sprite">
                        <p style="margin:2px 0 0; font-size:10px;">Classic Sprite</p>
                    </div>
                    <div style="border: 2px solid #808080; padding: 2px;">
                        <img src="img/raijin_drums.png" style="width: 150px; height: auto; display: block;" title="Thunder Drums">
                        <p style="margin:2px 0 0; font-size:10px;">Drum Detail</p>
                    </div>
                    <div style="border: 2px solid #808080; padding: 2px;">
                        <img src="img/raijin_descending.png" style="width: 150px; height: auto; display: block;" title="Descent">
                        <p style="margin:2px 0 0; font-size:10px;">Descent</p>
                    </div>
                    <div style="border: 2px solid #808080; padding: 2px;">
                        <img src="img/raijin_portrait.png" style="width: 150px; height: auto; display: block;" title="Portrait">
                        <p style="margin:2px 0 0; font-size:10px;">Portrait</p>
                    </div>
                    <div style="border: 2px solid #808080; padding: 2px;">
                        <img src="img/raijin_striking.png" style="width: 150px; height: auto; display: block;" title="Striking">
                        <p style="margin:2px 0 0; font-size:10px;">Action</p>
                    </div>
                </div>
            </div>
        `
    }
};

function openWindow(appId) {
    // Check if already open
    if (document.getElementById(`window-${appId}`)) {
        bringToFront(appId);
        return;
    }

    const app = appContent[appId];
    const win = document.createElement('div');
    win.className = 'window-98';
    win.id = `window-${appId}`;
    win.style.zIndex = ++zIndexCounter;

    // Random initial position
    const randX = 50 + Math.random() * 50;
    const randY = 50 + Math.random() * 50;
    win.style.left = `${randX}px`;
    win.style.top = `${randY}px`;

    const contentHtml = app.render ? app.render() : app.content; // Fallback

    win.innerHTML = `
        <div class="title-bar" onmousedown="startDrag(event, '${appId}')">
            <div class="title-bar-text">
                <img src="${app.icon}" width="16" height="16">
                ${app.title}
            </div>
            <div class="title-bar-controls">
                <button aria-label="Minimize">_</button>
                <button aria-label="Maximize">□</button>
                <button aria-label="Close" onclick="closeWindow('${appId}')">X</button>
            </div>
        </div>
        <div class="window-body">
            ${contentHtml}
        </div>
        <div class="resize-handle" onmousedown="initResize(event, this.parentNode)"></div>
    `;

    win.addEventListener('mousedown', () => bringToFront(appId));
    windowArea.appendChild(win);

    // Add to Taskbar
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-app active';
    taskbarItem.id = `taskbar-${appId}`;
    taskbarItem.innerHTML = `<img src="${app.icon}"> ${app.title}`;
    taskbarItem.onclick = () => toggleWindow(appId);
    taskbarApps.appendChild(taskbarItem);
}

function closeWindow(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (win) win.remove();
    const taskItem = document.getElementById(`taskbar-${appId}`);
    if (taskItem) taskItem.remove();
}

function bringToFront(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (win) {
        win.style.zIndex = ++zIndexCounter;
        updateTaskbarActiveState(appId);
    }
}

function toggleWindow(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (win) {
        if (win.style.display === 'none') {
            win.style.display = 'flex';
            bringToFront(appId);
        } else {
            // If it's the top window, minimize it
            if (parseInt(win.style.zIndex) === zIndexCounter) {
                win.style.display = 'none';
                document.getElementById(`taskbar-${appId}`).classList.remove('active');
            } else {
                bringToFront(appId);
            }
        }
    }
}

function updateTaskbarActiveState(activeAppId) {
    // Remove active class from all
    document.querySelectorAll('.taskbar-app').forEach(el => el.classList.remove('active'));
    // Add to current
    const activeItem = document.getElementById(`taskbar-${activeAppId}`);
    if (activeItem) activeItem.classList.add('active');
}

function minimizeAll() {
    const windows = document.querySelectorAll('.window-98');
    windows.forEach(win => {
        win.style.display = 'none';
        const appId = win.id.replace('window-', '');
        document.getElementById(`taskbar-${appId}`).classList.remove('active');
    });
}

// Icon Management
const desktopIcons = document.querySelectorAll('.desktop-icon');

function arrangeIcons() {
    let startTop = 10;
    let startLeft = 10;
    const gap = 100; // Vertical spacing

    desktopIcons.forEach((icon, index) => {
        icon.style.top = `${startTop + (index * gap)}px`;
        icon.style.left = `${startLeft}px`;

        // Add mousedown for dragging icons
        icon.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectIcon(icon);
            startDragElement(e, icon);
        });
    });
}
arrangeIcons();

function selectIcon(selectedIcon) {
    desktopIcons.forEach(icon => icon.classList.remove('selected'));
    selectedIcon.classList.add('selected');
}

document.getElementById('desktop').addEventListener('mousedown', (e) => {
    if (e.target.id === 'desktop') {
        desktopIcons.forEach(icon => icon.classList.remove('selected'));
    }
});

// Generic Drag Functionality
let isDragging = false;
let currentDragElement = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startDrag(e, appId) {
    // Wrapper for window title bar drag
    if (e.target.tagName === 'BUTTON') return;
    e.preventDefault();
    const win = document.getElementById(`window-${appId}`);
    startDragElement(e, win);
    bringToFront(appId);
}

function startDragElement(e, element) {
    isDragging = true;
    currentDragElement = element;
    const rect = element.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
}

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentDragElement) {
        // Simple bounds check could go here
        currentDragElement.style.left = `${e.clientX - dragOffsetX}px`;
        currentDragElement.style.top = `${e.clientY - dragOffsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentDragElement = null;
    isResizing = false;
    currentResizeElement = null;
});

// Resize Functionality
let isResizing = false;
let currentResizeElement = null;
let startWidth, startHeight, startX, startY;

function initResize(e, windowElement) {
    e.preventDefault();
    e.stopPropagation(); // Prevent drag start
    isResizing = true;
    currentResizeElement = windowElement;
    startX = e.clientX;
    startY = e.clientY;

    // Get current computed style dimensions (excluding borders if box-sizing is border-box, checking logic)
    // The .window-98 width is likely set in style or defaults.
    // CSS says width: 400px initially.
    const rect = windowElement.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;

    bringToFront(windowElement.id.replace('window-', ''));
}

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentDragElement) {
        currentDragElement.style.left = `${e.clientX - dragOffsetX}px`;
        currentDragElement.style.top = `${e.clientY - dragOffsetY}px`;
    }
    if (isResizing && currentResizeElement) {
        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);

        // Minimum dictionary
        if (width > 200) currentResizeElement.style.width = `${width}px`;
        if (height > 150) currentResizeElement.style.height = `${height}px`;
    }
});

// Icon double click simulated by HTML ondblclick

// Prevent default native drag (ghost image)
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
});


/* Start Menu & Shutdown Logic */
const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');
const shutdownDialog = document.getElementById('window-shutdown');
const shutdownScreen = document.getElementById('shutdown-screen');

function toggleStartMenu() {
    if (startMenu.style.display === 'flex') {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
    } else {
        startMenu.style.display = 'flex';
        startButton.classList.add('active');
    }
}

// Bind click to Start Button
startButton.onclick = (e) => {
    e.stopPropagation();
    toggleStartMenu();
};

// Text File Content Loading (Simulated fetch)
const fileSystem = {
    'raijin_lore.txt': `Raijin (雷神), also known as Kaminari-sama (雷様) or Raiden-sama (雷電様), is a god of lightning, thunder, and storms in Japanese mythology and the Shinto religion.

The name "Raijin" is derived from the Japanese words "rai" (thunder) and "shin" or "jin" (god). He is typically depicted as a demon-looking spirit beating drums to create thunder, usually with the symbol 'tomoe' drawn on the drums.

Origins:
According to the Kojiki, Raijin was born from the rotting corpse of Izanami no Mikoto specifically, from her chest, after she died giving birth to the fire god Kagutsuchi and descended into Yomi (the underworld). When her husband Izanagi went to retrieve her, he was horrified by her decaying appearance and fled, with Raijin and other thunder deities chasing him.

Appearance:
He is often portrayed as a muscular, fierce figure with red skin, a terrifying face, and wild hair blowing in the storm. Despite his frightening appearance, he is a protective figure who defends Japan against invaders and is credited with the "Divine Wind" (Kamikaze) that stopped the Mongol invasions in 1274 and 1281.

Companions:
He is often accompanied by Fujin (the god of wind) and his son Raitaro (Thunder Boy).`,

    'drums.txt': `The Drums of Thunder

Raijin's most distinctive attribute is his ring of drums, known as 'Taiko'. He carries these drums on his back or floats surrounded by them in a ring.

Thunder Creation:
By striking these drums with his hammers/drumsticks, Raijin creates the sound of thunder that rolls across the sky. Each drum beat sends a shockwave that we hear as the rumble of a storm.

Symbolism:
The drums are decorated with the 'Tomoe' (巴) symbol, usually a Mitsudomoe (three comma shapes swirling in a circle). This symbol represents the cycle of life, the play of forces in the cosmos, and the trinity of heaven, earth, and humanity. It is strongly associated with Shinto shrines and the thunder god himself.

Power:
The drums are not just instruments but weapons of divine power. They channel the raw energy of the storm. In some legends, the sound of his drums can summon rain to end droughts, making him a vital deity for agriculture and farmers.`,

    'folklore.txt': `Folklore & Superstitions

Raijin is a figure of both fear and respect in Japanese culture.

Hide Your Belly Button!
One of the most famous superstitions involving Raijin is the warning parents give to children during thunderstorms: "Hide your belly button!" (Kaminari-sama ga heso o tori ni kuru). It is said that Raijin loves to eat human navels (belly buttons), so you must cover your stomach to protect yourself. This folklore likely originated as a way to ensure children stayed warm and didn't expose their stomachs to the sudden temperature drops that accompany rainstorms.

The God Catcher
There is a legend about Sugaru, the "God Catcher," who was ordered by the Emperor to catch the Thunder God to stop a storm. Sugaru prayed and then, with divine help, managed to bind Raijin, bringing him to the palace only to have the Emperor release him in exchange for ending the storms.

Temples and Statues
Statues of Raijin (often paired with Fujin, the Wind God) guard the entrances of many shrines and temples in Japan, most famously the Kaminarimon (Thunder Gate) of Senso-ji Temple in Asakusa, Tokyo. Standing there, they protect the sacred space from evil spirits and storms.`
};

async function openNotepad(filename) {
    let content = "Loading...";
    try {
        const response = await fetch(filename);
        if (response.ok) {
            content = await response.text();
        } else {
            content = "Error loading file.";
        }
    } catch (e) {
        content = fileSystem[filename] || "File not found.";
    }

    // Reuse or create notepad window
    const appId = 'notepad-' + filename;

    // Quick hack to reuse the openWindow structure but override content
    // We'll define a temporary app entry
    appContent[appId] = {
        title: filename + ' - Notepad',
        icon: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png',
        type: 'notepad',
        content: content,
        render: appContent['raijin-bio'].render
    };

    openWindow(appId);
}

// Close Start Menu when clicking outside
document.addEventListener('click', (e) => {
    if (startMenu.style.display === 'flex' &&
        !startMenu.contains(e.target) &&
        !startButton.contains(e.target)) {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
    }
});

function openRun() {
    toggleStartMenu();
    // Placeholder for Run dialog
    alert("Run dialog not implemented yet.");
}

function openShutdown() {
    toggleStartMenu();
    shutdownDialog.style.display = 'flex';

    // Center the window manually (better for drag behavior than CSS transform)
    const rect = shutdownDialog.getBoundingClientRect();
    const x = (window.innerWidth - 350) / 2; // 350 is width defined in HTML/CSS
    const y = (window.innerHeight - rect.height) / 2;

    // Default fallback if rect is empty (hidden)
    shutdownDialog.style.left = `${Math.max(0, x)}px`;
    shutdownDialog.style.top = `${Math.max(0, (window.innerHeight - 200) / 2)}px`;
}

function closeShutdown() {
    shutdownDialog.style.display = 'none';
}

function performShutdown() {
    const action = document.querySelector('input[name="shutdown-action"]:checked').value;

    closeShutdown();

    if (action === 'shutdown') {
        // Hide UI, show safe screen
        document.getElementById('taskbar').style.display = 'none';
        document.getElementById('desktop').style.display = 'none';
        shutdownScreen.style.display = 'flex';

        // Optional: Enter full screen to make it immersive?
        // document.documentElement.requestFullscreen();

    } else if (action === 'restart' || action === 'restart-dos') {
        location.reload();
    }
}

