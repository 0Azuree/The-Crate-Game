// --- Game State Variables ---
let money = 500;
let moneySpent = 0;
let moneyMade = 0;
let inventory = [];
let selectedItemIndex = -1;
let selectedTab = 'crates';
let tapCount = 0;
let jobCooldown = 0;
let treasureCooldown = 0;
const CRATE_SELL_PRICE = 50;
let codeUsed = false;
let foundHiddenItems = [];
let buyAmount = 1;

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const mainScreen = document.getElementById('main-screen');
const moneyScreen = document.getElementById('money-screen');
const workScreen = document.getElementById('work-screen');
const inventoryScreen = document.getElementById('inventory-screen');
const openCrateScreen = document.getElementById('open-crate-screen');
const shopScreen = document.getElementById('shop-screen');
const itemDexScreen = document.getElementById('item-dex-screen');
const settingsScreen = document.getElementById('settings-screen');
const creditsScreen = document.getElementById('credits-screen');

const startButton = document.getElementById('start-button');
const moneyDisplay = document.getElementById('money-display');
const moneySpentDisplay = document.getElementById('money-spent-display');
const moneyMadeDisplay = document.getElementById('money-made-display');
const totalProfitDisplay = document.getElementById('total-profit-display');
const checkMoneyBtn = document.getElementById('check-money-btn');
const inventoryBtn = document.getElementById('inventory-btn');
const shopBtn = document.getElementById('shop-btn');
const workBtn = document.getElementById('work-btn');
const itemDexBtn = document.getElementById('item-dex-btn');
const settingsBtn = document.getElementById('settings-btn');
const creditsBtn = document.getElementById('credits-btn');
const makerCredit = document.getElementById('maker-credit');
const secretCodeBox = document.getElementById('secret-code-box');
const secretCodeInput = document.getElementById('secret-code-input');
const secretCodeSubmit = document.getElementById('secret-code-submit');
const saveGameBtn = document.getElementById('save-game-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const resetPopup = document.getElementById('reset-popup');
const resetYesBtn = document.getElementById('reset-yes-btn');
const resetNoBtn = document.getElementById('reset-no-btn');

const cratesContainer = document.getElementById('crates-container');
const itemsContainer = document.getElementById('items-container');
const cratesTab = document.getElementById('crates-tab');
const itemsTab = document.getElementById('items-tab');
const openCrateBtn = document.getElementById('open-crate-btn');
const sellItemBtn = document.getElementById('sell-item-btn');
const backFromMoneyBtn = document.getElementById('back-from-money-btn');
const backToMainBtn = document.getElementById('back-to-main-btn');
const backFromShopBtn = document.getElementById('back-from-shop-btn');
const backFromWorkBtn = document.getElementById('back-from-work-btn');
const backFromItemDexBtn = document.getElementById('back-from-item-dex-btn');
const backFromSettingsBtn = document.getElementById('back-from-settings-btn');
const backFromCreditsBtn = document.getElementById('back-from-credits-btn');

const buyButtons = document.querySelectorAll('.buy-button');
const buyAmountSlider = document.getElementById('buy-amount-slider');
const buyAmountValue = document.getElementById('buy-amount-value');
const tapInstruction = document.getElementById('tap-instruction');
const openingCratePixelart = document.getElementById('opening-crate-pixelart');
const itemDropDisplay = document.getElementById('item-drop-display');
const finishOpeningBtn = document.getElementById('finish-opening-btn');
const doJobBtn = document.getElementById('do-job-btn');
const jobCooldownTimer = document.getElementById('job-cooldown');
const digTreasureBtn = document.getElementById('dig-treasure-btn');
const treasureCooldownTimer = document.getElementById('treasure-cooldown');

const notificationPopup = document.getElementById('notification-popup');
const notificationMessage = document.getElementById('notification-message');

const itemDexGrid = document.getElementById('item-dex-grid');


// --- Item Data ---
const HIDDEN_ITEMS = [
    { name: 'Stick', sellValue: 80000, rarity: 'hidden', artClass: 'hidden stick' },
    { name: 'Baba\'s Belt', sellValue: 100000, rarity: 'hidden', artClass: 'hidden baba' },
    { name: 'Shoe', sellValue: 50000, rarity: 'hidden', artClass: 'hidden shoe' },
    { name: 'Button', sellValue: 50000, rarity: 'hidden', artClass: 'hidden button' }
];

const ITEMS = {
    common: [
        { name: 'Googly-Eyed Rock', sellValue: 15, artClass: 'googly-rock' },
        { name: 'Used Gum Wrapper', sellValue: 5 },
        { name: 'Lint Collection', sellValue: 10 },
        { name: 'Slightly Bent Spoon', sellValue: 20, artClass: 'bent-spoon' },
        { name: 'Expired Coupon', sellValue: 2 },
        { name: 'Single Sock', sellValue: 8 },
        { name: 'Broken Pencil', sellValue: 4 },
        { name: 'Stale Cracker', sellValue: 1 },
        { name: 'Pet Rock\'s Leash', sellValue: 12 },
        { name: 'Empty Water Bottle', sellValue: 3 },
        { name: 'Crumpled Receipt', sellValue: 6 },
        { name: 'Plastic Bottle Cap', sellValue: 7 },
        { name: 'Loose Screw', sellValue: 11 },
        { name: 'Used Tea Bag', sellValue: 9 },
        { name: 'Dust Bunny', sellValue: 14 },
        { name: 'Mystery Key', sellValue: 25 },
        { name: 'Worn-out Eraser', sellValue: 18 },
        { name: 'Chewed-up Pen', sellValue: 16 },
        { name: 'Tangled Earbuds', sellValue: 22 },
        { name: 'Small Pebblestone', sellValue: 5 },
        { name: 'Ripped Paper', sellValue: 1 },
        { name: 'Half-used Matchbook', sellValue: 13 },
        { name: 'Dead Fly', sellValue: 0.5 },
        { name: 'Dry Leaf', sellValue: 1 },
        { name: 'Rusty Nail', sellValue: 2 },
        { name: 'Old Shoelace', sellValue: 10 },
        { name: 'Fuzzy Dice', sellValue: 17 },
        { name: 'Bent Paperclip', sellValue: 3 },
        { name: 'Cardboard Box', sellValue: 20 },
        { name: 'Unidentified Scraps', sellValue: 1 }
    ],
    uncommon: [
        { name: 'Vintage Cassette Player', sellValue: 500, artClass: 'cassette' },
        { name: 'Fidget Spinner', sellValue: 350, artClass: 'fidget-spinner' },
        { name: 'Signed Napkin', sellValue: 600 },
        { name: 'Rubber Chicken', sellValue: 450 },
        { name: 'Half-Eaten Sandwich', sellValue: 100 },
        { name: 'A Bag of Marbles', sellValue: 250 },
        { name: 'Glow-in-the-Dark Star', sellValue: 150 },
        { name: 'Retro Pager', sellValue: 700 },
        { name: 'Floppy Hat', sellValue: 300 },
        { name: 'Well-loved Teddy Bear', sellValue: 400 },
        { name: 'Troll Doll with Blue Hair', sellValue: 550 },
        { name: 'Polished Stone', sellValue: 800 },
        { name: 'Unopened Action Figure', sellValue: 900 },
        { name: 'Magic 8-Ball', sellValue: 750 },
        { name: 'Handheld Game Console', sellValue: 1000 },
        { name: 'Jingle Bell', sellValue: 120 },
        { name: 'Tiny Umbrella', sellValue: 200 },
        { name: 'A single, clean feather', sellValue: 180 },
        { name: 'A key to an unknown door', sellValue: 650 },
        { name: 'A small, shiny orb', sellValue: 1050 },
        { name: 'A working yo-yo', sellValue: 320 },
        { name: 'A set of old-school playing cards', sellValue: 500 },
        { name: 'An antique coin', sellValue: 1100 },
        { name: 'A miniature globe', sellValue: 950 },
        { name: 'A compass that points nowhere', sellValue: 780 },
        { name: 'A sealed letter with no address', sellValue: 850 },
        { name: 'A small, ornate box', sellValue: 1300 },
        { name: 'A tiny, wooden carving', sellValue: 470 },
        { name: 'A broken wristwatch', sellValue: 210 },
        { name: 'A stack of old photographs', sellValue: 530 },
        { name: 'A jar of colorful buttons', sellValue: 280 },
        { name: 'A well-preserved beetle', sellValue: 620 },
        { name: 'A music box', sellValue: 1400 },
        { name: 'A map to a fake treasure', sellValue: 710 },
        { name: 'A vintage comic book', sellValue: 890 },
        { name: 'A toy soldier', sellValue: 190 },
        { name: 'A small snow globe', sellValue: 680 },
        { name: 'A rusty whistle', sellValue: 150 },
        { name: 'A miniature telescope', sellValue: 1200 },
        { name: 'A perfectly round rock', sellValue: 230 }
    ],
    rare: [
        { name: 'Crystal Skull', sellValue: 1500, artClass: 'crystal-skull' },
        { name: 'Ancient Floppy Disk', sellValue: 1800 },
        { name: 'Jar of Fireflies', sellValue: 2000 },
        { name: 'First Edition Comic Book', sellValue: 3000 },
        { name: 'Lucky Rabbit\'s Foot', sellValue: 2500 },
        { name: 'Hand-carved Wooden Mask', sellValue: 3500 },
        { name: 'A Golden Ring', sellValue: 4000 },
        { name: 'The Sword of a Former King (replica)', sellValue: 2800 },
        { name: 'A bottle of unidentifiable liquid', sellValue: 2200 },
        { name: 'A set of glowing dice', sellValue: 4500 },
        { name: 'A perfectly preserved fossil', sellValue: 5000 },
        { name: 'A cursed necklace', sellValue: 1000 },
        { name: 'A magical key', sellValue: 3200 },
        { name: 'A wizard\'s hat', sellValue: 3800 },
        { name: 'A crystal ball', sellValue: 5500 },
        { name: 'A dragon\'s scale', sellValue: 6000 },
        { name: 'A grimoire of recipes', sellValue: 4200 },
        { name: 'A time-traveling sundial', sellValue: 7000 },
        { name: 'A potion of healing', sellValue: 2700 },
        { name: 'A jar of starlight', sellValue: 6500 }
    ],
    mythical: [
        { name: 'Golden Compass', sellValue: 20000, artClass: 'golden-compass' },
        { name: 'Bottle of Captured Sunlight', sellValue: 25000 },
        { name: 'Ever-Burning Candle', sellValue: 30000 },
        { name: 'Orb of Eternal Snowfall', sellValue: 35000 },
        { name: 'The Last Unicorn Horn', sellValue: 40000 },
        { name: 'Glove of Telekinesis', sellValue: 45000 },
        { name: 'Heart of a Golem', sellValue: 50000 },
        { name: 'Feather from an Archangel', sellValue: 60000 },
        { name: 'Map to the Lost City of Atlantis', sellValue: 75000 },
        { name: 'The philosopher\'s stone', sellValue: 100000 },
        { name: 'A vial of vampire blood', sellValue: 80000 },
        { name: 'A phoenix feather', sellValue: 90000 },
        { name: 'A werewolf\'s fang', sellValue: 95000 },
        { name: 'A griffin\'s claw', sellValue: 85000 },
        { name: 'A dragon\'s tear', sellValue: 70000 }
    ],
    legendary: [
        { name: 'Amulet of Time', sellValue: 50000, artClass: 'amulet-of-time' },
        { name: 'Phoenix Feather', sellValue: 75000 },
        { name: 'Crown of the Sun King', sellValue: 150000 },
        { name: 'The Holy Grail', sellValue: 200000 },
        { name: 'The Excalibur Sword', sellValue: 300000, artClass: 'excalibur-sword' },
        { name: 'The Ark of the Covenant', sellValue: 500000 },
        { name: 'The Ring of Power', sellValue: 1000000 },
        { name: 'A vial of God\'s essence', sellValue: 2500000 },
        { name: 'The Golden Fleece', sellValue: 4000000 },
        { name: 'The Trident of Poseidon', sellValue: 5000000 }
    ],
    hidden: HIDDEN_ITEMS
};

const RARITY_CHANCES = {
    common: 0.40,
    uncommon: 0.28,
    rare: 0.19,
    mythical: 0.07,
    legendary: 0.05,
    hidden: 0.01,
};

const CRATE_PRICES = {
    normal: 500,
    uncommon: 800,
    rare: 1100,
};

const CRATE_CONTENTS = {
    normal: ['common', 'uncommon'],
    uncommon: ['uncommon', 'rare', 'mythical'],
    rare: ['rare', 'mythical', 'legendary', 'hidden'],
};

// --- Game Logic Functions ---
function updateFinancialStats() {
    moneyDisplay.textContent = `$${money}`;
    moneySpentDisplay.textContent = `$${moneySpent}`;
    moneyMadeDisplay.textContent = `$${moneyMade}`;
    const profit = moneyMade - moneySpent;
    totalProfitDisplay.textContent = `$${profit}`;
    if (profit >= 0) {
        totalProfitDisplay.classList.remove('text-red');
        totalProfitDisplay.classList.add('text-green');
    } else {
        totalProfitDisplay.classList.remove('text-green');
        totalProfitDisplay.classList.add('text-red');
    }
}

function showScreen(screenId) {
    const screens = [startScreen, mainScreen, moneyScreen, workScreen, inventoryScreen, openCrateScreen, shopScreen, itemDexScreen, settingsScreen, creditsScreen];
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });
}

