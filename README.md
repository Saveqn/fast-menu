# School Menu (pt-PT)

Simple website that displays the weekly school canteen menu, with a password-protected admin panel.

Site language: **European Portuguese (pt-PT)**.

## How it works

### Visitor
- Opens the site and sees the menu for the current week (Monday to Friday).
- If no menu exists for the current week, the latest available menu is shown with a visible warning: *"Esta ementa não foi atualizada esta semana"* (This menu has not been updated this week).
- Can browse the archive of the last 10 weeks.

### Administrator
- Accesses `/admin` by typing the address manually (no link on the public site).
- Logs in with a password stored as a **bcrypt hash** in the `ADMIN_PASSWORD_HASH` environment variable.
- Can upload a photo of the menu board: AI (Google Gemini) generates a JSON, a preview is shown, and after confirmation it is applied for everyone.
- Can also upload a `.json` file directly.

## Tech stack

- Next.js 14 (App Router)
- React + Tailwind CSS
- Google Gemini 1.5 Flash (AI to extract JSON from photos)
- Vercel Blob (JSON file storage)
- bcryptjs + JWT (encrypted admin session)

## Environment variables

Copy `.env.example` to `.env.local` and fill in the real values:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (Google AI Studio) |
| `ADMIN_SESSION_SECRET` | Secret to sign admin session cookies (`openssl rand -base64 32`) |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of the admin password |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (configured automatically on Vercel) |

**Never commit `.env.local` or real secret values to GitHub.** The hash must live only in Vercel Environment Variables and your local `.env.local` (gitignored).

### Generating the admin password hash

```bash
node scripts/hash-password.js "your-secret-password"
```

Copy the printed hash into `ADMIN_PASSWORD_HASH`.

## Installation and development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Admin panel is at `/admin/login`.

## Deploy on Vercel

1. Connect the GitHub repository to Vercel.
2. Add the environment variables above in the project settings.
3. Vercel detects Next.js and deploys automatically.

## JSON menu structure

```json
{
  "weekStart": "2026-10-19",
  "weekEnd": "2026-10-23",
  "days": [
    {
      "date": "2026-10-19",
      "weekday": "segunda-feira",
      "sopa": "Sopa de legumes",
      "prato": "Bacalhau com natas",
      "vegetariano": "Lasanha de legumes",
      "sobremesa": "Maçã",
      "pao": true
    },
    {
      "date": "2026-10-23",
      "weekday": "sexta-feira",
      "sopa": null,
      "prato": null,
      "vegetariano": null,
      "sobremesa": null,
      "pao": false,
      "closed": true,
      "reason": "feriado"
    }
  ]
}
```

Closed days use `"closed": true` with `"reason": "feriado"` or `"ferias"`.

## Security: password hash in a public repository

The file `scripts/hash-password.js` is **safe to keep in a public repository** because it contains no secrets — it is only a local helper to generate a bcrypt hash.

What must **never** be committed to GitHub:

- The actual `ADMIN_PASSWORD_HASH` value
- `.env.local` or any `.env.*.local` file
- Any real API keys or session secrets

The hash should exist only as a **Vercel Environment Variable** (and in your local `.env.local`). Even if an attacker obtained the hash, bcrypt (cost factor 10) is a slow, one-way hashing function designed to make brute-force attacks expensive, but the safest practice is to never expose it at all.

The AI prompt is fixed, written in English, and cannot be changed by the admin. The admin can only add an optional note, which is appended with a warning that it is secondary and the main prompt takes priority.
