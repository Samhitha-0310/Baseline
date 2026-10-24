# Baseline Corp

Public marketing site for Baseline Corp, a growth and marketing agency.

The line is simple: build the baseline, then raise the standard. The site introduces the firm, the work, the framework, and a way to start a conversation.

## Run locally

```bash
npm install
npm run dev
```

The dev server runs at [http://127.0.0.1:4317](http://127.0.0.1:4317).

```bash
npm run build
npm run lint
npm run preview
```

## Contact form and API

`npm run dev` starts the site and the API together. The form posts to `POST /api/inquiries`.

Every accepted inquiry is stored in SQLite (`data/inquiries.sqlite`) and emailed to `baselinecorp1@gmail.com`.

The browser submits each inquiry with FormSubmit's AJAX endpoint, so the visitor stays on the contact section. The form shows "Inquiry received." only when that response, or SMTP, confirms acceptance. Each message lists Name, Email, Phone, Company, and Message in FormSubmit's table layout. FormSubmit does not apply the site colours or logo. Those appear in the branded HTML email when SMTP is configured.

FormSubmit does not accept a custom HTML template. Its notification stays in FormSubmit's own layout. The branded black-and-gold message is sent only when SMTP is configured. Copy `.env.example` to `.env` and set a Gmail app password:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=baselinecorp1@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Baseline Corp <baselinecorp1@gmail.com>"
CONTACT_TO=baselinecorp1@gmail.com
ADMIN_TOKEN=choose-a-long-random-string
```

With SMTP set, the server sends `shared/email/inquiryTemplate.ts` as HTML plus plain text to `baselinecorp1@gmail.com`, and the page does not also send through FormSubmit. On Vercel, set the same `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `CONTACT_TO` variables in the project settings. Gmail must use an app password, and the from address must be allowed to send. Until those values exist, FormSubmit remains the live delivery path and the inbox notification stays in FormSubmit's own layout.

Decorative gold icons and the hero wave are served from `/email/` on the site. The message HTML points at `https://baseline-corp.vercel.app/email/`. Those images appear after this version is deployed. The inquiry text does not depend on them. No DNS change is required for the template itself. A custom sending domain is optional and is not configured.

The dedicated preview is [http://127.0.0.1:4317/email-preview](http://127.0.0.1:4317/email-preview). `?view=message&width=600` shows the email-client HTML. `?fixture=long`, `?fixture=missing`, and `?fixture=markup` exercise long copy, empty fields, and escaping.

If neither path accepts the message, the form shows an error and the visitor can try again. It does not claim the message was submitted.

```bash
curl http://127.0.0.1:4318/api/health
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://127.0.0.1:4318/api/inquiries
```

`npm run build && npm start` serves the built site and the API on port 4317.

## Stack

React, TypeScript, Vite, and Tailwind CSS on the site. The API is Hono on Node, with SQLite storage. Inquiries are emailed through FormSubmit from the browser, or through Nodemailer when SMTP is configured. Inter is loaded as the web fallback in a system font stack that prefers SF Pro where it is already installed.
