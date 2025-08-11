export type FieldKey =
  | "projects"
  | "technologies"
  | "duties"
  | "domains"
  | "certifications"
  | "management"
  | "other";

export const REQUIRED_FIELDS: FieldKey[] = [
  "projects",
  "technologies",
  "duties",
  "domains",
  "certifications",
  "management",
  "other",
];