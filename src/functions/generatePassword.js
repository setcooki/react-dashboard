export function generatePassword() {
  let length = 8,
    charset = "$%&?@#abcdefghijklmnopqrstuvwxyz$%&?@#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&?@#",
    value = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    value += charset.charAt(Math.floor(Math.random() * n));
  }
  return value;
}
