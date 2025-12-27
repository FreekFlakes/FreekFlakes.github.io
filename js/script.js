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
        title: 'Raijin.txt - Notepad',
        icon: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png',
        type: 'notepad',
        render: () => `
            <div class="menu-bar">
                <div class="menu-item">File</div>
                <div class="menu-item">Edit</div>
                <div class="menu-item">Search</div>
                <div class="menu-item">Help</div>
            </div>
            <textarea class="notepad-body">Raijin (雷神) is a god of lightning, thunder and storms in Japanese mythology and the Shinto religion.</textarea>
        `
    },
    'gallery': {
        title: 'Thunder_Gallery - Paint',
        icon: 'https://win98icons.alexmeub.com/icons/png/paint_file-2.png',
        type: 'generic',
        render: () => '<p>Loading images...</p><div style="background:black; width:100%; height:100px; color:white; display:flex; align-items:center; justify-content:center;">[Placeholder Image]</div>'
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
});

// Icon double click simulated by HTML ondblclick

// Prevent default native drag (ghost image)
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
});
