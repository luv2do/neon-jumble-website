const dictionary = [
    "aggadas", "saggard", "scramble", "bengali", "international", "computer", "knowledge", "network",
    "aggada", "daggas", "farads", "raggas", "saggar", "jumble", "solver", "google", "online", "active", "system", "credit", "domain",
    "afars", "agars", "dadas", "dagga", "drags", "farad", "fards", "frags", "garda", "grads", "ragas", "ragga", "raggs", "smart", "apple", "games", "words", "hindi", "india", "place", "local",
    "adds", "afar", "agar", "agas", "arfs", "dada", "dads", "dags", "drag", "fads", "fard", "frag", "gads", "gaga", "gags", "gars", "grad", "rads", "raga", "ragg", "rags", "saga", "sard", "game", "word", "news", "free", "live", "chat", "maps", "site", "view",
    "aas", "add", "ads", "age", "ags", "arf", "ars", "dad", "dag", "das", "fad", "far", "fas", "gad", "gag", "gar", "gas", "rad", "rag", "raw", "sad", "sag", "cat", "dog", "act", "the", "and", "for", "you", "not", "but", "all", "api", "url",
    "aa", "ad", "ag", "ar", "as", "da", "fa", "am", "an", "do", "go", "to", "in", "is", "it", "me", "my", "no", "he", "we"
];

const offensiveDictionary = [
    "fag", "fags", "damn", "hell", "crap", "suck", "jerk", "fool", "ugly", "idiot"
];

document.getElementById('solveBtn').addEventListener('click', solveJumble);

document.getElementById('letters').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        solveJumble();
    }
});

const toggleBtn = document.getElementById('toggleOffensiveBtn');
const offensiveContainer = document.getElementById('offensiveContainer');

toggleBtn.addEventListener('click', function() {
    if (offensiveContainer.style.display === 'block') {
        offensiveContainer.style.display = 'none';
        toggleBtn.innerText = "Show Offensive Words";
    } else {
        offensiveContainer.style.display = 'block';
        toggleBtn.innerText = "Hide Offensive Words";
    }
});

function solveJumble() {
    const input = document.getElementById('letters').value.toLowerCase().replace(/[^a-z]/g, '').trim();
    const resultsDiv = document.getElementById('results');
    const offensiveWrapper = document.getElementById('offensiveWrapper');
    const offensiveList = document.getElementById('offensiveList');
    
    resultsDiv.innerHTML = ''; 
    offensiveList.innerHTML = '';
    offensiveWrapper.style.display = 'none';
    offensiveContainer.style.display = 'none';
    toggleBtn.innerText = "Show Offensive Words";

    if (!input) {
        alert('Please type some letters!');
        return;
    }

    const inputCount = getLetterCount(input);
    const matchedWords = [];
    const matchedOffensive = [];

    for (let word of dictionary) {
        if (word.length <= input.length) {
            if (canFormWord(getLetterCount(word), inputCount)) matchedWords.push(word);
        }
    }

    for (let word of offensiveDictionary) {
        if (word.length <= input.length) {
            if (canFormWord(getLetterCount(word), inputCount)) matchedOffensive.push(word);
        }
    }

    if (matchedWords.length === 0 && matchedOffensive.length === 0) {
        resultsDiv.innerHTML = '<div style="color:#ff3131; text-align:center; font-weight:bold; padding: 10px;">No words found!</div>';
        resultsDiv.style.display = 'block';
        return;
    }

    if (matchedWords.length > 0) {
        matchedWords.sort((a, b) => b.length - a.length);
        const grouped = {};
        matchedWords.forEach(word => {
            const len = word.length;
            if (!grouped[len]) grouped[len] = [];
            grouped[len].push(word);
        });

        const sortedLengths = Object.keys(grouped).sort((a, b) => b - a);
        sortedLengths.forEach(len => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'word-group';
            
            const heading = document.createElement('h4');
            heading.innerText = `${len} Letter Words`;
            
            const listDiv = document.createElement('div');
            listDiv.className = 'word-list';
            
            grouped[len].forEach(word => {
                const span = document.createElement('span');
                span.className = 'word-item';
                span.innerText = word;
                listDiv.appendChild(span);
            });
            
            groupDiv.appendChild(heading);
            groupDiv.appendChild(listDiv);
            resultsDiv.appendChild(groupDiv);
        });
        resultsDiv.style.display = 'block';
    }

    if (matchedOffensive.length > 0) {
        toggleBtn.innerText = `Show Offensive Words (${matchedOffensive.length})`;
        
        matchedOffensive.forEach(word => {
            const span = document.createElement('span');
            span.className = 'word-item offensive-item';
            span.innerText = word;
            offensiveList.appendChild(span);
        });
        
        offensiveWrapper.style.display = 'block';
    }
}

function getLetterCount(str) {
    const count = {};
    for (let char of str) count[char] = (count[char] || 0) + 1;
    return count;
}

function canFormWord(wordCount, inputCount) {
    for (let char in wordCount) {
        if (!inputCount[char] || inputCount[char] < wordCount[char]) return false;
    }
    return true;
}
