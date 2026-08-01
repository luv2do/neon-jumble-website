// ১. স্লাং এবং হার্ডকোর স্লাং ক্লাসিফিকেশন ডাটাবেজ
const hardcoreSlangs = ["fuck", "cunt", "dick", "cock", "bitch", "whore", "slut"];
const regularSlangs = ["clit", "pussy", "penis", "peni", "suck", "ass", "asshole", "twat", "wank", "prick"];

// ২. কাইন্ড বা ইতিবাচক শব্দের ডাটাবেজ
const kindWordsList = [
    "love", "life", "free", "kind", "wise", "true", "safe", "good", "care", "hope", 
    "pure", "warm", "soft", "help", "gift", "calm", "dear", "fair", "fine", "glad",
    "holy", "noble", "smart", "smile", "sweet", "trust", "brave", "charm", "cheer"
];

// ৩. ইন-বিল্ট ডাটাবেজ (যা কোনো ব্রাউজার এরর ছাড়াই ১০০% নিশ্চিতভাবে রান করবে)
const baselineDictionary = [
    "about", "above", "actor", "acute", "admit", "adopt", "adult", "after", "again", "agent", "agree", "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone", "along", "alter", "among", "anger", "angle", "angry", "apart", "apple", "apply", "arena", "argue", "arise", "array", "arrow", "aside", "asset", "audio", "audit", "avoid", "award", "aware", "awful", "back", "bad", "ball", "bank", "base", "basic", "basis", "beach", "bear", "beat", "beauty", "become", "before", "began", "begin", "begun", "behind", "being", "below", "bench", "best", "better", "beyond", "bible", "big", "bike", "bill", "bird", "birth", "black", "blade", "blame", "blind", "block", "blood", "board", "boast", "body", "bold", "bomb", "bond", "bone", "bonus", "book", "boom", "boost", "boot", "border", "boss", "both", "bother", "bottle", "bottom", "bought", "bound", "bowl", "box", "boy", "brain", "brake", "branch", "brand", "brave", "bread", "break", "breast", "breath", "brick", "bride", "bridge", "brief", "bright", "bring", "broad", "broke", "broken", "brother", "brought", "brown", "brush", "budget", "build", "built", "bullet", "bunch", "burden", "bureau", "burn", "burst", "bus", "bush", "business", "busy", "but", "buyer", "cabin", "cable", "cake", "call", "calm", "came", "camera", "camp", "campus", "can", "cancel", "cancer", "candle", "cane", "cap", "care", "career", "cargo", "carpet", "carry", "cart", "case", "cash", "cast", "cat", "catch", "cause", "cave", "cell", "cent", "chain", "chair", "chart", "chase", "cheap", "cheat", "check", "cheek", "cheer", "cheese", "chef", "child", "choice", "choose", "chose", "chosen", "church", "cigar", "cite", "city", "civil", "claim", "class", "clay", "clean", "clear", "clearly", "clerk", "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "close", "closed", "cloth", "cloud", "club", "clue", "coach", "coal", "coast", "coat", "code", "coin", "cold", "color", "come", "cook", "cool", "copy", "coral", "cord", "core", "corn", "cost", "couch", "cough", "could", "count", "court", "cover", "cow", "coward", "crack", "craft", "crane", "crash", "crate", "crazy", "cream", "create", "crew", "crime", "crop", "cross", "crowd", "crown", "crucial", "crude", "cruel", "cruise", "crumb", "crush", "crust", "cry", "crystal", "cube", "cubic", "cucumber", "cuddle", "cue", "cuff", "cult", "culture", "cup", "cupboard", "cure", "curfew", "curious", "curl", "current", "cursor", "curtain", "curve", "cushion", "custom", "customer", "cut", "cycle", "cylinder", "item", "site", "time", "game", "test", "step", "jumble", "universe", "neon", "data", "star", "moon", "sun", "wind", "fire", "water", "earth", "gold", "fish", "bird", "lion", "road", "door", "dark", "light", "blue", "red", "green", "onset", "ties", "nest", "pest", "spin", "sine"
];

// ৪. জুম্বল শব্দ মেলানোর পিওর অ্যালগরিদম
function getJumbleMatches(userInput, targetLength) {
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

// ৫. স্লাং সনাক্তকরণ লজিক
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

// ৬. 'SOLVE IT' বাটন ট্রিগার এবং ইনস্ট্যান্ট স্ক্রিন রেন্ডারিং
document.getElementById("solveBtn").addEventListener("click", function() {
    let inputVal = document.getElementById("jumbleInput").value.trim().toLowerCase();
    
    if (inputVal === "") {
        alert("Please enter some jumbled letters first!");
        return;
    }

    // কোড লেভেলেও ১৭ অক্ষরের অতিরিক্ত অংশ ট্রিম করার সিকিউরিটি রাখা হলো
    if (inputVal.length > 17) {
        inputVal = inputVal.substring(0, 17);
        document.getElementById("jumbleInput").value = inputVal;
    }

    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; 

    const segregation = { kind: [], good: [] };

    for (let length = 7; length >= 2; length--) {
        const localMatches = getJumbleMatches(inputVal, length);
        localMatches.forEach(word => {
            if (kindWordsList.includes(word)) {
                segregation.kind.push(word);
            } else {
                segregation.good.push(word);
            }
        });
    }

    let contextAdded = false;

    // ✨ KIND WORDS সেকশন রেন্ডার
    if (segregation.kind.length > 0) {
        contextAdded = true;
        const uniqueKind = [...new Set(segregation.kind)];
        resultsContainer.innerHTML += `
            <div class="word-group">
                <div class="group-title" style="color: #00ffff; margin-top: 15px;">✨ KIND & POSITIVE WORDS</div>
                <div>${uniqueKind.map(w => `<span class="word-box" style="border-color: #00ffff; color: #00ffff;">${w}</span>`).join('')}</div>
            </div>`;
    }

    // 🟢 GOOD WORDS সেকশন রেন্ডার
    if (segregation.good.length > 0) {
        contextAdded = true;
        const uniqueGood = [...new Set(segregation.good)];
        resultsContainer.innerHTML += `
            <div class="word-group">
                <div class="group-title" style="color: #00ff00; margin-top: 15px;">🟢 GOOD & STANDARD WORDS (2-7 Letters)</div>
                <div>${uniqueGood.map(w => `<span class="word-box">${w}</span>`).join('')}</div>
            </div>`;
    }

    if (!contextAdded) {
        resultsContainer.innerHTML = `<div style="color: #555; font-size: 0.9rem; margin-top: 15px;">No meaningful words (2-7 letters) could be formed from these letters.</div>`;
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
