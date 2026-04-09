export const config = { runtime: 'edge' };

const SLUG_TO_NAME = {
  konverter:'Конвертер',metodolog:'Методолог',teoretik:'Теоретик',rezhisser:'Режиссер',
  translyator:'Транслятор',generator:'Генератор',polemik:'Полемик',analitik:'Аналитик',
  orakul:'Оракул',sozertatel:'Созерцатель',kontseptualist:'Концептуалист',interpretator:'Интерпретатор',
  ideolog:'Идеолог',dizayner:'Дизайнер',instruktor:'Инструктор',pedagog:'Педагог',
  lider:'Лидер',mentor:'Ментор',prodavets:'Продавец',geroy:'Герой',komandir:'Командир',
  filosof:'Философ',istorik:'Историк',nastavnik:'Наставник',inzhener:'Инженер',
  dekorator:'Декоратор',zakonodatel:'Законодатель',produser:'Продюсер',dramaturg:'Драматург',agent:'Агент'
};

export default async function handler(req) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'rezhisser';
  const name = url.searchParams.get('name') || SLUG_TO_NAME[slug] || 'Режиссер';
  const rid = url.searchParams.get('rid') || '';

  const base = url.origin;
  // cache-buster: Telegram/WhatsApp hard-cache OG images by URL.
  // Bump version whenever card template changes so preview refreshes.
  const CARD_VERSION = 'v11';
  const cardImg = `${base}/api/card?slug=${encodeURIComponent(slug)}&name=${encodeURIComponent(name)}&type=friend&${CARD_VERSION}`;
  const botLink = 'https://t.me/maru_22_bot/maru' + (rid ? '?startapp=' + rid : '');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta property="og:title" content="${name} — MARU">
<meta property="og:description" content="Я прошла тест про мужчин — и наконец поняла, почему он так себя ведёт. Попробуй тоже">
<meta property="og:image" content="${cardImg}">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="1080">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${cardImg}">
</head>
<body>
<p style="font-family:sans-serif;text-align:center;margin-top:40px">Переходим в MARU...</p>
<script>setTimeout(function(){window.location.href="${botLink}";},100);</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
