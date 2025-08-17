// --- Game State Variables ---
let money = 500;
let inventory = [];
let selectedCrateIndex = -1;
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
const openCrateBtn = document.getElementById('open-crate-btn');
const sellCrateBtn = document.getElementById('sell-crate-btn');
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

// --- Item Data ---
const HIDDEN_ITEMS = [
    { name: 'Stick', sellValue: 80000 },
    { name: 'Baba\'s Belt', sellValue: 100000 },
    { name: 'Shoe', sellValue: 50000 },
    { name: 'Button', sellValue: 50000 }
];

const ITEMS = {
    common: Array.from({ length: 30 }, (_, i) => `Dusty Relic ${i + 1}`),
    uncommon: Array.from({ length: 20 }, (_, i) => `Gleaming Fragment ${i + 1}`),
    rare: Array.from({ length: 15 }, (_, i) => `Enchanted Gemstone ${i + 1}`),
    epic: Array.from({ length: 10 }, (_, i) => `Astral Shard ${i + 1}`),
    mythical: Array.from({ length: 5 }, (_, i) => `Cosmic Core ${i + 1}`),
    legendary: Array.from({ length: 5 }, (_, i) => `Eternal Flame ${i + 1}`),
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

function renderInventory() {
    cratesContainer.innerHTML = '';
    const totalSlots = Math.max(inventory.length, 20); // Show at least 20 empty slots
    
    // Render crates
    inventory.forEach((itemName, index) => {
        const crate = document.createElement('div');
        crate.classList.add('crate-item');
        crate.innerHTML = `<span class="crate-text">${itemName}</span>`;
        crate.dataset.index = index;
        crate.addEventListener('click', () => selectCrate(index));
        cratesContainer.appendChild(crate);
    });

    // Render empty slots
    for (let i = inventory.length; i < totalSlots; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('empty-slot');
        cratesContainer.appendChild(emptySlot);
    }

    // Hide buttons if no crate is selected
    if (selectedCrateIndex === -1) {
        openCrateBtn.classList.add('hidden');
        sellCrateBtn.classList.add('hidden');
    }
}

function selectCrate(index) {
    selectedCrateIndex = index;
    // Highlight the selected crate
    document.querySelectorAll('.crate-item').forEach((crate) => {
        if (parseInt(crate.dataset.index) === index) {
            crate.style.border = '2px solid #007BFF';
        } else {
            crate.style.border = '2px solid #333';
        }
    });
    // Show buttons
    openCrateBtn.classList.remove('hidden');
    sellCrateBtn.classList.remove('hidden');
}

function openCrate() {
    if (selectedCrateIndex !== -1) {
        const item = inventory[selectedCrateIndex];
        if (item.includes('Crate')) {
            showScreen('open-crate-screen');
            tapCount = 0;
            itemDropDisplay.textContent = '';
            finishOpeningBtn.classList.add('hidden');
            tapInstruction.classList.remove('hidden');
            openingCratePixelart.style.transform = 'scale(1)';
        } else {
            alert("This is an item, not a crate!");
        }
    }
}

function sellItem() {
    if (selectedCrateIndex !== -1) {
        const itemToSell = inventory[selectedCrateIndex];
        let sellPrice = CRATE_SELL_PRICE;

        // Check for special hidden item sell values
        const hiddenItem = HIDDEN_ITEMS.find(item => item.name === itemToSell);
        if (hiddenItem) {
            sellPrice = hiddenItem.sellValue;
        }

        inventory.splice(selectedCrateIndex, 1);
        money += sellPrice;
        updateMoneyDisplay();
        selectedCrateIndex = -1;
        renderInventory();
        saveGame();
    }
}

function generateRandomItem(crateType) {
    if (crateType === 'mythicalcrate' && Math.random() < 0.2) { // 20% chance to drop a Rare Crate
        return { name: 'Rare Crate', type: 'crate' };
    }

    const possibleRarities = CRATE_CONTENTS[crateType];
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
    
    // Fallback in case of a rounding issue or if no item was selected
    if (!foundRarity) {
        rarity = possibleRarities[0];
    }
    
    const itemPool = ITEMS[rarity];
    const randomIndex = Math.floor(Math.random() * itemPool.length);
    const itemName = itemPool[randomIndex];
    
    return { name: itemName, rarity: rarity, type: 'item' };
}

function tapToOpen() {
    tapCount++;
    openingCratePixelart.style.transform = `scale(${1 + tapCount * 0.1})`;
    
    if (tapCount >= 3) {
        tapInstruction.classList.add('hidden');
        
        const crateType = inventory[selectedCrateIndex];
        const droppedItem = generateRandomItem(crateType);

        inventory.splice(selectedCrateIndex, 1); // Remove the opened crate
        inventory.push(droppedItem.name); // Add the new item
        
        itemDropDisplay.textContent = `You got a ${droppedItem.rarity || ''} item: ${droppedItem.name}!`;

        selectedCrateIndex = -1;
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
    // Start animation
    startButton.style.backgroundColor = 'white';
    setTimeout(() => {
        startScreen.classList.remove('active');
        mainScreen.classList.add('active');
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

openCrateBtn.addEventListener('click', openCrate);
sellCrateBtn.addEventListener('click', sellItem); // Changed to sellItem

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
            for (let i = 0; i < (crateType === 'normal' ? amountToBuy : 1); i++) {
                inventory.push(`${crateType}crate`);
            }
            updateMoneyDisplay();
            saveGame();
            alert(`You bought ${crateType === 'normal' ? amountToBuy : 1} ${crateType} crate(s)!`);
        } else {
            alert("Not enough money!");
        }
    });
});

