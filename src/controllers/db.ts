import { PropertyFilters, filters } from "../entities/properties";

export function createInsertQuery(table: string, object: object): string {
  const columns = Object.keys(object);

  return `INSERT INTO ${table} (${columns}) VALUES (${columns.map(() => "?")})`;
}

export function createUpdateQuery(table: string, object: object): string {
  return `UPDATE ${table} SET ${Object.keys(object).map(
    (obj) => `${obj} = ?`
  )}`;
}

export function createFilterQuery(request: PropertyFilters): string {
  const requestKeys = Object.keys(request);

  if (requestKeys.length === 0) {
    return "";
  }

  const availableFilters = Object.keys(filters);
  const definedFilters = requestKeys.filter((key) =>
    availableFilters.includes(key)
  );
  const parsedFilters = [
    ...definedFilters.map(
      (filter) =>
        filters[filter as "bedrooms" | "bathrooms" | "garage" | "floors"][
          request[filter as keyof PropertyFilters]
        ]
    ),
  ];

  if (request.currency) {
    parsedFilters.push(`\`ignoreMe\` = ${request.currency}`);
  }

  if (request.userId) {
    parsedFilters.push(`\`ignoreMeToo\` = ${request.userId}`);
  }

  return `WHERE ${parsedFilters.join(" AND ")}`;
}
