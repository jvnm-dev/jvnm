import Database, { SQLQueryBindings } from "bun:sqlite";

import {
  IRepository,
  InsertParams,
  PatchParams,
  SelectParams,
} from "../ports/repositories/Repository";

export class Repository<T> implements IRepository<T> {
  protected db: Database;

  constructor() {
    this.db = new Database("db.sqlite");
  }

  async select(params: SelectParams<T>): Promise<T[]> {
    const { table, columns, where, values, orderBy, limit, offset } = params;

    let query = `SELECT ${columns.join(",")} FROM ${table}`;

    if (where) {
      query += ` WHERE ${where}`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    return this.db
      .prepare<T, SQLQueryBindings[]>(query)
      .all(...Object.values(values ?? []));
  }

  async insert(params: InsertParams<T>): Promise<T[]> {
    const { table, values } = params;

    const query = `INSERT INTO ${table} VALUES (${Object.keys(values)
      .map(() => "?")
      .join(", ")}) RETURNING *`;

    return this.db
      .prepare<T, SQLQueryBindings[]>(query)
      .all(...(Object.values(values ?? []) as string[]));
  }

  async patch(params: PatchParams<T>): Promise<T[]> {
    const { table, values, where } = params;

    const query = `UPDATE ${table} SET ${Object.keys(values)
      .map((key) => `${key} = ?`)
      .join(", ")} WHERE ${where} RETURNING *`;

    return this.db
      .prepare<T, SQLQueryBindings[]>(query)
      .all(...(Object.values(values ?? []) as string[]));
  }
}