function showNotification(message) {
    notificationMessage.textContent = message;
    *notificationPopup.classList.add('visible');*
    
    setTimeout(() => {
        **notificationPopup.classList.remove('visible');**
    }, 3000);
}

function saveGame() {
    localStorage.setItem('gameMoney', money);
    localStorage.setItem('gameMoneySpent', moneySpent);
    localStorage.setItem('gameMoneyMade', moneyMade);
    localStorage.setItem('gameInventory', JSON.stringify(inventory));
    localStorage.setItem('jobCooldown', jobCooldown);
    localStorage.setItem('treasureCooldown', treasureCooldown);
    localStorage.setItem('codeUsed', codeUsed);
    localStorage.setItem('foundHiddenItems', JSON.stringify(foundHiddenItems));
}

function loadGame() {
    const savedMoney = localStorage.getItem('gameMoney');
    const savedMoneySpent = localStorage.getItem('gameMoneySpent');
    const savedMoneyMade = localStorage.getItem('gameMoneyMade');
    const savedInventory = localStorage.getItem('gameInventory');
    const savedJobCooldown = localStorage.getItem('jobCooldown');
    const savedTreasureCooldown = localStorage.getItem('treasureCooldown');
    const savedCodeUsed = localStorage.getItem('codeUsed');
    const savedHiddenItems = localStorage.getItem('foundHiddenItems');
    
    if (savedMoney) {
        money = parseInt(savedMoney);
    } else {
        money = 500;
    }
    if (savedMoneySpent) {
        moneySpent = parseInt(savedMoneySpent);
    }
    if (savedMoneyMade) {
        moneyMade = parseInt(savedMoneyMade);
    }
    if (savedInventory) {
        inventory = JSON.parse(savedInventory);
    }
    if (savedJobCooldown) {
        jobCooldown = parseInt(savedJobCooldown);
    }
    if (savedTreasureCooldown) {
        treasureCooldown = parseInt(savedTreasureCooldown);
    }
    if (savedCodeUsed) {
        codeUsed = savedCodeUsed === 'true';
    }
    if (savedHiddenItems) {
        foundHiddenItems = JSON.parse(savedHiddenItems);
    }
    
    updateFinancialStats();
    renderInventory();
    
    if (jobCooldown > Date.now()) {
        const remainingTime = Math.ceil((jobCooldown - Date.now()) / 1000);
        doJobBtn.disabled = true;
        updateCooldownDisplay('job', remainingTime);
    }
    if (treasureCooldown > Date.now()) {
        const remainingTime = Math.ceil((treasureCooldown - Date.now()) / 1000);
        digTreasureBtn.disabled = true;
        updateCooldownDisplay('treasure', remainingTime);
    }
}

