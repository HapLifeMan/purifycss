const addWord = (words, word) => {
    if (word) words.push(word)
}

export const getAllWordsInContent = content => {
    let used = {
        // Always include html and body.
        html: true,
        body: true
    }
    const words = content.split(/[^a-zA-Z0-9\\@+]/g)
    for (let word of words) {
        if(word && word !== "+") { used[word] = true }
    }
    return used
}

export const getAllWordsInSelector = selector => {
    // Remove attr selectors. "a[href...]"" will become "a".
    selector = selector.replace(/\[(.+?)\]/g, "").toLowerCase()
    console.log(selector)
    // If complex attr selector (has a bracket in it) just leave
    // the selector in. ¯\_(ツ)_/¯
    if (selector.includes("[") || selector.includes("]")) {
        return []
    }
    let skipNextWord = false,
        word = "",
        words = []

    let last_letter = '';
    for (let letter of selector) {
        if (skipNextWord && !(/[ #.]/).test(letter)) continue
        // If pseudoclass or universal selector, skip the next word
        if (/[:*]/.test(letter) && last_letter != '\\') {
            addWord(words, word.replace('\\', ''))
            word = ""
            skipNextWord = true
            continue
        }
        if (/[a-zA-Z0-9\\@+]/.test(letter)) {
            word += letter
            last_letter = letter
        } else {
            addWord(words, word.replace('\\', ''))
            word = ""
            skipNextWord = false
        }
    }

    addWord(words, word)
    return words
}
