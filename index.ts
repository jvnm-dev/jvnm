import { createApp } from './core/app';
import { initUrlShortenerPlugIn } from './url-shortener';

const app = createApp();

app.router.get('/public/*', async (request) => {
    const url = new URL(request.url);
    const path = url.pathname.substring(1);
    return new Response(Bun.file(path));
});

app.router.get('/', async () => {
    return new Response(Bun.file("public/me/index.html"));
});

initUrlShortenerPlugIn(app);

const server = app.listen(8080);

console.log(`Server listening on port ${server.port}`);