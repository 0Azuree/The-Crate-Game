// --- Game State Variables ---
let money = 500;
let inventory = [];
let selectedItemIndex = -1;
let selectedTab = 'crates';
let tapCount = 0;
let jobCooldown = 0;
let treasureCooldown = 0;
const CRATE_SELL_PRICE = 50;
let codeUsed = false;

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const mainScreen = document.getElementById('main-screen');
const moneyScreen = document.getElementById('money-screen');
const workScreen = document.getElementById('work-screen');
const inventoryScreen = document.getElementById('inventory-screen');
const openCrateScreen = document.getElementById('open-crate-screen');
const shopScreen = document.getElementById('shop-screen');
const settingsScreen = document.getElementById('settings-screen');
const creditsScreen = document.getElementById('credits-screen');

const startButton = document.getElementById('start-button');
const moneyDisplay = document.getElementById('money-display');
const checkMoneyBtn = document.getElementById('check-money-btn');
const inventoryBtn = document.getElementById('inventory-btn');
const shopBtn = document.getElementById('shop-btn');
const workBtn = document.getElementById('work-btn');
const settingsBtn = document.getElementById('settings-btn');
const creditsBtn = document.getElementById('credits-btn');
const makerCredit = document.getElementById('maker-credit');
const secretCodeBox = document.getElementById('secret-code-box');
const secretCodeInput = document.getElementById('secret-code-input');
const secretCodeSubmit = document.getElementById('secret-code-submit');

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

// --- Item Data ---
const HIDDEN_ITEMS = [
    { name: 'Stick', sellValue: 80000, rarity: 'hidden', artClass: 'hidden stick' },
    { name: 'Baba\'s Belt', sellValue: 100000, rarity: 'hidden', artClass: 'hidden baba' },
    { name: 'Shoe', sellValue: 50000, rarity: 'hidden', artClass: 'hidden shoe' },
    { name: 'Button', sellValue: 50000, rarity: 'hidden', artClass: 'hidden button' }
];

const ITEMS = {
    common: Array.from({ length: 40 }, (_, i) => `Dusty Relic ${i + 1}`),
    uncommon: Array.from({ length: 30 }, (_, i) => `Gleaming Fragment ${i + 1}`),
    rare: Array.from({ length: 20 }, (_, i) => `Enchanted Gemstone ${i + 1}`),
    epic: Array.from({ length: 15 }, (_, i) => `Astral Shard ${i + 1}`),
    mythical: Array.from({ length: 6 }, (_, i) => `Cosmic Core ${i + 1}`),
    legendary: Array.from({ length: 4 }, (_, i) => `Eternal Flame ${i + 1}`),
    hidden: HIDDEN_ITEMS.map(item => item.name),
};

const RARITY_CHANCES = {
    common: 0.35,
    uncommon: 0.25,
    rare: 0.18,
    epic: 0.12,
    mythical: 0.06,
    legendary: 0.03,
    hidden: 0.01,
};

const CRATE_PRICES = {
    normal: 500,
    uncommon: 800,
    rare: 1100,
};

const CRATE_CONTENTS = {
    normal: ['common', 'uncommon'],
    uncommon: ['uncommon', 'rare', 'epic'],
    rare: ['rare', 'epic', 'mythical', 'legendary', 'hidden'],
};

// --- Game Logic Functions ---
function updateMoneyDisplay() {
    moneyDisplay.textContent = `$${money}`;
}

function showScreen(screenId) {
    const screens = [startScreen, mainScreen, moneyScreen, workScreen, inventoryScreen, openCrateScreen, shopScreen, settingsScreen, creditsScreen];
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
    notificationPopup.classList.remove('hidden'); // Ensure it's not display: none
    setTimeout(() => {
        notificationPopup.classList.add('visible');
    }, 10); // A small delay to trigger the transition
    
    setTimeout(() => {
        notificationPopup.classList.remove('visible');
    }, 3000); // Notification lasts 3 seconds
}

function saveGame() {
    localStorage.setItem('gameMoney', money);
    localStorage.setItem('gameInventory', JSON.stringify(inventory));
    localStorage.setItem('jobCooldown', jobCooldown);
    localStorage.setItem('treasureCooldown', treasureCooldown);
    localStorage.setItem('codeUsed', codeUsed);
}

