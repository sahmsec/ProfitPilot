// Reference: blueprint:javascript_log_in_with_replit for auth setup
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}
