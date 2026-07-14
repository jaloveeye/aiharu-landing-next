export function matchesAuthenticatedEmail(
  authenticatedEmail: string | null | undefined,
  requestedEmail: string,
): boolean {
  return Boolean(authenticatedEmail && authenticatedEmail === requestedEmail);
}

export function ownsMealAnalysis(
  authenticatedEmail: string | null | undefined,
  requestedAnonId: string | null | undefined,
  record: { email?: string | null; anon_id?: string | null },
): boolean {
  if (record.email) return matchesAuthenticatedEmail(authenticatedEmail, record.email);
  return Boolean(requestedAnonId && record.anon_id === requestedAnonId);
}
