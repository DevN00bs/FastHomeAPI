export function createInsertQuery(table: string, object: object): string {
  const columns = Object.keys(object);

  return `INSERT INTO ${table} (${columns}) VALUES (${columns.map(() => "?")})`;
}

export function createUpdateQuery(table: string, object: object): string {
  return `UPDATE ${table} SET ${Object.keys(object).map(
    (obj) => `${obj} = ?`
  )}`;
}