function createItemPixelArt(item) {
    if (item.type === 'crate') {
        return `<div class="pixel-art crate"></div>`;
    }
    const itemData = Object.values(ITEMS).flat().find(i => i.name === item.name);
    const artClass = itemData.artClass ? `${item.rarity} ${itemData.artClass}` : `${item.rarity}`;
    
    if (itemData && itemData.artClass) {
        return `<div class="pixel-art ${artClass}"></div>`;
    }
    return `<div class="pixel-art ${item.rarity}"></div>`;
}

function renderInventory() {
    cratesContainer.innerHTML = '';
    itemsContainer.innerHTML = '';
    
    const crates = inventory.filter(item => item.type === 'crate');
    const items = inventory.filter(item => item.type === 'item');

    const totalCrateSlots = Math.max(crates.length, 20);
    crates.forEach((crate, index) => {
        const crateEl = document.createElement('div');
        crateEl.classList.add('item-slot', `rarity-${crate.rarity}`);
        crateEl.innerHTML = createItemPixelArt(crate);
        crateEl.dataset.index = inventory.indexOf(crate);
        crateEl.addEventListener('click', () => selectItem(inventory.indexOf(crate)));
        cratesContainer.appendChild(crateEl);
    });

    for (let i = crates.length; i < totalCrateSlots; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('item-slot');
        cratesContainer.appendChild(emptySlot);
    }

    const totalItemSlots = Math.max(items.length, 20);
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('item-slot', `rarity-${item.rarity}`);
        itemEl.innerHTML = createItemPixelArt(item);
        itemEl.dataset.index = inventory.indexOf(item);
        itemEl.addEventListener('click', () => selectItem(inventory.indexOf(item)));
        itemsContainer.appendChild(itemEl);
    });

    for (let i = items.length; i < totalItemSlots; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('item-slot');
        itemsContainer.appendChild(emptySlot);
    }

    updateActionButtons();
}

