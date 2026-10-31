// WhatsApp wants digits only, with country code and no "+" (e.g. 923496642547).
export function waLink(number, text = 'Hello Umar, I saw your portfolio and would like to talk.') {
  const digits = String(number).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function mailLink(email, subject = 'Job opportunity: from your portfolio', body = 'Hello Umar,\n\n') {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
