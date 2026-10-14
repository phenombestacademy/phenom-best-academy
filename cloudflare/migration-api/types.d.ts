interface D1Result<T = unknown> {
  success: boolean;
  meta: { changes: number; duration?: number; last_row_id?: number; rows_read?: number; rows_written?: number };
  results?: T[];
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface R2Object {
  size: number;
  checksums?: { sha256?: ArrayBuffer };
  customMetadata?: Record<string, string>;
}

interface R2Bucket {
  head(key: string): Promise<R2Object | null>;
}