function renderItemDex() {
    itemDexGrid.innerHTML = '';
    
    const allItems = [];
    for (const rarity in ITEMS) {
        if (rarity === 'hidden') {
            HIDDEN_ITEMS.forEach(item => {
                allItems.push({ name: item.name, rarity, sellValue: item.sellValue, artClass: item.artClass });
            });
        } else {
            ITEMS[rarity].forEach(item => {
                allItems.push({ name: item.name, rarity, sellValue: item.sellValue, artClass: item.artClass });
            });
        }
    }

    allItems.forEach(item => {
        const slot = document.createElement('div');
        slot.classList.add('item-dex-slot', `rarity-${item.rarity}`);

        let content = '';
        const isFound = item.rarity !== 'hidden' || foundHiddenItems.includes(item.name);

        if (!isFound) {
            content = `
                <div class="item-dex-art-container">
                    <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0f0f0">
                        <path d="M12 17a2 2 0 01-2-2v-2a2 2 0 012-2c.328 0 .642.064.935.191l.889.378a1 1 0 00.744-1.872L13.68 9.53a4 4 0 10-3.684 6.784L10 17v-2a2 2 0 012-2zM12 4a5 5 0 015 5h-2a3 3 0 00-3-3 3 3 0 00-3 3h-2a5 5 0 015-5z"/>
                    </svg>
                </div>
                <div class="item-dex-name">???</div>
                <div class="item-dex-rarity">Hidden Item</div>
            `;
        } else {
            content = `
                <div class="item-dex-art-container">
                    ${createItemPixelArt({ name: item.name, rarity: item.rarity, type: 'item' })}
                </div>
                <div class="item-dex-name">${item.name}</div>
                <div class="item-dex-rarity">${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}</div>
                <div class="item-dex-value">$${item.sellValue}</div>
            `;
        }

        slot.innerHTML = content;
        itemDexGrid.appendChild(slot);
    });
}

