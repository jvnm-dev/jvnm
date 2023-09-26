import { IRepository } from "./Repository";
import { ShortenedUrl } from "../../../domain/entities/ShortenedUrl";

export interface IShortenedUrlRepository extends IRepository<ShortenedUrl> {
  getAllShortenedUrls(): Promise<ShortenedUrl[]>;
  getShortenedUrl(shortUrl: string): Promise<ShortenedUrl | undefined>;
  insertShortenedUrl(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>;
}
