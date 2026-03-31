// src/helpers/textSimilarity.js

// Hàm tách từ đơn giản (Tokenization)
function tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Loại bỏ dấu câu
        .split(/\s+/) // Tách theo khoảng trắng
        .filter(w => w.length > 0);
}

// Tạo Vector (CountVectorizer logic)
function getWordCountVector(tokens, vocabulary) {
    const vector = new Array(vocabulary.length).fill(0);
    tokens.forEach(token => {
        const index = vocabulary.indexOf(token);
        if (index !== -1) {
            vector[index] += 1;
        }
    });
    return vector;
}

// Tính Cosine Similarity
export function calculateCosineSimilarity(text1, text2) {
    const tokens1 = tokenize(text1);
    const tokens2 = tokenize(text2);

    if (tokens1.length === 0 || tokens2.length === 0) return 0;

    // Tạo bộ từ vựng chung (Vocabulary)
    const vocabulary = Array.from(new Set([...tokens1, ...tokens2]));

    // Tạo vectors
    const vector1 = getWordCountVector(tokens1, vocabulary);
    const vector2 = getWordCountVector(tokens2, vocabulary);

    // Tính Dot Product
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vocabulary.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        magnitude1 += vector1[i] * vector1[i];
        magnitude2 += vector2[i] * vector2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
}