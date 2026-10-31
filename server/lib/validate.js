const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(body) {
  const b = body && typeof body === 'object' ? body : {};
  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const value = { name: str(b.name), email: str(b.email).toLowerCase(), message: str(b.message) };
  const errors = {};
  if (value.name.length < 2 || value.name.length > 80) errors.name = 'Name must be 2 to 80 characters.';
  if (!EMAIL.test(value.email) || value.email.length > 120) errors.email = 'Enter a valid email address.';
  if (value.message.length < 10 || value.message.length > 2000) errors.message = 'Message must be 10 to 2000 characters.';
  return { ok: Object.keys(errors).length === 0, errors, value };
}