function selectItem(index) {
    selectedItemIndex = index;
    document.querySelectorAll('.item-slot').forEach((el) => {
        el.classList.remove('selected');
        if (parseInt(el.dataset.index) === index) {
            el.classList.add('selected');
        }
    });
    updateActionButtons();
}

function updateActionButtons() {
    const selectedItem = inventory[selectedItemIndex];
    if (!selectedItem) {
        openCrateBtn.classList.add('hidden');
        sellItemBtn.classList.add('hidden');
    } else {
        if (selectedItem.type === 'crate') {
            openCrateBtn.classList.remove('hidden');
            sellItemBtn.classList.add('hidden');
        } else {
            openCrateBtn.classList.add('hidden');
            sellItemBtn.classList.remove('hidden');
        }
    }
}

function openCrate() {
    const crate = inventory[selectedItemIndex];
    if (crate && crate.type === 'crate') {
        showScreen('open-crate-screen');
        tapCount = 0;
        itemDropDisplay.textContent = '';
        finishOpeningBtn.classList.add('hidden');
        tapInstruction.classList.remove('hidden');
        openingCratePixelart.style.transform = 'scale(1)';
    } else {
        showNotification("This is not a crate!");
    }
}

function sellItem() {
    if (selectedItemIndex !== -1) {
        const itemToSell = inventory[selectedItemIndex];
        let sellPrice = 0;
        let itemFound = false;

        for (const rarity in ITEMS) {
            const itemData = ITEMS[rarity].find(i => i.name === itemToSell.name);
            if (itemData) {
                sellPrice = itemData.sellValue;
                itemFound = true;
                break;
            }
        }

        if (sellPrice > 0) {
            inventory.splice(selectedItemIndex, 1);
            money += sellPrice;
            moneyMade += sellPrice;
            updateFinancialStats();
            selectedItemIndex = -1;
            renderInventory();
            saveGame();
            showNotification(`You sold a ${itemToSell.name} for $${sellPrice}!`);
        } else {
            showNotification("This item cannot be sold for a profit!");
        }
    }
}

