import { App } from "../../../core/app";

const HOME_PREFIX = "/";
const PUBLIC_PREFIX = "/public";

export class PublicController {
  constructor(app: App) {
    this.registerRoutes(app);
  }

  registerRoutes(app: App) {
    app.router.get(`${PUBLIC_PREFIX}/*`, async (request) => {
      const url = new URL(request.url);
      const path = url.pathname.substring(1);
      return new Response(Bun.file(path));
    });

    app.router.get(HOME_PREFIX, async () => {
      return new Response(Bun.file("public/me/index.html"));
    });
  }
}
