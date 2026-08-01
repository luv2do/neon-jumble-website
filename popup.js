const globalSlangDictionary = [
    "fuck", "clit", "pussy", "penis", "peni", "suck", "bitch", "ass", "asshole", 
    "cunt", "dick", "cock", "bastard", "slut", "whore", "twat", "wank", "prick"
];

let masterEnglishDictionary = [];

// বিশ্বস্ত গ্লোবাল CDN থেকে ১,২০,০০০+ শব্দের অফিশিয়াল স্ক্র্যাবল ডিকশনারি লোড করা
async function loadMassiveDictionary() {
    try {
        const response = await fetch('https://githubusercontent.com');
        if (!response.ok) throw new Error("Dictionary fetch failed");
        
        const textData = await response.text();
        masterEnglishDictionary = textData.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
        console.log("Massive Jumble Dictionary Loaded! Total words:", masterEnglishDictionary.length);
    } catch (error) {
        console.error("Failed to load global dictionary, switching to local backup.", error);
        masterEnglishDictionary = ["site", "item", "time", "nest", "pest", "spin", "sine", "into", "test", "step", "jumble", "universe"];
    }
}

// ইনপুটের অক্ষর থেকে নির্দিষ্ট দৈর্ঘ্যের বৈধ শব্দ বানানোর ফাস্ট অ্যালগরিদম
function solveAnyJumbledLetters(userInput, targetLength) {
    const inputCount = {};
    for (let char of userInput.toLowerCase()) {
        inputCount[char] = (inputCount[char] || 0) + 1;
    }
    
    return masterEnglishDictionary.filter(word => {
        if (word.length !== targetLength) return false;
        
        const wordCount = {};
        for (let char of word) {
            wordCount[char] = (wordCount[char] || 0) + 1;
            if (!inputCount[char] || wordCount[char] > inputCount[char]) {
                return false;
            }
        }
        return true;
    });
}

function detectSlangWordsMeticulously(userInput) {
    const lowerInput = userInput.toLowerCase().replace(/\s+/g, '');
    const foundSlangs = [];
    globalSlangDictionary.forEach(slang => {
        if (lowerInput.includes(slang)) {
            foundSlangs.push(slang);
        }
    });
    return foundSlangs;
}

// 'SOLVE IT' বাটন ক্লিক হ্যান্ডলার
document.getElementById("solveBtn").addEventListener("click", function() {
    let inputVal = document.getElementById("jumbleInput").value.trim();
    
    if (inputVal === "") {
        alert("Please enter some jumbled letters first!");
        return;
    }

    // ২০ অক্ষরের লিমিট চেক
    if (inputVal.length > 20) {
        inputVal = inputVal.substring(0, 20);
        document.getElementById("jumbleInput").value = inputVal;
    }

    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // আগের রেজাল্ট কন্টেইনার ক্লিয়ার করা
    
    let anyWordFound = false;

    // ৭ অক্ষরের শব্দ থেকে শুরু করে ২ অক্ষরের শব্দ পর্যন্ত লুপ চালানো (বড় থেকে ছোট আকারে সাজানোর জন্য)
    for (let length = 7; length >= 2; length--) {
        const wordsFound = solveAnyJumbledLetters(inputVal, length);
        
        if (wordsFound.length > 0) {
            anyWordFound = true;
            const uniqueWords = [...new Set(wordsFound)].slice(0, 40); // প্রতি ক্যাটাগরিতে সর্বোচ্চ ৪০টি শব্দ শো করবে
            
            // ডাইনামিক HTML গ্রুপ তৈরি
            const groupDiv = document.createElement("div");
            groupDiv.className = "word-group";
            
            const titleDiv = document.createElement("div");
            titleDiv.className = "group-title";
            titleDiv.innerText = `${length} Letter Words`;
            groupDiv.appendChild(titleDiv);
            
            const wordsListDiv = document.createElement("div");
            uniqueWords.forEach(word => {
                wordsListDiv.innerHTML += `<span class="word-box">${word}</span>`;
            });
            
            groupDiv.appendChild(wordsListDiv);
            resultsContainer.appendChild(groupDiv);
        }
    }

    if (!anyWordFound) {
        resultsContainer.innerHTML = `<span style="color: #555; font-size: 0.9rem;">No meaningful words (2-7 letters) can be made from these letters.</span>`;
    }

    // স্লাং ডিটেকশন রেন্ডার
    const detectedSlangs = detectSlangWordsMeticulously(inputVal);
    const offensiveContainer = document.getElementById("offensiveWords");
    offensiveContainer.innerHTML = ""; 

    if (detectedSlangs.length > 0) {
        const uniqueSlangs = [...new Set(detectedSlangs)];
        uniqueSlangs.forEach(slang => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "word-box";
            wordSpan.style.borderColor = "#ff0000";
            wordSpan.style.color = "#ff0000";
            wordSpan.innerText = slang;
            offensiveContainer.appendChild(wordSpan);
        });
    } else {
        offensiveContainer.innerHTML = `<span style="color: #555; font-size: 0.9rem;">Clean input. No offensive words detected.</span>`;
    }
});

window.addEventListener('DOMContentLoaded', loadMassiveDictionary);
