import { Router, createRouter,  } from "./router";

export type App = {
    router: Router,
    listen: (port: number) => void,
}

export const createApp = () => {
    const router = createRouter();

    const fetch = (request: Request) => {
        const matchingRoute = router.match(request);
        
        if (matchingRoute) {
            return matchingRoute.handler(request);
        }

        return new Response('Route not found', { status: 404 });
    }

    const listen = (port: number) => Bun.serve({
        port,
        fetch,
    });

    return {
        router,
        listen,
    }
}