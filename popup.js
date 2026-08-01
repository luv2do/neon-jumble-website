// ১. স্লাং এবং হার্ডকোর স্লাং ক্লাসিফিকেশন ডাটাবেজ
const hardcoreSlangs = ["fuck", "cunt", "dick", "cock", "bitch", "whore", "slut"];
const regularSlangs = ["clit", "pussy", "penis", "peni", "suck", "ass", "asshole", "twat", "wank", "prick"];

// ২. কাইন্ড বা ইতিবাচক শব্দের ডাটাবেজ
const kindWordsList = [
    "love", "life", "free", "kind", "wise", "true", "safe", "good", "care", "hope", 
    "pure", "warm", "soft", "help", "gift", "calm", "dear", "fair", "fine", "glad",
    "holy", "noble", "smart", "smile", "sweet", "trust", "brave", "charm", "cheer"
];

// ৩. লোকাল JSON ফাইল থেকে শব্দ লোড করার মেকানিজম
let baselineDictionary = [];

async function loadWordsFromJSON() {
    try {
        const response = await fetch('./words.json');
        if (!response.ok) throw new Error("Failed to load JSON");
        baselineDictionary = await response.json();
        console.log("Local words.json database linked perfectly!");
    } catch (error) {
        console.error("Backup trigger active due to fetch error:", error);
        // ব্যাকআপ ডাটাবেজ যদি কোনো কারণে JSON লোড না হয়
        baselineDictionary = ["site", "item", "time", "game", "test", "step", "jumble", "universe", "love", "life"];
    }
}

// ৪. ডিকশনারি API ভ্যালিডেশন (২ মিলিয়ন শব্দের ব্যাকএন্ড চেক)
async function verifyWordViaAPI(word) {
    try {
        const response = await fetch(`https://dictionaryapi.dev{word}`);
        return response.ok;
    } catch {
        return false;
    }
}

function getLocalJumbleMatches(userInput, targetLength) {
    const inputCount = {};
    for (let char of userInput.toLowerCase()) {
        inputCount[char] = (inputCount[char] || 0) + 1;
    }
    
    return baselineDictionary.filter(word => {
        if (word.length !== targetLength) return false;
        const wordCount = {};
        for (let char of word) {
            wordCount[char] = (wordCount[char] || 0) + 1;
            if (!inputCount[char] || wordCount[char] > inputCount[char]) return false;
        }
        return true;
    });
}

function categorizeOffensiveWords(userInput) {
    const lowerInput = userInput.toLowerCase().replace(/\s+/g, '');
    const detectedHardcore = [];
    const detectedRegularSlang = [];

    hardcoreSlangs.forEach(slang => {
        if (lowerInput.includes(slang)) detectedHardcore.push(slang);
    });

    regularSlangs.forEach(slang => {
        if (lowerInput.includes(slang)) detectedRegularSlang.push(slang);
    });

    return { hardcore: detectedHardcore, regular: detectedRegularSlang };
}

// ৫. 'SOLVE IT' বাটন ট্রিগার
document.getElementById("solveBtn").addEventListener("click", async function() {
    let inputVal = document.getElementById("jumbleInput").value.trim().toLowerCase();
    
    if (inputVal === "") {
        alert("Please enter some jumbled letters first!");
        return;
    }

    if (inputVal.length > 20) {
        inputVal = inputVal.substring(0, 20);
        document.getElementById("jumbleInput").value = inputVal;
    }

    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "<div style='color: #00ff00; font-size: 1.1rem; font-weight: bold;'>Scanning Global 2M+ Words Database...</div>"; 
    
    let validWordsFound = [];
    for (let length = 7; length >= 2; length--) {
        const localMatches = getLocalJumbleMatches(inputVal, length);
        validWordsFound = validWordsFound.concat(localMatches);
    }

    const apiVerificationPromises = validWordsFound.map(async (word) => {
        const isValid = await verifyWordViaAPI(word);
        return isValid ? word : null;
    });

    const verifiedResults = (await Promise.all(apiVerificationPromises)).filter(word => word !== null);
    resultsContainer.innerHTML = "";

    const segregation = { kind: [], good: [] };
    verifiedResults.forEach(word => {
        if (kindWordsList.includes(word)) {
            segregation.kind.push(word);
        } else {
            segregation.good.push(word);
        }
    });

    let contextAdded = false;

    if (segregation.kind.length > 0) {
        contextAdded = true;
        resultsContainer.innerHTML += `
            <div class="word-group">
                <div class="group-title" style="color: #00ffff;">✨ KIND & POSITIVE WORDS</div>
                <div>${[...new Set(segregation.kind)].map(w => `<span class="word-box" style="border-color: #00ffff; color: #00ffff;">${w}</span>`).join('')}</div>
            </div>`;
    }

    if (segregation.good.length > 0) {
        contextAdded = true;
        resultsContainer.innerHTML += `
            <div class="word-group">
                <div class="group-title" style="color: #00ff00;">🟢 GOOD & STANDARD WORDS (2-7 Letters)</div>
                <div>${[...new Set(segregation.good)].map(w => `<span class="word-box">${w}</span>`).join('')}</div>
            </div>`;
    }

    if (!contextAdded) {
        resultsContainer.innerHTML = `<span style="color: #555; font-size: 0.9rem;">No meaningful words (2-7 letters) could be formed.</span>`;
    }

    // স্লাং এবং হার্ডকোর স্লাং রেন্ডারিং
    const slangsData = categorizeOffensiveWords(inputVal);
    const offensiveContainer = document.getElementById("offensiveWords");
    offensiveContainer.innerHTML = ""; 

    if (slangsData.hardcore.length > 0 || slangsData.regular.length > 0) {
        if (slangsData.hardcore.length > 0) {
            [...new Set(slangsData.hardcore)].forEach(slang => {
                offensiveContainer.innerHTML += `<span class="word-box" style="border-color: #ff0055; color: #ff0055; background: rgba(255,0,85,0.1);">🚨 HARDCORE: ${slang}</span>`;
            });
        }
        if (slangsData.regular.length > 0) {
            [...new Set(slangsData.regular)].forEach(slang => {
                offensiveContainer.innerHTML += `<span class="word-box" style="border-color: #ff3300; color: #ff3300; background: rgba(255,51,0,0.1);">⚠️ SLANG: ${slang}</span>`;
            });
        }
    } else {
        offensiveContainer.innerHTML = `<span style="color: #555; font-size: 0.9rem;">Clean input. No offensive words detected.</span>`;
    }
});

// পেজ লোড হওয়ার সাথে সাথে লোকাল JSON ফাইলটি মেমোরিতে রিড হবে
window.addEventListener('DOMContentLoaded', loadWordsFromJSON);
