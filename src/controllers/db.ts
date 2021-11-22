export function createInsertQuery(table: string, object: object): string {
  let query = `INSERT INTO ${table} (`;

  const columns = Object.keys(object);
  const values = Object.values(object);

  columns.forEach((column, index) => {
    query += `\`${column}\``;

    if (index !== columns.length - 1) {
      query += ",";
    }
  });

  query += ") VALUES (";

  values.forEach((value, index) => {
    switch (typeof value) {
      case "number":
        query += value.toString();
        break;
      case "string":
        query += `'${value}'`;
        break;
      default:
        console.error(
          "Excuse me, this type is not implemented yet. " + typeof value
        );
    }

    if (index !== columns.length - 1) {
      query += ",";
    }
  });

  return query + ")";
}