doJobBtn.addEventListener('click', () => {
    const jobGain = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    money += jobGain;
    updateMoneyDisplay();
    alert(`You earned $${jobGain} from a job!`);
    
    doJobBtn.disabled = true;
    jobCooldown = Date.now() + 5000;
    updateCooldownDisplay('job', 5);
    saveGame();
});

digTreasureBtn.addEventListener('click', () => {
    digTreasureBtn.disabled = true;
    treasureCooldown = Date.now() + 5000; // 5-second cooldown
    updateCooldownDisplay('treasure', 5);
    saveGame();

    if (Math.random() < 0.1) { // 10% chance
        if (Math.random() < 0.5) { // 50/50 for item vs money
            const rareItem = generateRandomItem('rare');
            inventory.push(rareItem.name);
            alert(`You dug up a Rare Item: ${rareItem.name}!`);
        } else {
            const moneyGain = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;
            money += moneyGain;
            updateMoneyDisplay();
            alert(`You dug up a treasure chest with $${moneyGain}!`);
        }
    } else {
        alert("You dug and found nothing but dirt.");
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
        alert("Code redeemed! You've received $1000.");
        updateMoneyDisplay();
        saveGame();
    } else if (code === '67isafunnyjoke' && codeUsed) {
        alert("This code has already been used!");
    } else if (addMatch) {
        const amount = parseInt(addMatch[1]);
        if (!isNaN(amount)) {
            money += amount;
            alert(`Added $${amount}.`);
            updateMoneyDisplay();
            saveGame();
        }
    } else if (removeMatch) {
        const amount = parseInt(removeMatch[1]);
        if (!isNaN(amount)) {
            money = Math.max(0, money - amount);
            alert(`Removed $${amount}.`);
            updateMoneyDisplay();
            saveGame();
        }
    } else if (code === 'Itemsme') {
        HIDDEN_ITEMS.forEach(item => inventory.push(item.name));
        alert("You've received the hidden items!");
        renderInventory();
        saveGame();
    } else {
        alert("Invalid code.");
    }

    secretCodeInput.value = '';
    secretCodeBox.classList.add('hidden');
});

// --- Initial Setup ---
window.onload = loadGame;
