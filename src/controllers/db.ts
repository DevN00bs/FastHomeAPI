export function createInsertQuery(table: string, object: object): string {
  const columns = Object.keys(object);

  return `INSERT INTO ${table} (${columns}) VALUES (${columns.map(() => "?")})`;
}
