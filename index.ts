import { createApp } from './core/app';

const app = createApp();

app.router.get('/', async () => {
    return new Response('Hello world!');
});

app.router.get('/dog', async () => {
    return new Response('Woof!');
});

app.router.get('/cat', async () => {
    return new Response('Meow!');
});

const server = app.listen(8080);

console.log(`Server listening on port ${server.port}`);