function generateRandomItem(crateRarity) {
    const possibleRarities = CRATE_CONTENTS[crateRarity];
    let rarity;
    let foundRarity = false;
    let roll = Math.random();

    let chanceSum = 0;
    for (const r of possibleRarities) {
        chanceSum += RARITY_CHANCES[r];
        if (roll <= chanceSum) {
            rarity = r;
            foundRarity = true;
            break;
        }
    }
    
    if (!foundRarity) {
        rarity = possibleRarities[0];
    }
    
    const itemPool = ITEMS[rarity];
    const randomIndex = Math.floor(Math.random() * itemPool.length);
    const itemData = itemPool[randomIndex];
    
    return { type: 'item', name: itemData.name, rarity: rarity };
}

function tapToOpen() {
    tapCount++;
    openingCratePixelart.style.transform = `scale(${1 + tapCount * 0.1})`;
    
    if (tapCount >= 3) {
        tapInstruction.classList.add('hidden');
        
        const crate = inventory[selectedItemIndex];
        const droppedItem = generateRandomItem(crate.rarity);

        inventory.splice(selectedItemIndex, 1); 
        inventory.push(droppedItem);
        
        // Add to found hidden items if applicable
        if (droppedItem.rarity === 'hidden' && !foundHiddenItems.includes(droppedItem.name)) {
            foundHiddenItems.push(droppedItem.name);
        }
        
        itemDropDisplay.innerHTML = `You got a <span class="rarity-${droppedItem.rarity}">${droppedItem.rarity}</span> item: ${droppedItem.name}!`;

        openingCratePixelart.style.transform = `scale(1.3)`;
        selectedItemIndex = -1;
        finishOpeningBtn.classList.remove('hidden');
        saveGame();
    }
}

