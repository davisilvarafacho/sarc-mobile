export function whatsappMask(phone: string) {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

export function realMask(amount: number): string {
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function dateMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const masked = digits.replace(
    /^(\d{0,2})(\d{0,2})(\d{0,4})$/,
    (match, day, month, year) => {
      return [day, month, year].filter(Boolean).join("/");
    }
  );
  return masked.slice(0, 10);
}

export function timeMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  const masked = digits.replace(
    /^(\d{0,2})(\d{0,2})$/,
    (match, hours, minutes) => {
      return [hours, minutes].filter(Boolean).join(":");
    }
  );
  return masked.slice(0, 5);
}
