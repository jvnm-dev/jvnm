import { IShortenedUrlRepository } from "../../adapters/ports/repositories/ShortenedUrlRepository";
import { ShortenedUrlRepository } from "../../adapters/repositories/ShortenedUrlRepository";
import { ShortenedUrl } from "../../domain/entities/ShortenedUrl";

enum RequestError {
  NO_URL_PROVIDED = "NO_URL_PROVIDED",
}

export class ShortenedUrlService {
  protected repository: IShortenedUrlRepository;

  constructor() {
    this.repository = new ShortenedUrlRepository();
  }

  async redirect(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const shortUrl = url.pathname.substring(3);

    const x = await this.repository.getAllShortenedUrls();
    console.log(x)
    const dbUrl = await this.repository.getShortenedUrl(shortUrl);
    
    if (!dbUrl) {
      return new Response("Not found", { status: 404 });
    }

    return Response.redirect(dbUrl.longUrl, 301);
  }

  async shortenUrl(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const longUrl = url.searchParams.get("longUrl");

    if (!longUrl) {
      return new Response(RequestError.NO_URL_PROVIDED, { status: 400 });
    }

    const dbUrls = await this.repository.getAllShortenedUrls();

    let shortUrl = crypto.randomUUID().substring(2, 5);
    while (dbUrls.find((url) => url.shortUrl === shortUrl)) {
      shortUrl = crypto.randomUUID().substring(2, 5);
    }

    console.log(
      `[${new Date().toISOString()}]: ${longUrl.toString()} -> ${shortUrl}`,
    );

    this.repository.insertShortenedUrl({
      longUrl,
      shortUrl,
    });

    const fullUrl = `${url.protocol}//${url.host}/u/${shortUrl}`;

    return new Response(fullUrl, { status: 200 });
  }
}
