export type SelectParams<T> = {
  table: string;
  columns: string[];
  where?: string;
  values?: Partial<T>;
  orderBy?: string;
  limit?: number;
  offset?: number;
};

export type InsertParams<T> = {
  table: string;
  values: Partial<T>;
};

export type PatchParams<T> = {
  table: string;
  values: Partial<T>;
  where: string;
};

export interface IRepository<T> {
  select: (params: SelectParams<T>) => Promise<T[]>;
  insert: (params: InsertParams<T>) => Promise<T[]>;
  patch: (params: PatchParams<T>) => Promise<T[]>;
}
