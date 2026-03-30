import { createHmac } from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN;

function verifyInitData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  const checkString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const expectedHash = createHmac('sha256', secretKey).update(checkString).digest('hex');

  return expectedHash === hash;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { initData } = req.body;
    if (!initData) return res.status(400).json({ error: 'no initData' });

    if (!verifyInitData(initData)) return res.status(403).json({ error: 'invalid' });

    const params = new URLSearchParams(initData);
    const user = JSON.parse(params.get('user'));
    const userId = user.id;

    // Получаем фото пользователя
    const photosRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`
    );
    const photosData = await photosRes.json();

    if (!photosData.ok || photosData.result.total_count === 0) {
      return res.status(200).json({ photo_url: null, first_name: user.first_name });
    }

    const fileId = photosData.result.photos[0][1].file_id; // medium size

    const fileRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileData = await fileRes.json();
    const filePath = fileData.result.file_path;
    const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    return res.status(200).json({ photo_url: photoUrl, first_name: user.first_name });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
