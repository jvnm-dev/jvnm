import { App } from "../app";
import { ShortenedUrlService } from "../../../application/services/ShortenedUrlService";

enum RequestError {
  NO_URL_PROVIDED = "NO_URL_PROVIDED",
}

const URL_SHORTENER_PREFIX = "/u";

export class ShortenedUrlController {
  private service: ShortenedUrlService;

  constructor(app: App) {
    this.service = new ShortenedUrlService();
    this.registerRoutes(app);
  }

  registerRoutes(app: App) {
    app.router.get(`${URL_SHORTENER_PREFIX}/*`, this.redirect.bind(this));
    app.router.post(URL_SHORTENER_PREFIX, this.shortenUrl.bind(this));
    console.log("[ShortenedUrlController]: routes registered");
  }

  async redirect(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.substring(3);

    const shortenedUrl = await this.service.getShortenedUrl(path);

    if (!shortenedUrl) {
      return new Response("Not found", { status: 404 });
    }

    return Response.redirect(shortenedUrl.longUrl, 301);
  }

  async shortenUrl(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const longUrl = url.searchParams.get("longUrl");

    if (!longUrl) {
      return new Response(RequestError.NO_URL_PROVIDED, { status: 400 });
    }

    const shortenedUrl = await this.service.insertShortenedUrl(longUrl);

    console.log(
      `[${new Date().toISOString()}]: ${shortenedUrl.longUrl} -> ${
        shortenedUrl.shortUrl
      }`,
    );

    const fullUrl = `${url.protocol}//${url.host}/u/${shortenedUrl.shortUrl}`;

    return new Response(fullUrl, { status: 200 });
  }
}
