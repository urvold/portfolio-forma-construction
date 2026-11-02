# FORMA опубликован

- Сайт: https://urvold.github.io/portfolio-forma-construction/
- Репозиторий: https://github.com/urvold/portfolio-forma-construction
- Подтверждённое развёртывание: https://github.com/urvold/portfolio-forma-construction/actions/runs/41436624675 — success.
- Владелец включил GitHub Pages с источником workflow; API подтверждает https_enforced: true.
- Основная ветка: main. При каждом push workflow выполняет npm ci, npm test, npm run build и deploy-pages.
- Vite base: /portfolio-forma-construction/. HashRouter сохраняет вложенные маршруты на GitHub Pages.
- HTTPS-страница отвечает 200. Проверены 22 ресурса: все WebP, локальные и используемые сборкой WOFF2, CSS и JavaScript; коды 200, непустые ответы, корректные сигнатуры изображений и шрифтов.
- Chromium проверил публичный сайт: 20 маршрутов × 7 ширин, фильтры и пустое состояние, конфигуратор и сброс, этажи и комнаты, SVG с клавиатуры, мобильное меню, сенсорное управление, демоформу. Переполнения, ошибки JavaScript и HTTP-ошибки ресурсов не обнаружены. Axe: ноль нарушений на пяти ключевых страницах.
- Реальные iPhone/Safari не тестировались; сенсорная проверка выполнена Chromium.
- Другие репозитории не изменялись. Секреты, ключи и служебные файлы окружения не добавлялись. Используется автоматический GITHUB_TOKEN.

Отчёты: public-assets.json и browser.json. Первоначальные ограничения прав GitHub были разрешены владельцем через создание репозитория и включение Pages.
