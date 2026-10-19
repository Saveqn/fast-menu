/**
 * Gera um hash bcrypt para a palavra-passe do admin.
 * Uso: node scripts/hash-password.js "minha-senha-secreta"
 * O resultado deve ser colocado em ADMIN_PASSWORD_HASH no .env.local / Vercel.
 */
const { hash } = require("bcryptjs")

const password = process.argv[2]
if (!password) {
  console.error("Uso: node scripts/hash-password.js <senha>")
  process.exit(1)
}

hash(password, 10).then((hashed) => {
  console.log("ADMIN_PASSWORD_HASH=" + hashed)
})
