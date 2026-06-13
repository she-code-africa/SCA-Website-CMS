export function cleanName(value?: string) {
  return (value ?? "").trim();
}

export function getInitials(firstname?: string, lastname?: string) {
  const f = cleanName(firstname).charAt(0);
  const l = cleanName(lastname).charAt(0);
  const initials = `${f}${l}`.toUpperCase();
  return initials || "?";
}
