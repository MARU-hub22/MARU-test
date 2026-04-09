import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const CDN = 'https://cdn.jsdelivr.net/gh/MARU-hub22/MARU-test@main/photos/';
const LOGO = 'https://cdn.jsdelivr.net/gh/MARU-hub22/MARU-test@main/logo-card.png';

const QUOTES = {
  'Конвертер':'Переводит чувства в действия.\nЕсли он что-то починил —\nэто было «я люблю тебя».',
  'Методолог':'У него есть система на всё.\nДаже на то, как скучать по тебе.',
  'Теоретик':'Он знает ответ на любой вопрос.\nКроме одного —\nчто он к тебе чувствует.',
  'Режиссер':'Молчит — не потому что злится.\nА потому что строит план,\nв котором ты уже есть.',
  'Транслятор':'Говорит одно — имеет в виду другое.\nНе потому что врёт.\nА потому что боится точности.',
  'Генератор':'Идеи каждую секунду.\nНо рядом с тобой он замирает.\nЭто и есть его признание.',
  'Полемик':'Спорит — не потому что не согласен.\nА потому что хочет, чтобы ты\nзащитила свою позицию.',
  'Аналитик':'Разложил тебя на части.\nИ впервые не смог собрать обратно.\nТеперь это называется — чувства.',
  'Оракул':'Знает, что будет дальше.\nКроме вас двоих.\nИ это его держит.',
  'Созерцатель':'Смотрит на мир как на фильм.\nНо рядом с тобой\nвпервые хочет быть в кадре.',
  'Концептуалист':'Живёт в мире идей.\nТы — первая идея,\nкоторую он хочет потрогать.',
  'Интерпретатор':'Видит смыслы в каждом жесте.\nТвоё молчание для него —\nцелая книга.',
  'Идеолог':'Построил свой мир на правилах.\nА ты вошла и всё перепутала.\nИ он просто смотрит.',
  'Дизайнер':'Видит красоту в системе.\nТы — единственное, что он\nне может упорядочить.',
  'Инструктор':'Знает, как надо.\nНо рядом с тобой\nвпервые не уверен.',
  'Педагог':'Учит весь мир.\nНо рядом с тобой —\nсам становится учеником.',
  'Лидер':'Ведёт за собой всех.\nНо за тобой —\nпошёл бы сам.',
  'Ментор':'Даёт советы всем.\nНо о тебе —\nдумает молча.',
  'Продавец':'Убеждает весь мир.\nНо тебя —\nпросто слушает.',
  'Герой':'Спасает всех.\nНо от тебя —\nне хочет спасаться.',
  'Командир':'Контролирует всё.\nНо рядом с тобой —\nотпускает.',
  'Философ':'Ищет смысл во всём.\nТы — единственный ответ,\nкоторый он не ставит под вопрос.',
  'Историк':'Помнит всё.\nНо момент, когда встретил тебя —\nпомнит по секундам.',
  'Наставник':'Показывает путь другим.\nНо свой путь —\nвидит только рядом с тобой.',
  'Инженер':'Чинит всё вокруг.\nНо то, что ты делаешь с ним —\nне подлежит ремонту.',
  'Декоратор':'Создаёт красоту.\nНо рядом с тобой —\nзабывает создавать.',
  'Законодатель':'Пишет правила для всех.\nДля тебя —\nготов нарушить свои.',
  'Продюсер':'Запускает проекты.\nНо ты — единственный проект,\nгде он не контролирует финал.',
  'Драматург':'Пишет сценарии.\nНо ваш —\nдописывает каждый день.',
  'Агент':'Договаривается со всеми.\nНо с тобой —\nне может договориться с собой.'
};

export default async function handler(req) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'rezhisser';
  const name = url.searchParams.get('name') || 'Режиссер';
  const type = url.searchParams.get('type') || 'friend'; // friend | story
  const quote = url.searchParams.get('quote') || QUOTES[name] || '';

  const w = type === 'story' ? 1080 : 600;
  const h = type === 'story' ? 1920 : 600;
  const photoUrl = CDN + slug + '.jpg';

  if (type === 'story') {
    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', position: 'relative', fontFamily: 'Inter, sans-serif',
            background: '#111',
          },
          children: [
            { type: 'img', props: { src: photoUrl, style: {
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'brightness(0.4) saturate(0.85)',
            }}},
            { type: 'div', props: { style: {
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 100%)',
            }}},
            { type: 'div', props: { style: {
              position: 'relative', padding: '60px 48px 80px', display: 'flex', flexDirection: 'column',
            }, children: [
              { type: 'div', props: { style: {
                fontSize: 42, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase', marginBottom: 24,
              }, children: 'MARU' }},
              { type: 'div', props: { style: {
                fontSize: 56, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 20,
              }, children: name }},
              { type: 'div', props: { style: {
                width: 60, height: 2, background: 'rgba(255,255,255,0.2)', marginBottom: 24,
              }}},
              { type: 'div', props: { style: {
                fontSize: 32, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6,
              }, children: quote.replace(/\n/g, ' ') }},
            ]}},
          ],
        },
      },
      { width: w, height: h }
    );
  }

  // type === 'friend' — светлая карточка
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#E8637A', fontFamily: 'Inter, sans-serif',
          padding: '40px',
        },
        children: [
          { type: 'div', props: { style: {
            fontSize: 32, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.85)', marginBottom: 20,
          }, children: 'MARU' }},
          { type: 'img', props: { src: photoUrl, style: {
            width: 160, height: 160, borderRadius: '50%', objectFit: 'cover',
            border: '3px solid rgba(255,255,255,0.3)',
          }}},
          { type: 'div', props: { style: {
            fontSize: 36, fontWeight: 700, color: '#fff', marginTop: 16, letterSpacing: '-0.01em',
          }, children: name }},
          { type: 'div', props: { style: {
            fontSize: 20, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: 12,
            textAlign: 'center', padding: '0 20px',
          }, children: quote.replace(/\n/g, ' ') }},
        ],
      },
    },
    { width: w, height: h }
  );
}
