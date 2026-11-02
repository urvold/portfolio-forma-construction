# Статус публикации

- Репозиторий создан владельцем: https://github.com/urvold/portfolio-forma-construction .
- Исходный код и workflow загружены в main.
- Ожидаемый адрес: https://urvold.github.io/portfolio-forma-construction/ .
- Vite base, HashRouter, абсолютный OG image, canonical и исключение служебных файлов готовы.
- Production build и браузерные тесты под базовым путём проходят.
- Первоначальное включение Pages через API отклонено: GitHub HTTP 403 Resource not accessible by integration. Официальный configure-pages требует для включения отдельного токена с правами administration:write и pages:write; стандартного GITHUB_TOKEN недостаточно.
- Владелец должен выбрать Settings → Pages → Source → GitHub Actions. После этого можно повторить workflow и проверить публичный HTTPS.
- Публичный адрес пока не подтверждён.

Workflow использует предоставляемый GitHub GITHUB_TOKEN. Пользовательские ключи и секреты в проект не добавляются. Другие репозитории не изменяются.
