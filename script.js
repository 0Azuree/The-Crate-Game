// --- Game State Variables ---
let money = 500;
let inventory = [];
let selectedCrateIndex = -1;
let tapCount = 0;
let tapInterval;
const CRATE_SELL_PRICE = 50;

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const mainScreen = document.getElementById('main-screen');
const inventoryScreen = document.getElementById('inventory-screen');
const openCrateScreen = document.getElementById('open-crate-screen');
const shopScreen = document.getElementById('shop-screen');

const startButton = document.getElementById('start-button');
const moneyDisplay = document.getElementById('money-display');
const checkMoneyBtn = document.getElementById('check-money-btn');
const inventoryBtn = document.getElementById('inventory-btn');
const shopBtn = document.getElementById('shop-btn');
const cratesContainer = document.getElementById('crates-container');
const openCrateBtn = document.getElementById('open-crate-btn');
const sellCrateBtn = document.getElementById('sell-crate-btn');
const backToMainBtn = document.getElementById('back-to-main-btn');
const backFromShopBtn = document.getElementById('back-from-shop-btn');
const buyButtons = document.querySelectorAll('.buy-button');
const tapInstruction = document.getElementById('tap-instruction');
const openingCrateImg = document.getElementById('opening-crate-img');
const itemDropDisplay = document.getElementById('item-drop-display');
const finishOpeningBtn = document.getElementById('finish-opening-btn');

// --- Item Data ---
const ITEMS = {
    common: Array.from({ length: 30 }, (_, i) => `Common Item ${i + 1}`),
    uncommon: Array.from({ length: 20 }, (_, i) => `Uncommon Item ${i + 1}`),
    rare: Array.from({ length: 15 }, (_, i) => `Rare Item ${i + 1}`),
    epic: Array.from({ length: 10 }, (_, i) => `Epic Item ${i + 1}`),
    mythical: Array.from({ length: 5 }, (_, i) => `Mythical Item ${i + 1}`),
    legendary: Array.from({ length: 5 }, (_, i) => `Legendary Item ${i + 1}`),
    hidden: Array.from({ length: 4 }, (_, i) => `Hidden Item ${i + 1}`),
};

const RARITY_CHANCES = {
    common: 0.40,
    uncommon: 0.25,
    rare: 0.15,
    epic: 0.10,
    mythical: 0.05,
    legendary: 0.04,
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
    const screens = [startScreen, mainScreen, inventoryScreen, openCrateScreen, shopScreen];
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
}

function loadGame() {
    const savedMoney = localStorage.getItem('gameMoney');
    const savedInventory = localStorage.getItem('gameInventory');
    if (savedMoney) {
        money = parseInt(savedMoney);
    }
    if (savedInventory) {
        inventory = JSON.parse(savedInventory);
    }
    updateMoneyDisplay();
    renderInventory();
}

function renderInventory() {
    cratesContainer.innerHTML = '';
    inventory.forEach((crateType, index) => {
        const crate = document.createElement('div');
        crate.classList.add('crate-item');
        crate.innerHTML = `<span class="crate-text">${crateType}</span>`;
        crate.dataset.index = index;
        crate.addEventListener('click', () => selectCrate(index));
        cratesContainer.appendChild(crate);
    });
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
            crate.style.border = 'none';
        }
    });
    // Show buttons
    openCrateBtn.classList.remove('hidden');
    sellCrateBtn.classList.remove('hidden');
}

function openCrate() {
    if (selectedCrateIndex !== -1) {
        showScreen('open-crate-screen');
        tapCount = 0;
        itemDropDisplay.textContent = '';
        finishOpeningBtn.classList.add('hidden');
        tapInstruction.classList.remove('hidden');
        openingCrateImg.src = `https://via.placeholder.com/200/444444/FFFFFF?text=${inventory[selectedCrateIndex]}`;
    }
}

function sellCrate() {
    if (selectedCrateIndex !== -1) {
        inventory.splice(selectedCrateIndex, 1);
        money += CRATE_SELL_PRICE;
        updateMoneyDisplay();
        selectedCrateIndex = -1;
        renderInventory();
        saveGame();
    }
}

function generateRandomItem(crateType) {
    const possibleRarities = CRATE_CONTENTS[crateType];
    let rarity;
    let foundRarity = false;
    let roll = Math.random();

    // The hidden item has a separate, very low chance
    if (roll <= RARITY_CHANCES.hidden) {
        rarity = 'hidden';
        foundRarity = true;
    }

    if (!foundRarity) {
        let chanceSum = 0;
        for (const r of possibleRarities) {
            chanceSum += RARITY_CHANCES[r];
            if (roll <= chanceSum) {
                rarity = r;
                foundRarity = true;
                break;
            }
        }
        // Fallback in case of a rounding issue
        if (!foundRarity) {
            rarity = possibleRarities[0];
        }
    }

    const itemPool = ITEMS[rarity];
    const randomIndex = Math.floor(Math.random() * itemPool.length);
    const itemName = itemPool[randomIndex];
    
    return { name: itemName, rarity: rarity };
}

function tapToOpen() {
    tapCount++;
    openingCrateImg.style.transform = `scale(${1 + tapCount * 0.1})`;
    
    if (tapCount >= 3) {
        tapInstruction.classList.add('hidden');
        openingCrateImg.style.transform = 'scale(1.2)';
        
        const crateType = inventory[selectedCrateIndex];
        const droppedItem = generateRandomItem(crateType);

        itemDropDisplay.textContent = `You got a ${droppedItem.rarity} item: ${droppedItem.name}!`;

        // Remove the crate from inventory
        inventory.splice(selectedCrateIndex, 1);
        selectedCrateIndex = -1;
        
        finishOpeningBtn.classList.remove('hidden');
        saveGame();
    }
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

checkMoneyBtn.addEventListener('click', updateMoneyDisplay);

inventoryBtn.addEventListener('click', () => {
    showScreen('inventory-screen');
    renderInventory();
});

shopBtn.addEventListener('click', () => {
    showScreen('shop-screen');
});

backToMainBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

backFromShopBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

openCrateBtn.addEventListener('click', openCrate);
sellCrateBtn.addEventListener('click', sellCrate);

openingCrateImg.addEventListener('click', tapToOpen);

finishOpeningBtn.addEventListener('click', () => {
    showScreen('inventory-screen');
    renderInventory();
});

buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const crateType = e.target.dataset.crateType;
        const price = CRATE_PRICES[crateType];
        if (money >= price) {
            money -= price;
            inventory.push(crateType);
            updateMoneyDisplay();
            saveGame();
            alert(`You bought a ${crateType} crate!`);
        } else {
            alert("Not enough money!");
        }
    });
});

// --- Initial Setup ---
window.onload = loadGame;