function updateCooldownDisplay(type, time) {
    const timerElement = type === 'job' ? jobCooldownTimer : treasureCooldownTimer;
    timerElement.textContent = `Cooldown: ${time}s`;

    const interval = setInterval(() => {
        time--;
        timerElement.textContent = `Cooldown: ${time}s`;
        if (time <= 0) {
            clearInterval(interval);
            timerElement.textContent = 'Ready';
            if (type === 'job') {
                doJobBtn.disabled = false;
            } else {
                digTreasureBtn.disabled = false;
            }
        }
    }, 1000);
}

function resetGame() {
    // Reset all game state variables
    money = 500;
    moneySpent = 0;
    moneyMade = 0;
    inventory = [];
    selectedItemIndex = -1;
    selectedTab = 'crates';
    tapCount = 0;
    jobCooldown = 0;
    treasureCooldown = 0;
    codeUsed = false;
    foundHiddenItems = [];
    
    // Clear localStorage
    localStorage.clear();
    
    // Update the UI
    updateFinancialStats();
    renderInventory();
    
    // Go back to the main screen
    showScreen('main-screen');
    showNotification("Game has been reset.");
}

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    startButton.style.backgroundColor = 'white';
    setTimeout(() => {
        showScreen('main-screen');
        saveGame();
    }, 500);
});

checkMoneyBtn.addEventListener('click', () => {
    updateFinancialStats();
    showScreen('money-screen');
});

backFromMoneyBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

inventoryBtn.addEventListener('click', () => {
    showScreen('inventory-screen');
    renderInventory();
});

shopBtn.addEventListener('click', () => {
    showScreen('shop-screen');
});

itemDexBtn.addEventListener('click', () => {
    showScreen('item-dex-screen');
    renderItemDex();
});

workBtn.addEventListener('click', () => {
    showScreen('work-screen');
});

settingsBtn.addEventListener('click', () => {
    showScreen('settings-screen');
});

creditsBtn.addEventListener('click', () => {
    showScreen('credits-screen');
});

backToMainBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

backFromShopBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

backFromItemDexBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

backFromWorkBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

backFromSettingsBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

backFromCreditsBtn.addEventListener('click', () => {
    showScreen('settings-screen');
});

cratesTab.addEventListener('click', () => {
    selectedTab = 'crates';
    cratesTab.classList.add('active');
    itemsTab.classList.remove('active');
    cratesContainer.classList.add('active');
    itemsContainer.classList.remove('active');
    selectedItemIndex = -1;
    updateActionButtons();
});

itemsTab.addEventListener('click', () => {
    selectedTab = 'items';
    itemsTab.classList.add('active');
    cratesTab.classList.remove('active');
    cratesContainer.classList.remove('active');
    itemsContainer.classList.add('active');
    selectedItemIndex = -1;
    updateActionButtons();
});

openCrateBtn.addEventListener('click', openCrate);
sellItemBtn.addEventListener('click', sellItem);

openingCratePixelart.addEventListener('click', tapToOpen);

finishOpeningBtn.addEventListener('click', () => {
    showScreen('inventory-screen');
    renderInventory();
});

buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const crateType = e.target.dataset.crateType;
        const cratePrice = CRATE_PRICES[crateType];
        const amount = parseInt(buyAmountSlider.value);
        const totalCost = cratePrice * amount;

        if (money >= totalCost) {
            money -= totalCost;
            moneySpent += totalCost;
            for (let i = 0; i < amount; i++) {
                inventory.push({ type: 'crate', name: `${crateType} crate`, rarity: crateType });
            }
            updateFinancialStats();
            showNotification(`You bought ${amount} ${crateType} crate(s) for $${totalCost}!`);
            saveGame();
        } else {
            showNotification("Not enough money!");
        }
    });
});

buyAmountSlider.addEventListener('input', (e) => {
    buyAmountValue.textContent = e.target.value;
});

doJobBtn.addEventListener('click', () => {
    const jobGain = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    money += jobGain;
    moneyMade += jobGain;
    updateFinancialStats();
    showNotification(`You earned $${jobGain} from a job!`);
    
    doJobBtn.disabled = true;
    jobCooldown = Date.now() + 5000;
    updateCooldownDisplay('job', 5);
    saveGame();
});

digTreasureBtn.addEventListener('click', () => {
    digTreasureBtn.disabled = true;
    treasureCooldown = Date.now() + 10000;
    updateCooldownDisplay('treasure', 10);
    saveGame();

    if (Math.random() < 0.1) {
        const crateType = ['normal', 'uncommon', 'rare'][Math.floor(Math.random() * 3)];
        inventory.push({ type: 'crate', name: `${crateType} crate`, rarity: crateType });
        showNotification(`You dug up a treasure chest with a ${crateType} crate!`);
    } else {
        showNotification("You dug and found nothing but dirt.");
    }
});

makerCredit.addEventListener('click', () => {
    secretCodeBox.classList.remove('hidden');
});

secretCodeSubmit.addEventListener('click', () => {
    const code = secretCodeInput.value.trim();
    const addMatch = code.match(/^AddD(\d+)$/);
    const removeMatch = code.match(/^removeD(\d+)$/);

    if (code === '67isafunnyjoke' && !codeUsed) {
        money += 1000;
        moneyMade += 1000;
        codeUsed = true;
        showNotification("Code redeemed! You've received $1000.");
        updateFinancialStats();
        saveGame();
    } else if (code === '67isafunnyjoke' && codeUsed) {
        showNotification("This code has already been used!");
    } else if (addMatch) {
        const amount = parseInt(addMatch[1]);
        if (!isNaN(amount)) {
            money += amount;
            moneyMade += amount;
            showNotification(`Added $${amount}.`);
            updateFinancialStats();
            saveGame();
        }
    } else if (removeMatch) {
        const amount = parseInt(removeMatch[1]);
        if (!isNaN(amount)) {
            money = Math.max(0, money - amount);
            moneySpent += amount;
            showNotification(`Removed $${amount}.`);
            updateFinancialStats();
            saveGame();
        }
    } else if (code === 'Itemsme') {
        HIDDEN_ITEMS.forEach(item => {
            if (!foundHiddenItems.includes(item.name)) {
                inventory.push(item);
                foundHiddenItems.push(item.name);
            }
        });
        showNotification("You've received the hidden items!");
        renderInventory();
        saveGame();
    } else {
        showNotification("Invalid code.");
    }

    secretCodeInput.value = '';
    secretCodeBox.classList.add('hidden');
});

saveGameBtn.addEventListener('click', () => {
    saveGame();
    showNotification("Game saved!");
});

resetGameBtn.addEventListener('click', () => {
    **resetPopup.classList.add('visible');**
});

resetNoBtn.addEventListener('click', () => {
    **resetPopup.classList.remove('visible');**
});

resetYesBtn.addEventListener('click', () => {
    resetGame();
    **resetPopup.classList.remove('visible');**
});

// --- Initial Setup ---
window.onload = loadGame;
