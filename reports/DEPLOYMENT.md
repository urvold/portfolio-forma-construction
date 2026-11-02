# Статус публикации

- Цель: `urvold/portfolio-forma-construction`, публичный репозиторий и бесплатный GitHub Pages.
- Ожидаемый адрес: `https://urvold.github.io/portfolio-forma-construction/`.
- Подтверждение пользователя получено.
- Vite base, HashRouter, абсолютный OG image, canonical, workflow и исключение служебных файлов готовы.
- Production build и браузерные тесты под базовым путём проходят.
- Создание репозитория заблокировано правами интеграции: GitHub HTTP 403 Resource not accessible by integration; GraphQL createRepository также отклонён.
- Удалённый репозиторий и публичный адрес не подтверждены. HTTPS-проверка невозможна до развёртывания.

После создания пустого публичного репозитория и предоставления интеграции доступа:

1. Отправить main в origin.
2. Включить GitHub Pages с источником GitHub Actions (`build_type: workflow`).
3. Дождаться успешного выполнения workflow Build and deploy FORMA to GitHub Pages.
4. Проверить публичный HTTPS URL и повторить браузерный сценарий с FORMA_TEST_URL, указывающим на опубликованный сайт.

Встроенный GITHUB_TOKEN workflow предоставляется GitHub автоматически; сторонние ключи и секреты не нужны.
