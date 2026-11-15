/** Titles of the three detail cards of every category (Thai / English). */
const DETAIL_TITLES = {
  love: { th: ['หัวใจ', 'จังหวะเวลา', 'ความสัมพันธ์'], en: ['Heart', 'Timing', 'Connection'] },
  career: { th: ['โอกาส', 'ความร่วมมือ', 'ความก้าวหน้า'], en: ['Opportunity', 'Teamwork', 'Progress'] },
  finance: { th: ['รายได้', 'รายจ่าย', 'การออม'], en: ['Income', 'Spending', 'Saving'] },
  education: { th: ['สมาธิ', 'ความจำ', 'ผลลัพธ์'], en: ['Focus', 'Memory', 'Results'] },
  life: { th: ['สุขภาพ', 'พลังใจ', 'ความสมดุล'], en: ['Health', 'Spirit', 'Balance'] }
};

/** One sentence per detail card for each level. */
const LEVEL_PHRASES = {
  high: {
    th: ['พลังอยู่ในระดับสูง ใช้โอกาสนี้ได้เต็มที่', 'ราบรื่น ไม่ต้องฝืนมาก', 'มีแนวโน้มดีขึ้นต่อเนื่อง'],
    en: ['Energy is high; make full use of it.', 'Smooth, with little forcing needed.', 'Trending upward.']
  },
  medium: {
    th: ['อยู่ในระดับปกติ ดูแลต่อเนื่อง', 'ต้องปรับเล็กน้อยให้เข้าที่', 'คงที่ รอจังหวะที่เหมาะ'],
    en: ['Normal; keep tending to it.', 'Needs small adjustments.', 'Stable; wait for the right moment.']
  },
  low: {
    th: ['ควรระวังและไม่ฝืนตัวเอง', 'อาจติดขัดชั่วคราว', 'รอให้สถานการณ์นิ่งก่อน'],
    en: ['Take care and do not force it.', 'May stall for a while.', 'Wait for things to settle.']
  }
};

/** Scores (0-100) of the three detail cards for each level. */
const LEVEL_SCORES = {
  high: [88, 82, 90],
  medium: [68, 72, 65],
  low: [45, 50, 42]
};

/** Generic advice used when the reading comes from the external API. */
const LEVEL_ADVICE = {
  high: { th: 'ใช้จังหวะดีนี้ลงมือทำสิ่งที่ตั้งใจไว้', en: 'Use this good rhythm to act on what you planned.' },
  medium: { th: 'ค่อยเป็นค่อยไปและรักษาความสม่ำเสมอ', en: 'Take it step by step and stay consistent.' },
  low: { th: 'ชะลอการตัดสินใจใหญ่ และพักผ่อนให้เพียงพอ', en: 'Hold off on big decisions and rest enough.' }
};

/**
 * Small stable number from a text, used to pick a level without randomness.
 * @param {string} text - Any text.
 * @returns {number} Non-negative integer.
 */
function hashText(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash * 33) ^ text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Builds the three detail cards of a category for a level.
 * @param {string} category - One of the five categories.
 * @param {'high'|'medium'|'low'} level - Reading level.
 * @param {'th'|'en'} lang - Language.
 * @returns {Array<{title: string, text: string, score: number}>}
 */
function buildDetails(category, level, lang) {
  const titles = DETAIL_TITLES[category][lang];
  return titles.map((title, index) => ({
    title,
    text: LEVEL_PHRASES[level][lang][index],
    score: LEVEL_SCORES[level][index]
  }));
}

module.exports = { DETAIL_TITLES, LEVEL_PHRASES, LEVEL_SCORES, LEVEL_ADVICE, hashText, buildDetails };
