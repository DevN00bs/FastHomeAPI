export function createInsertQuery(table: string, object: object): string {
  const parsedValues = Object.values(object).map((value) =>
    typeof value === "string" ? `'${value}'` : value.toString()
  );

  return `INSERT INTO ${table} (${Object.keys(
    object
  )}) VALUES (${parsedValues})`;
}
