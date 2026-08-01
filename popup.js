const kindWordsList = ["love", "life", "free", "kind", "wise", "true", "safe", "good", "care", "hope", "pure", "warm", "soft", "help", "gift", "calm", "dear", "fair", "fine", "glad", "holy", "noble", "smart", "smile", "sweet", "trust", "brave", "charm", "cheer"];

// ২ এবং ৩ অক্ষরের অফিশিয়াল স্ক্র্যাবল গেম শব্দের ব্যাকআপ ক্লাস্টার
const shortWordsCluster = [
    "bo", "by", "go", "oh", "ox", "oy", "uh", "xu", "yo", "am", "an", "as", "at", "be", "do", "he", "hi", "if", "in", "is", "it", "me", "my", "no", "of", "on", "or", "so", "to", "up", "we", "us",
    "bob", "bog", "boo", "box", "boy", "bub", "bug", "buy", "gob", "goo", "gox", "guv", "guy", "hob", "hog", "hoo", "hoy", "hub", "hug", "oho", "ooh", "oxo", "oxy", "ugh", "vog", "vox", "vug", "yob", "you", "zoo", "zuz", "act", "add", "age", "aim", "air", "all", "and", "any", "ape", "apt", "arc", "are", "arm", "art", "ash", "ask", "bad", "bag", "bar", "bat", "bed", "bee", "beg", "bet", "big", "bin", "bit", "bow", "bus", "but", "can", "cap", "car", "cat", "cry", "cup", "cut", "day", "did", "die", "dig", "dim", "din", "dip", "dog", "don", "dot", "dry", "due", "dug", "ear", "eat", "egg", "ego", "end", "era", "eye", "fan", "far", "fat", "fed", "few", "fit", "fix", "fly", "fog", "for", "fox", "fry", "fun", "fur", "gap", "gas", "gel", "gem", "get", "gig", "gin", "god", "gum", "gun", "gym", "had", "ham", "has", "hat", "hay", "hem", "hen", "hey", "hid", "him", "hip", "hit", "hop", "how", "hut", "ice", "ill", "ink", "inn", "ion", "its", "jam", "jar", "jaw", "jay", "jet", "job", "jog", "jot", "joy", "jug", "key", "kid", "kit", "lab", "lad", "lag", "lap", "law", "lax", "lay", "led", "leg", "let", "lid", "lie", "lip", "lit", "log", "lot", "low", "mad", "man", "map", "mat", "max", "may", "men", "met", "mid", "mix", "mob", "mod", "mop", "mud", "mug", "nag", "net", "new", "nil", "nip", "nod", "nor", "not", "now", "nun", "nut", "oak", "oar", "oat", "odd", "off", "oil", "old", "one", "opt", "our", "out", "owl", "own", "pad", "pal", "pan", "par", "pat", "paw", "pay", "pea", "peg", "pen", "pet", "pig", "pin", "pip", "pit", "ply", "pod", "pop", "pot", "pro", "pub", "pud", "pun", "pup", "pus", "rag", "ram", "ran", "rap", "rat", "raw", "ray", "red", "rib", "rid", "rig", "rim", "rip", "rob", "rod", "rot", "row", "rub", "rue", "rug", "rum", "run", "rut", "sad", "sag", "sap", "sat", "saw", "say", "sea", "see", "set", "sew", "she", "shy", "sin", "sip", "sir", "sit", "six", "ski", "sky", "sly", "sob", "sod", "son", "soy", "spa", "spy", "sty", "sub", "sue", "sum", "tag", "tan", "tap", "tar", "tax", "tea", "ten", "the", "thy", "tie", "tin", "tip", "toe", "tog", "ton", "too", "top", "toy", "try", "tub", "tug", "two", "urn", "use", "van", "vat", "vet", "via", "vie", "vow", "wag", "wan", "war", "was", "way", "web", "wed", "wee", "wet", "who", "why", "wig", "win", "wit", "woe", "won", "woo", "wry", "yak", "yam", "yap", "yaw", "yea", "yen", "yes", "yet", "yew", "yin", "zip", "it"
];

