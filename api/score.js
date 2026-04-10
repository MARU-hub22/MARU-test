// MARU Test scoring — server-side
// Векторы: Ан / Кж / Зр / Ор / Зв
// Алгоритм: нормализация 1/n, приоритет Кж→Ан→Зр→Ор→Зв, A2 (Зв→1), A3 (Ор≠1)

import data from './_data/maru_data.json' with { type: 'json' };

const VECTORS = ['Ан', 'Кж', 'Зр', 'Ор', 'Зв'];
const TIE_PRIORITY = ['Кж', 'Ан', 'Зр', 'Ор', 'Зв'];

// legacy mapping для совместимости screen4-9 (старые ключи Ф/ЗН/СМ/Э/ЗВ)
const NEW_TO_OLD = { 'Ан': 'ЗН', 'Кж': 'Ф', 'Зр': 'Э', 'Ор': 'ЗВ', 'Зв': 'СМ' };

function score(answers) {
  const total = data.questions.length;
  if (!Array.isArray(answers) || answers.length !== total) {
    throw new Error(`Expected ${total} answers, got ${answers?.length}`);
  }

  // 1. Counts с нормализацией: каждый вопрос = 1 единица, делится поровну
  const energies = { 'Ан': 0, 'Кж': 0, 'Зр': 0, 'Ор': 0, 'Зв': 0 };
  for (let i = 0; i < total; i++) {
    const sel = answers[i];
    if (!Array.isArray(sel) || sel.length === 0) continue;
    if (sel.length > 2) throw new Error(`Q${i + 1}: max 2 selections`);
    const weight = 1 / sel.length;
    for (const ansIdx of sel) {
      if (ansIdx < 0 || ansIdx >= 5) throw new Error(`Q${i + 1}: bad answer index ${ansIdx}`);
      const energy = data.questions[i].answers[ansIdx].energy;
      if (energies[energy] === undefined) throw new Error(`Q${i + 1}: unknown energy ${energy}`);
      energies[energy] += weight;
    }
  }

  // 2. Сортировка с tie-break
  const sorted = VECTORS.slice().sort((a, b) => {
    if (energies[b] !== energies[a]) return energies[b] - energies[a];
    return TIE_PRIORITY.indexOf(a) - TIE_PRIORITY.indexOf(b);
  });

  // 3. top3
  let top3 = sorted.slice(0, 3);

  // 4. A2 — Звуковой при наличии в top3 → 1-я позиция
  if (top3.includes('Зв')) {
    top3 = ['Зв', ...top3.filter(x => x !== 'Зв')];
  }

  // 5. A3 — Оральный никогда не на 1-й
  if (top3[0] === 'Ор') {
    [top3[0], top3[1]] = [top3[1], top3[0]];
  }

  const combination = top3.join('-');
  const archetypeName = data.archetypes_map[combination] || 'Неизвестный';

  // Проценты
  const scores = {};
  for (const v of VECTORS) {
    scores[v] = Math.round((energies[v] / total) * 100 * 10) / 10;
  }

  // Legacy формат для screen4-9
  const scoresLegacy = {};
  for (const v in scores) scoresLegacy[NEW_TO_OLD[v]] = scores[v];
  const top3Legacy = top3.map(v => NEW_TO_OLD[v]);

  return {
    archetypeName,
    combination,
    combinationLegacy: top3Legacy.join('-'),
    top3New: top3,
    top3: top3Legacy,
    scoresNew: scores,
    scores: scoresLegacy,
    energies
  };
}

function validity(answers, timestamps) {
  let fastAnswers = 0;
  if (Array.isArray(timestamps)) {
    for (let i = 0; i < timestamps.length - 1; i++) {
      if (timestamps[i + 1] - timestamps[i] < 2000) fastAnswers++;
    }
  }
  if (fastAnswers > 10) return 'low';
  if (fastAnswers > 5) return 'medium';
  return 'high';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { answers, timestamps } = body || {};

    if (!answers) return res.status(400).json({ error: 'Missing answers array' });

    const result = score(answers);
    result.validity = validity(answers, timestamps);
    result.completedAt = new Date().toISOString();
    result.gender = 'F';
    result.totalQuestions = data.questions.length;

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
