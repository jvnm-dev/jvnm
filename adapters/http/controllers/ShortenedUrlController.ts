import { App } from "../../../core/app";
import { ShortenedUrlService } from "../../../application/services/ShortenedUrlService";

const URL_SHORTENER_PREFIX = "/u";

export class ShortenedUrlController {
  private service: ShortenedUrlService;

  constructor(app: App) {
    this.service = new ShortenedUrlService();
    this.registerRoutes(app);
  }

  registerRoutes(app: App) {
    app.router.get(`${URL_SHORTENER_PREFIX}/*`, (request) => this.service.redirect(request));
    app.router.post(URL_SHORTENER_PREFIX, (request) => this.service.shortenUrl(request));
    console.log("[ShortenedUrlController]: routes registered");
  }
}
