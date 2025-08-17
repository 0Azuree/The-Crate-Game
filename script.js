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
const codePopup = document.getElementById('code-popup');
const codeInput = document.getElementById('code-input');
const codeSubmitBtn = document.getElementById('code-submit-btn');
const codeCancelBtn = document.getElementById('code-cancel-btn');
const makerCredit = document.getElementById('maker-credit');

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
const itemDropPixelart = document.getElementById('item-drop-pixelart');
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
    { name: 'Stick', sellValue: 80000, rarity: 'hidden', artClass: 'stick' },
    { name: 'Baba\'s Belt', sellValue: 100000, rarity: 'hidden', artClass: 'baba-belt' },
    { name: 'Shoe', sellValue: 50000, rarity: 'hidden', artClass: 'shoe' },
    { name: 'Button', sellValue: 50000, rarity: 'hidden', artClass: 'button' }
];

const ITEMS = {
    common: [
        { name: 'Googly-Eyed Rock', sellValue: 15, artClass: 'googly-rock' },
        { name: 'Used Gum Wrapper', sellValue: 5, artClass: 'gum-wrapper' },
        { name: 'Lint Collection', sellValue: 10, artClass: 'lint-collection' },
        { name: 'Slightly Bent Spoon', sellValue: 20, artClass: 'bent-spoon' },
        { name: 'Expired Coupon', sellValue: 2, artClass: 'expired-coupon' },
        { name: 'Single Sock', sellValue: 8, artClass: 'single-sock' },
        { name: 'Broken Pencil', sellValue: 4, artClass: 'broken-pencil' },
        { name: 'Stale Cracker', sellValue: 1, artClass: 'stale-cracker' },
        { name: 'Pet Rock\'s Leash', sellValue: 12, artClass: 'pet-rock-leash' },
        { name: 'Empty Water Bottle', sellValue: 3, artClass: 'empty-bottle' },
        { name: 'Crumpled Receipt', sellValue: 6, artClass: 'crumpled-receipt' },
        { name: 'Plastic Bottle Cap', sellValue: 7, artClass: 'bottle-cap' },
        { name: 'Loose Screw', sellValue: 11, artClass: 'loose-screw' },
        { name: 'Used Tea Bag', sellValue: 9, artClass: 'used-tea-bag' },
        { name: 'Dust Bunny', sellValue: 14, artClass: 'dust-bunny' },
        { name: 'Mystery Key', sellValue: 25, artClass: 'mystery-key' },
        { name: 'Worn-out Eraser', sellValue: 18, artClass: 'worn-eraser' },
        { name: 'Chewed-up Pen', sellValue: 16, artClass: 'chewed-pen' },
        { name: 'Tangled Earbuds', sellValue: 22, artClass: 'tangled-earbuds' },
        { name: 'Small Pebblestone', sellValue: 5, artClass: 'small-pebblestone' },
        { name: 'Ripped Paper', sellValue: 1, artClass: 'ripped-paper' },
        { name: 'Half-used Matchbook', sellValue: 13, artClass: 'matchbook' },
        { name: 'Dead Fly', sellValue: 0.5, artClass: 'dead-fly' },
        { name: 'Dry Leaf', sellValue: 1, artClass: 'dry-leaf' },
        { name: 'Rusty Nail', sellValue: 2, artClass: 'rusty-nail' },
        { name: 'Old Shoelace', sellValue: 10, artClass: 'old-shoelace' },
        { name: 'Fuzzy Dice', sellValue: 17, artClass: 'fuzzy-dice' },
        { name: 'Bent Paperclip', sellValue: 3, artClass: 'bent-paperclip' },
        { name: 'Cardboard Box', sellValue: 20, artClass: 'cardboard-box' },
        { name: 'Unidentified Scraps', sellValue: 1, artClass: 'unidentified-scraps' }
    ],
    uncommon: [
        { name: 'Vintage Cassette Player', sellValue: 500, artClass: 'cassette-player' },
        { name: 'Fidget Spinner', sellValue: 350, artClass: 'fidget-spinner' },
        { name: 'Signed Napkin', sellValue: 600, artClass: 'signed-napkin' },
        { name: 'Rubber Chicken', sellValue: 450, artClass: 'rubber-chicken' },
        { name: 'Half-Eaten Sandwich', sellValue: 100, artClass: 'half-sandwich' },
        { name: 'A Bag of Marbles', sellValue: 250, artClass: 'bag-of-marbles' },
        { name: 'Glow-in-the-Dark Star', sellValue: 150, artClass: 'glow-star' },
        { name: 'Retro Pager', sellValue: 700, artClass: 'retro-pager' },
        { name: 'Floppy Hat', sellValue: 300, artClass: 'floppy-hat' },
        { name: 'Well-loved Teddy Bear', sellValue: 400, artClass: 'teddy-bear' },
        { name: 'Troll Doll with Blue Hair', sellValue: 550, artClass: 'troll-doll' },
        { name: 'Polished Stone', sellValue: 800, artClass: 'polished-stone' },
        { name: 'Unopened Action Figure', sellValue: 900, artClass: 'action-figure' },
        { name: 'Magic 8-Ball', sellValue: 750, artClass: 'magic-8-ball' },
        { name: 'Handheld Game Console', sellValue: 1000, artClass: 'game-console' },
        { name: 'Jingle Bell', sellValue: 120, artClass: 'jingle-bell' },
        { name: 'Tiny Umbrella', sellValue: 200, artClass: 'tiny-umbrella' },
        { name: 'A single, clean feather', sellValue: 180, artClass: 'clean-feather' },
        { name: 'A key to an unknown door', sellValue: 650, artClass: 'unknown-key' },
        { name: 'A small, shiny orb', sellValue: 1050, artClass: 'shiny-orb' },
        { name: 'A working yo-yo', sellValue: 320, artClass: 'yo-yo' },
        { name: 'A set of old-school playing cards', sellValue: 500, artClass: 'playing-cards' },
        { name: 'An antique coin', sellValue: 1100, artClass: 'antique-coin' },
        { name: 'A miniature globe', sellValue: 950, artClass: 'mini-globe' },
        { name: 'A compass that points nowhere', sellValue: 780, artClass: 'broken-compass' },
        { name: 'A sealed letter with no address', sellValue: 850, artClass: 'sealed-letter' },
        { name: 'A small, ornate box', sellValue: 1300, artClass: 'ornate-box' },
        { name: 'A tiny, wooden carving', sellValue: 470, artClass: 'wooden-carving' },
        { name: 'A broken wristwatch', sellValue: 210, artClass: 'broken-wristwatch' },
        { name: 'A stack of old photographs', sellValue: 530, artClass: 'old-photos' },
        { name: 'A jar of colorful buttons', sellValue: 280, artClass: 'button-jar' },
        { name: 'A well-preserved beetle', sellValue: 620, artClass: 'preserved-beetle' },
        { name: 'A music box', sellValue: 1400, artClass: 'music-box' },
        { name: 'A map to a fake treasure', sellValue: 710, artClass: 'fake-map' },
        { name: 'A vintage comic book', sellValue: 890, artClass: 'vintage-comic' },
        { name: 'A toy soldier', sellValue: 190, artClass: 'toy-soldier' },
        { name: 'A small snow globe', sellValue: 680, artClass: 'snow-globe' },
        { name: 'A rusty whistle', sellValue: 150, artClass: 'rusty-whistle' },
        { name: 'A miniature telescope', sellValue: 1200, artClass: 'mini-telescope' },
        { name: 'A perfectly round rock', sellValue: 230, artClass: 'perfectly-round-rock' }
    ],
    rare: [
        { name: 'Crystal Skull', sellValue: 1500, artClass: 'crystal-skull' },
        { name: 'Ancient Floppy Disk', sellValue: 1800, artClass: 'floppy-disk' },
        { name: 'Jar of Fireflies', sellValue: 2000, artClass: 'jar-of-fireflies' },
        { name: 'First Edition Comic Book', sellValue: 3000, artClass: 'first-edition-comic' },
        { name: 'Lucky Rabbit\'s Foot', sellValue: 2500, artClass: 'rabbit-foot' },
        { name: 'Hand-carved Wooden Mask', sellValue: 3500, artClass: 'wooden-mask' },
        { name: 'A Golden Ring', sellValue: 4000, artClass: 'golden-ring' },
        { name: 'The Sword of a Former King (replica)', sellValue: 2800, artClass: 'replica-sword' },
        { name: 'A bottle of unidentifiable liquid', sellValue: 2200, artClass: 'mystery-liquid' },
        { name: 'A set of glowing dice', sellValue: 4500, artClass: 'glowing-dice' },
        { name: 'A perfectly preserved fossil', sellValue: 5000, artClass: 'preserved-fossil' },
        { name: 'A cursed necklace', sellValue: 1000, artClass: 'cursed-necklace' },
        { name: 'A magical key', sellValue: 3200, artClass: 'magical-key' },
        { name: 'A wizard\'s hat', sellValue: 3800, artClass: 'wizards-hat' },
        { name: 'A crystal ball', sellValue: 5500, artClass: 'crystal-ball' },
        { name: 'A dragon\'s scale', sellValue: 6000, artClass: 'dragon-scale' },
        { name: 'A grimoire of recipes', sellValue: 4200, artClass: 'grimoire' },
        { name: 'A time-traveling sundial', sellValue: 7000, artClass: 'sundial' },
        { name: 'A potion of healing', sellValue: 2700, artClass: 'healing-potion' },
        { name: 'A jar of starlight', sellValue: 6500, artClass: 'jar-of-starlight' }
    ],
    mythical: [
        { name: 'Golden Compass', sellValue: 20000, artClass: 'golden-compass' },
        { name: 'Bottle of Captured Sunlight', sellValue: 25000, artClass: 'bottle-of-sunlight' },
        { name: 'Ever-Burning Candle', sellValue: 30000, artClass: 'ever-burning-candle' },
        { name: 'Orb of Eternal Snowfall', sellValue: 35000, artClass: 'snow-orb' },
        { name: 'The Last Unicorn Horn', sellValue: 40000, artClass: 'unicorn-horn' },
        { name: 'Glove of Telekinesis', sellValue: 45000, artClass: 'glove-of-telekinesis' },
        { name: 'Heart of a Golem', sellValue: 50000, artClass: 'golem-heart' },
        { name: 'Feather from an Archangel', sellValue: 60000, artClass: 'archangel-feather' },
        { name: 'Map to the Lost City of Atlantis', sellValue: 75000, artClass: 'atlantis-map' },
        { name: 'The philosopher\'s stone', sellValue: 90000, artClass: 'philosopher-stone' },
        { name: 'A vial of vampire blood', sellValue: 80000, artClass: 'vampire-blood' },
        { name: 'A phoenix feather', sellValue: 90000, artClass: 'phoenix-feather' },
        { name: 'A werewolf\'s fang', sellValue: 95000, artClass: 'werewolf-fang' },
        { name: 'A griffin\'s claw', sellValue: 85000, artClass: 'griffin-claw' },
        { name: 'A dragon\'s tear', sellValue: 70000, artClass: 'dragon-tear' }
    ],
    legendary: [
        { name: 'Amulet of Time', sellValue: 50000, artClass: 'amulet-of-time' },
        { name: 'Phoenix Feather', sellValue: 75000, artClass: 'phoenix-feather' },
        { name: 'Crown of the Sun King', sellValue: 95000, artClass: 'sun-king-crown' },
        { name: 'The Holy Grail', sellValue: 98000, artClass: 'holy-grail' },
        { name: 'The Excalibur Sword', sellValue: 99000, artClass: 'excalibur-sword' },
        { name: 'The Ark of the Covenant', sellValue: 99500, artClass: 'ark-of-covenant' },
        { name: 'The Ring of Power', sellValue: 99999, artClass: 'ring-of-power' },
        { name: 'A vial of essence', sellValue: 99900, artClass: 'essence-vial' },
        { name: 'The Golden Fleece', sellValue: 99950, artClass: 'golden-fleece' },
        { name: 'The Trident of Poseidon', sellValue: 99980, artClass: 'poseidon-trident' }
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

// --- Secret Codes ---
const CODES = {
    "67isafunnyjoke": {
        rewardType: "items",
        itemType: "common",
        amount: 1000,
        message: "You received 1000 Googly-Eyed Rocks!",
        used: false
    },
    "itemsme": {
        rewardType: "hidden",
        message: "You received all hidden items!",
        used: false
    }
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
    notificationPopup.classList.add('visible');
    
    setTimeout(() => {
        notificationPopup.classList.remove('visible');
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
    localStorage.setItem('codesUsed', JSON.stringify(Object.keys(CODES).filter(key => CODES[key].used)));
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
    const savedCodesUsed = localStorage.getItem('codesUsed');
    
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
    if (savedCodesUsed) {
        const usedCodes = JSON.parse(savedCodesUsed);
        usedCodes.forEach(code => {
            if (CODES[code]) {
                CODES[code].used = true;
            }
        });
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
    if (!itemData) {
        return ''; // Return nothing if item data is not found
    }
    const artClass = itemData.artClass;
    
    return `<div class="pixel-art ${artClass}"></div>`;
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
        ITEMS[rarity].forEach(item => {
            allItems.push({ name: item.name, rarity, sellValue: item.sellValue, artClass: item.artClass });
        });
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
        itemDropDisplay.classList.add('hidden');
        itemDropPixelart.classList.add('hidden');
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
        openingCratePixelart.classList.add('explode');

        // After the explosion animation, reveal the item
        openingCratePixelart.addEventListener('animationend', () => {
            const crate = inventory[selectedItemIndex];
            const droppedItem = generateRandomItem(crate.rarity);
    
            inventory.splice(selectedItemIndex, 1); 
            inventory.push(droppedItem);
            
            if (droppedItem.rarity === 'hidden' && !foundHiddenItems.includes(droppedItem.name)) {
                foundHiddenItems.push(droppedItem.name);
            }
            
            const itemElement = document.createElement('div');
            itemElement.classList.add('pixel-art');
            itemElement.innerHTML = createItemPixelArt(droppedItem);
            itemDropPixelart.innerHTML = '';
            itemDropPixelart.appendChild(itemElement);
            itemDropPixelart.classList.remove('hidden');

            itemDropDisplay.innerHTML = `You got a <span class="rarity-${droppedItem.rarity}">${droppedItem.rarity}</span> item: ${droppedItem.name}!`;
            itemDropDisplay.classList.remove('hidden');
            
            openingCratePixelart.classList.remove('explode');
            openingCratePixelart.classList.add('hidden');
            
            selectedItemIndex = -1;
            finishOpeningBtn.classList.remove('hidden');
            saveGame();
        }, { once: true });
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
    
    // Reset codesUsed state
    Object.keys(CODES).forEach(key => CODES[key].used = false);
    
    // Update the UI
    updateFinancialStats();
    renderInventory();
    
    // Go back to the main screen
    showScreen('main-screen');
    showNotification("Game has been reset.");
}

function checkCode() {
    const fullCommand = codeInput.value.trim();
    const [command, ...args] = fullCommand.split(' ');
    const argString = args.join(' ');
    
    if (command === 'addD' && argString) {
        handleDevCommand('addD', argString);
        return;
    }
    if (command === 'removeD' && argString) {
        handleDevCommand('removeD', argString);
        return;
    }

    if (CODES[fullCommand]) {
        if (CODES[fullCommand].used) {
            showNotification("Code already used!");
        } else {
            const reward = CODES[fullCommand];
            if (reward.rewardType === "items") {
                const itemData = ITEMS[reward.itemType].find(i => i.name === 'Googly-Eyed Rock');
                for (let i = 0; i < reward.amount; i++) {
                     inventory.push({ type: 'item', name: itemData.name, rarity: reward.itemType });
                }
            } else if (reward.rewardType === "hidden") {
                HIDDEN_ITEMS.forEach(item => {
                    inventory.push({ type: 'item', name: item.name, rarity: item.rarity });
                    if (!foundHiddenItems.includes(item.name)) {
                        foundHiddenItems.push(item.name);
                    }
                });
            }
            CODES[fullCommand].used = true;
            updateFinancialStats();
            showNotification(reward.message);
            saveGame();
            closeCodePopup();
        }
    } else {
        showNotification("Invalid code!");
    }
}

function handleDevCommand(command, itemName) {
    const itemData = Object.values(ITEMS).flat().find(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (!itemData) {
        showNotification("Item not found!");
        return;
    }

    if (command === 'addD') {
        inventory.push({ type: 'item', name: itemData.name, rarity: itemData.rarity });
        if (itemData.rarity === 'hidden' && !foundHiddenItems.includes(itemData.name)) {
            foundHiddenItems.push(itemData.name);
        }
        showNotification(`Added ${itemData.name} to inventory!`);
    } else if (command === 'removeD') {
        const indexToRemove = inventory.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (indexToRemove !== -1) {
            inventory.splice(indexToRemove, 1);
            showNotification(`Removed ${itemData.name} from inventory!`);
        } else {
            showNotification("Item not found in inventory!");
        }
    }

    renderInventory();
    saveGame();
    closeCodePopup();
}

function openCodePopup() {
    codePopup.classList.add('visible');
    codeInput.value = '';
}

function closeCodePopup() {
    codePopup.classList.remove('visible');
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
        const crateType = e.target.dataset.crate-type;
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
    saveGame();

    if (Math.random() < 0.1) {
        const crateType = ['normal', 'uncommon', 'rare'][Math.floor(Math.random() * 3)];
        inventory.push({ type: 'crate', name: `${crateType} crate`, rarity: crateType });
        showNotification(`You dug up a treasure chest with a ${crateType} crate!`);
    } else {
        showNotification("You dug and found nothing but dirt.");
    }
});

saveGameBtn.addEventListener('click', () => {
    saveGame();
    showNotification("Game saved!");
});

resetGameBtn.addEventListener('click', () => {
    resetPopup.classList.add('visible');
});

resetNoBtn.addEventListener('click', () => {
    resetPopup.classList.remove('visible');
});

resetYesBtn.addEventListener('click', () => {
    resetGame();
    resetPopup.classList.remove('visible');
});

makerCredit.addEventListener('click', () => {
    openCodePopup();
});

codeSubmitBtn.addEventListener('click', checkCode);

codeCancelBtn.addEventListener('click', closeCodePopup);

// Listen for Enter key on code input
codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkCode();
    }
});

// --- Initial Setup ---
window.onload = loadGame;