function loadGame() {
    const savedMoney = localStorage.getItem('gameMoney');
    const savedInventory = localStorage.getItem('gameInventory');
    const savedJobCooldown = localStorage.getItem('jobCooldown');
    const savedTreasureCooldown = localStorage.getItem('treasureCooldown');
    const savedCodeUsed = localStorage.getItem('codeUsed');
    
    if (savedMoney) {
        money = parseInt(savedMoney);
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
    
    updateMoneyDisplay();
    renderInventory();
    
    // Check and update cooldowns on load
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
    // Handle specific hidden item art
    const hiddenItem = HIDDEN_ITEMS.find(h => h.name === item.name);
    if (hiddenItem) {
        return `<div class="pixel-art ${hiddenItem.artClass}"></div>`;
    }
    // Generic pixel art for other rarities
    return `<div class="pixel-art ${item.rarity}"></div>`;
}

function renderInventory() {
    cratesContainer.innerHTML = '';
    itemsContainer.innerHTML = '';
    
    const crates = inventory.filter(item => item.type === 'crate');
    const items = inventory.filter(item => item.type === 'item');

    // Render crates
    const totalCrateSlots = Math.max(crates.length, 20); // Show at least 20 empty slots
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

    // Render items
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
        let sellPrice = CRATE_SELL_PRICE;

        const hiddenItem = HIDDEN_ITEMS.find(item => item.name === itemToSell.name);
        if (hiddenItem) {
            sellPrice = hiddenItem.sellValue;
        }

        inventory.splice(selectedItemIndex, 1);
        money += sellPrice;
        updateMoneyDisplay();
        selectedItemIndex = -1;
        renderInventory();
        saveGame();
        showNotification(`You sold a ${itemToSell.name} for $${sellPrice}!`);
    }
}

function generateRandomItem(crateRarity) {
    if (crateRarity === 'rare' && Math.random() < 0.2) { 
        return { type: 'crate', name: 'Uncommon Crate', rarity: 'uncommon' };
    }

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
    const itemName = itemPool[randomIndex];
    
    return { type: 'item', name: itemName, rarity: rarity };
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

// --- Event Listeners ---
startButton.addEventListener('click', () => {
    startButton.style.backgroundColor = 'white';
    setTimeout(() => {
        showScreen('main-screen');
        saveGame();
    }, 500);
});

checkMoneyBtn.addEventListener('click', () => {
    updateMoneyDisplay();
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

buyAmountSlider.addEventListener('input', () => {
    buyAmountValue.textContent = buyAmountSlider.value;
});

buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const crateType = e.target.dataset.crateType;
        const amountToBuy = parseInt(buyAmountSlider.value);
        let price = CRATE_PRICES[crateType];

        if (crateType === 'normal') {
            price *= amountToBuy;
        }

        if (money >= price) {
            money -= price;
            for (let i = 0; i < amountToBuy; i++) {
                inventory.push({ type: 'crate', name: `${crateType} crate`, rarity: crateType });
            }
            updateMoneyDisplay();
            saveGame();
            showNotification(`You bought ${amountToBuy} ${crateType} crate(s)!`);
        } else {
            showNotification("Not enough money!");
        }
    });
});

doJobBtn.addEventListener('click', () => {
    const jobGain = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    money += jobGain;
    updateMoneyDisplay();
    showNotification(`You earned $${jobGain} from a job!`);
    
    doJobBtn.disabled = true;
    jobCooldown = Date.now() + 5000;
    updateCooldownDisplay('job', 5);
    saveGame();
});

digTreasureBtn.addEventListener('click', () => {
    digTreasureBtn.disabled = true;
    treasureCooldown = Date.now() + 5000;
    updateCooldownDisplay('treasure', 5);
    saveGame();

    if (Math.random() < 0.1) {
        if (Math.random() < 0.5) {
            const rareItem = generateRandomItem('rare');
            inventory.push(rareItem);
            showNotification(`You dug up a Rare Item: ${rareItem.name}!`);
        } else {
            const moneyGain = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
            money += moneyGain;
            updateMoneyDisplay();
            showNotification(`You dug up a treasure chest with $${moneyGain}!`);
        }
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
        codeUsed = true;
        showNotification("Code redeemed! You've received $1000.");
        updateMoneyDisplay();
        saveGame();
    } else if (code === '67isafunnyjoke' && codeUsed) {
        showNotification("This code has already been used!");
    } else if (addMatch) {
        const amount = parseInt(addMatch[1]);
        if (!isNaN(amount)) {
            money += amount;
            showNotification(`Added $${amount}.`);
            updateMoneyDisplay();
            saveGame();
        }
    } else if (removeMatch) {
        const amount = parseInt(removeMatch[1]);
        if (!isNaN(amount)) {
            money = Math.max(0, money - amount);
            showNotification(`Removed $${amount}.`);
            updateMoneyDisplay();
            saveGame();
        }
    } else if (code === 'Itemsme') {
        HIDDEN_ITEMS.forEach(item => inventory.push(item));
        showNotification("You've received the hidden items!");
        renderInventory();
        saveGame();
    } else {
        showNotification("Invalid code.");
    }

    secretCodeInput.value = '';
    secretCodeBox.classList.add('hidden');
});

// --- Initial Setup ---
window.onload = loadGame;