let masterMassiveDictionary = [];
let isDictionaryLoaded = false;

// ক্লাউড ডিকশনারি ফেচ করার মূল ফাংশন
async function loadOfficialScrabbleDictionary() {
    try {
        const response = await fetch("https://githubusercontent.com");
        if (!response.ok) throw new Error("Cloud Latency");
        const textData = await response.text();
        
        // ডিকশনারি ফিল্টার: ৪ থেকে ৭ অক্ষরের শব্দে সীমাবদ্ধ রাখা হয়েছে
        const cloudWords = textData.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => w.length >= 4 && w.length <= 7);
        
        masterMassiveDictionary = cloudWords.concat(shortWordsCluster);
        isDictionaryLoaded = true;
        console.log("Global Word Bank Loaded Successfully!");
    } catch (error) {
        console.error("Backup database active:", error);
        masterMassiveDictionary = shortWordsCluster.concat(["site", "item", "time", "game", "test", "step", "love", "life"]);
        isDictionaryLoaded = true;
    }
}

function getJumbleMatches(inputStr, len) {
    let counts = {};
    for (let c of inputStr) { counts[c] = (counts[c] || 0) + 1; }
    return masterMassiveDictionary.filter(w => {
        if (w.length !== len) return false;
        let wCounts = {};
        for (let c of w) {
            wCounts[c] = (wCounts[c] || 0) + 1;
            if (!counts[c] || wCounts[c] > counts[c]) return false;
        }
        return true;
    });
}

document.getElementById("solveBtn").addEventListener("click", function() {
    let input = document.getElementById("jumbleInput").value.trim().toLowerCase();
    if (input === "") { alert("Please enter some jumbled letters first!"); return; }
    if (input.length > 17) {
        input = input.substring(0, 17);
        document.getElementById("jumbleInput").value = input;
    }
    
    let container = document.getElementById("resultsContainer");
    container.innerHTML = "";
    
    if (!isDictionaryLoaded) {
        container.innerHTML = "<div style='color:#00ff00; font-weight:bold;'>Syncing with Global Cloud Word Bank...</div>";
        return;
    }
    
    let hasWords = false; let kindMatches = []; let goodMatches = {};

    for (let l = 7; l >= 2; l--) {
        let res = getJumbleMatches(input, l);
        if (res.length > 0) {
            hasWords = true;
            res.forEach(word => {
                if (kindWordsList.includes(word)) { kindMatches.push(word); } 
                else {
                    if (!goodMatches[l]) goodMatches[l] = [];
                    goodMatches[l].push(word);
                }
            });
        }
    }

    if (kindMatches.length > 0) {
        let uKind = [...new Set(kindMatches)];
        let kHtml = '<div class="word-group"><div class="group-title" style="color:#00ffff;margin-top:15px;">✨ KIND AND POSITIVE WORDS</div><div>';
        uKind.forEach(w => { kHtml += '<span class="word-box" style="border-color:#00ffff;color:#00ffff;">' + w + '</span>'; });
        kHtml += '</div></div>'; container.innerHTML += kHtml;
    }

    for (let l = 7; l >= 2; l--) {
        if (goodMatches[l] && goodMatches[l].length > 0) {
            let uGood = [...new Set(goodMatches[l])].slice(0, 60);
            let gHtml = '<div class="word-group"><div class="group-title" style="color:#00ff00;margin-top:15px;">🟢 ' + l + ' LETTER WORDS</div><div>';
            uGood.forEach(w => { gHtml += '<span class="word-box">' + w + '</span>'; });
            gHtml += '</div></div>'; container.innerHTML += gHtml;
        }
    }

    if (!hasWords) {
        container.innerHTML = '<div style="color:#555;font-size:0.9rem;margin-top:15px;">No meaningful words (2-7 letters) detected.</div>';
    }
});

window.addEventListener("DOMContentLoaded", loadOfficialScrabbleDictionary);
