import { v4 as uuidv4 } from "uuid";

export function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

export function getAnonId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("anon_id") || "";
  if (!isValidUUID(id)) {
    id = uuidv4();
    localStorage.setItem("anon_id", id);
  }
  return id;
}
