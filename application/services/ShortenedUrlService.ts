import { IShortenedUrlRepository } from "../../adapters/ports/repositories/ShortenedUrlRepository";
import { ShortenedUrlRepository } from "../../adapters/repositories/ShortenedUrlRepository";
import { ShortenedUrl } from "../../domain/entities/ShortenedUrl";

export class ShortenedUrlService {
  protected repository: IShortenedUrlRepository;

  constructor() {
    this.repository = new ShortenedUrlRepository();
  }

  async getShortenedUrl(shortUrl: string): Promise<ShortenedUrl | undefined> {
    try {
      return this.repository.getShortenedUrl(shortUrl);
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error while getting shortened url", e.message);
      }

      return undefined;
    }
  }

  async insertShortenedUrl(longUrl: string): Promise<ShortenedUrl> {
    try {
      const dbUrls = await this.repository.getAllShortenedUrls();

      let shortUrl = crypto.randomUUID().substring(2, 5);
      while (dbUrls.find((url) => url.shortUrl === shortUrl)) {
        shortUrl = crypto.randomUUID().substring(2, 5);
      }

      const shortenedUrl = {
        longUrl,
        shortUrl,
      };

      await this.repository.insertShortenedUrl(shortenedUrl);

      return shortenedUrl;
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error while inserting shortened url", e.message);
      }

      throw e;
    }
  }
}
