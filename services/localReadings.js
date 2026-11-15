const { buildDetails, hashText } = require('./readingData');

/**
 * The 15 local Astra readings: 3 per category, Thai and English.
 * They keep the app working when the external API is missing or down.
 */
const READINGS = {
  love: [
    {
      level: 'high',
      th: { headline: 'หัวใจเปิดรับความอบอุ่น', description: 'พลังด้านความรักกำลังสว่างขึ้น คนที่เข้ามาในช่วงนี้มีโอกาสสร้างความผูกพันที่จริงใจ', advice: 'พูดความรู้สึกของคุณอย่างตรงไปตรงมา แล้วรับฟังอีกฝ่ายด้วยใจเปิดกว้าง' },
      en: { headline: 'A heart open to warmth', description: 'Love energy is rising. People who enter your life now have a real chance at a sincere bond.', advice: 'Say what you feel plainly, then listen with an open mind.' }
    },
    {
      level: 'medium',
      th: { headline: 'จังหวะเรียบง่ายที่ค่อยๆ เติบโต', description: 'ความรักอยู่ในช่วงทรงตัว ไม่หวือหวาแต่มั่นคง ความใส่ใจเล็กๆ น้อยๆ จะสร้างความต่างได้', advice: 'ใช้เวลาคุณภาพกับคนสำคัญ แม้เพียงเรื่องเล็กๆ ก็ช่วยได้มาก' },
      en: { headline: 'A quiet rhythm that grows', description: 'Love is steady rather than dramatic. Small acts of care will make the difference.', advice: 'Spend real time with the people who matter, even on small things.' }
    },
    {
      level: 'low',
      th: { headline: 'พักใจก่อนตัดสินใจ', description: 'ความรู้สึกอาจสับสนในช่วงนี้ อย่าเพิ่งด่วนสรุปเรื่องสำคัญตอนอารมณ์ไม่นิ่ง', advice: 'ให้เวลากับตัวเองสักระยะ แล้วค่อยคุยเรื่องที่ค้างคาใจ' },
      en: { headline: 'Pause before you decide', description: 'Feelings may be mixed right now. Avoid big conclusions while emotions are unsettled.', advice: 'Give yourself some time, then talk about what has been left unsaid.' }
    }
  ],
  career: [
    {
      level: 'high',
      th: { headline: 'โอกาสใหม่กำลังเคาะประตู', description: 'ความพยายามที่ผ่านมาเริ่มเห็นผล คนรอบข้างมองเห็นฝีมือของคุณชัดเจนขึ้น', advice: 'รับงานที่ท้าทายอย่างมั่นใจ แต่จดแผนและกำหนดส่งให้ชัด' },
      en: { headline: 'A new opportunity is knocking', description: 'Past effort is starting to pay off and others see your skill more clearly.', advice: 'Take on the challenge with confidence, but write down plans and deadlines.' }
    },
    {
      level: 'medium',
      th: { headline: 'ก้าวต่อไปอย่างมั่นคง', description: 'งานดำเนินไปตามแผน อาจมีรายละเอียดให้ปรับเล็กน้อย แต่ภาพรวมยังดี', advice: 'ตรวจสอบรายละเอียดซ้ำอีกครั้งก่อนส่งงานสำคัญ' },
      en: { headline: 'Steady steps forward', description: 'Work is on track. A few details may need adjusting, but the overall picture is good.', advice: 'Double-check the details before delivering anything important.' }
    },
    {
      level: 'low',
      th: { headline: 'ทบทวนก่อนเดินหน้า', description: 'อาจมีอุปสรรคหรือความเข้าใจไม่ตรงกันในที่ทำงาน ควรสื่อสารให้ชัดเจนขึ้น', advice: 'ถามให้แน่ใจเมื่อไม่แน่ใจ และอย่าแบกงานทั้งหมดไว้คนเดียว' },
      en: { headline: 'Review before you push on', description: 'There may be obstacles or misunderstandings at work. Communicate more clearly.', advice: 'Ask when unsure, and do not carry everything alone.' }
    }
  ],
  finance: [
    {
      level: 'high',
      th: { headline: 'จังหวะการเงินเป็นใจ', description: 'รายได้หรือโอกาสด้านการเงินมีแนวโน้มดีขึ้น การวางแผนที่ดีจะช่วยต่อยอดได้', advice: 'แบ่งส่วนหนึ่งเป็นเงินออม ก่อนที่จะใช้จ่ายเพิ่ม' },
      en: { headline: 'Money rhythm is on your side', description: 'Income or financial opportunities look better, and good planning will help them grow.', advice: 'Set aside part of it as savings before spending more.' }
    },
    {
      level: 'medium',
      th: { headline: 'บริหารสมดุลรายรับรายจ่าย', description: 'การเงินอยู่ในระดับปกติ ควรระวังรายจ่ายเล็กๆ ที่สะสมโดยไม่รู้ตัว', advice: 'ลองจดรายจ่ายสัปดาห์นี้ แล้วดูว่ามีอะไรตัดได้บ้าง' },
      en: { headline: 'Balance what comes in and goes out', description: 'Finances are ordinary. Watch small expenses that add up unnoticed.', advice: "Track this week's spending and see what can be trimmed." }
    },
    {
      level: 'low',
      th: { headline: 'ชะลอการใช้จ่ายใหญ่', description: 'ช่วงนี้ควรระมัดระวังการลงทุนหรือซื้อของชิ้นใหญ่ ข้อมูลอาจยังไม่ครบ', advice: 'รอให้ข้อมูลชัดเจนก่อน และเก็บเงินสำรองไว้ใช้ยามจำเป็น' },
      en: { headline: 'Slow down big spending', description: 'Be careful with investments or large purchases. The information may be incomplete.', advice: 'Wait for clearer facts and keep an emergency reserve.' }
    }
  ],
  education: [
    {
      level: 'high',
      th: { headline: 'สมาธิและความจำเฉียบคม', description: 'การเรียนรู้ของคุณลื่นไหล เหมาะกับการเริ่มเรื่องใหม่หรือรับมือเนื้อหายากๆ', advice: 'ตั้งเป้าหมายสั้นๆ ทุกวัน และใช้ช่วงเวลาที่โฟกัสดีที่สุดให้คุ้ม' },
      en: { headline: 'Sharp focus and memory', description: 'Learning flows easily, a good time to start something new or tackle hard material.', advice: 'Set short daily goals and use your best focus hours well.' }
    },
    {
      level: 'medium',
      th: { headline: 'ค่อยๆ สะสมความรู้', description: 'ผลลัพธ์ยังไม่เด่นชัดแต่ทิศทางถูกต้อง ความสม่ำเสมอสำคัญกว่าความเร็ว', advice: 'ทบทวนบทเรียนเดิมสั้นๆ ก่อนเริ่มเรื่องใหม่' },
      en: { headline: 'Building knowledge bit by bit', description: 'Results are not obvious yet but the direction is right. Consistency beats speed.', advice: 'Briefly review old lessons before starting new ones.' }
    },
    {
      level: 'low',
      th: { headline: 'ให้เวลากับการพักสมอง', description: 'ความเหนื่อยล้าอาจทำให้เรียนไม่เข้าหัว ลองเปลี่ยนวิธีเรียนหรือพักให้พอ', advice: 'แบ่งเนื้อหาเป็นก้อนเล็กๆ และปรึกษาเพื่อนหรืออาจารย์เมื่อติดขัด' },
      en: { headline: 'Give your mind some rest', description: 'Fatigue may make study harder. Try a new method or rest enough.', advice: 'Split material into small chunks and ask a friend or teacher when stuck.' }
    }
  ],
  life: [
    {
      level: 'high',
      th: { headline: 'ภาพรวมชีวิตสว่างไสว', description: 'หลายเรื่องเริ่มลงตัว พลังงานโดยรวมดี เหมาะกับการเริ่มต้นสิ่งที่เลื่อนมานาน', advice: 'ลงมือทำสิ่งที่ผัดไว้ทีละอย่าง และขอบคุณคนที่ช่วยเหลือคุณ' },
      en: { headline: 'A bright overall picture', description: 'Many things are falling into place and energy is good, ideal for starting what you postponed.', advice: 'Do one postponed thing at a time and thank those who helped you.' }
    },
    {
      level: 'medium',
      th: { headline: 'ชีวิตดำเนินไปอย่างสมดุล', description: 'ไม่มีเรื่องใหญ่ที่น่ากังวล แต่ควรดูแลสุขภาพและการพักผ่อนให้สม่ำเสมอ', advice: 'จัดเวลาออกกำลังกายและนอนให้พอ เพื่อรักษาพลังงาน' },
      en: { headline: 'Life moves in balance', description: 'Nothing major to worry about, but keep up with health and rest.', advice: 'Schedule exercise and enough sleep to protect your energy.' }
    },
    {
      level: 'low',
      th: { headline: 'ค่อยๆ ดูแลตัวเอง', description: 'อาจรู้สึกล้าหรือกดดันจากหลายเรื่อง ลำดับความสำคัญใหม่จะช่วยให้เบาลง', advice: 'เลือกทำเพียงสามเรื่องสำคัญที่สุดในแต่ละวัน แล้วพักให้เต็มที่' },
      en: { headline: 'Take gentle care of yourself', description: 'You may feel tired or pressured by several things. Re-ordering priorities will lighten it.', advice: 'Pick only the three most important things each day and rest fully.' }
    }
  ]
};

/**
 * Picks one of the 3 local readings of a category. The pick depends only on the
 * birth date and the category, so the same input always gives the same reading.
 * @param {string} category - One of the five categories.
 * @param {string} birthDate - Birth date as YYYY-MM-DD.
 * @param {'th'|'en'} [lang='en'] - Language of the text.
 * @returns {{level: string, headline: string, description: string, details: Array, advice: string, source: string}}
 */
function getLocalReading(category, birthDate, lang = 'en') {
  const readings = READINGS[category];
  if (!readings) {
    throw new RangeError(`Unknown category: ${category}`);
  }
  const language = lang === 'th' ? 'th' : 'en';
  const reading = readings[hashText(`${birthDate}:${category}`) % readings.length];
  const text = reading[language];
  return {
    level: reading.level,
    headline: text.headline,
    description: text.description,
    details: buildDetails(category, reading.level, language),
    advice: text.advice,
    source: 'local'
  };
}

module.exports = { READINGS, getLocalReading };
