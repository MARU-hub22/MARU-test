# MARU — Workflow

Шпаргалка как работать с проектом по-современному.

## Источник правды

**Только эта папка** — `MARU-test-repo`. Здесь живёт боевой код.
GitHub: `MARU-hub22/MARU-test` → автодеплой на Vercel: `https://maru-test.vercel.app`

`MARU готовые экраны` — **зеркальный бэкап**. Обновляется автоматически после каждого коммита (через git post-commit hook). Туда руками ничего писать не надо.

## Безопасные эксперименты — ветки

Любая правка которую не уверен что готова в прод — делай в ветке.

```bash
# создать ветку для эксперимента
git checkout -b experiment/имя-фичи

# править файлы, коммитить
git add screen3.html
git commit -m "exp: новая анимация overlay"

# первый раз пушим с -u
git push -u origin experiment/имя-фичи
```

После пуша Vercel **автоматически** создаёт preview URL вида:
`https://maru-test-git-experiment-имя-фичи-USERNAME.vercel.app`

Он виден в логе пуша или в Vercel dashboard. Тестируешь там, **боевой URL не трогается**.

### Если эксперимент удался — мерж в main

```bash
git checkout main
git merge experiment/имя-фичи
git push origin main
```

Теперь Vercel деплоит в боевой URL.

### Если эксперимент провалился — удалить ветку

```bash
git checkout main
git branch -D experiment/имя-фичи
git push origin --delete experiment/имя-фичи
```

Боевой код целый.

## Hot-fix (срочный фикс прямо в прод)

```bash
git checkout main
# правишь, коммитишь, пушишь
git push origin main
```

Через ~30 секунд боевой обновлён.

## Откат коммита

Если запушил что-то плохое в `main`:

```bash
git revert HEAD       # создаёт новый коммит, отменяющий последний
git push origin main
```

**Не используй** `git reset --hard` после push — это уничтожает историю.

## Автосинк в готовые экраны

После каждого `git commit` локальный хук автоматически копирует изменённые файлы в `MARU готовые экраны`. Если видишь в выводе строки вида `[mirror] → MARU готовые экраны` — значит сработало.

Если папка готовых экранов отсутствует — хук молча пропускает (ничего не ломает).

## Структура

```
MARU-test-repo/
├── api/              ← Vercel serverless functions (score, card, share, photo)
│   ├── _data/        ← приватные данные (НЕ публикуются)
│   └── *.js
├── screen1.html ... screen9.html
├── app.html, index.html, card-*.html
├── photos/, her_photos/
├── .git/hooks/       ← локальные хуки (post-commit, post-merge)
├── .editorconfig     ← стандарт отступов/EOL
├── .gitignore        ← мусорные файлы
├── vercel.json       ← конфиг Vercel
└── WORKFLOW.md       ← этот файл
```

## Что нельзя

- Править `MARU готовые экраны` руками — изменения перетрёт автосинк при следующем коммите
- Пушить в `main` сырой эксперимент — используй ветку
- `git push --force` в `main` — никогда без явной необходимости
- Коммитить `api/_data/maru_data.json` если поменял (он приватный, но в репо — да, проверь)
