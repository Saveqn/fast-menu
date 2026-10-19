/**
 * Кодирует пароль в base64 для сохранения в ADMIN_PASSWORD_HASH.
 * Упрощённый вариант без bcrypt — только base64.
 * Уso: node scripts/hash-password.js <senha>
 */
const password = process.argv[2]
if (!password) {
  console.error("Uso: node scripts/hash-password.js <senha>")
  process.exit(1)
}

const encoded = Buffer.from(password).toString("base64")
console.log("ADMIN_PASSWORD_HASH=" + encoded)
