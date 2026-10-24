import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import type { InquiryInput } from "./validate.ts";

export type StoredInquiry = InquiryInput & {
  id: string;
  emailSent: boolean;
  emailError: string | null;
  createdAt: string;
};

const dbPath = path.resolve(process.env.DATABASE_PATH || "data/inquiries.sqlite");

const runtime = globalThis as typeof globalThis & { __baselineDb?: DatabaseSync };

function database() {
  if (runtime.__baselineDb) return runtime.__baselineDb;
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const opened = new DatabaseSync(dbPath);
  opened.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT NOT NULL,
      project_type TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      email_sent INTEGER NOT NULL DEFAULT 0,
      email_error TEXT,
      created_at TEXT NOT NULL
    )
  `);
  ensureColumn(opened, "project_type", "TEXT NOT NULL DEFAULT ''");
  runtime.__baselineDb = opened;
  return opened;
}

function ensureColumn(opened: DatabaseSync, name: string, definition: string) {
  const columns = opened.prepare("PRAGMA table_info(inquiries)").all() as Array<{ name: string }>;
  if (columns.some((column) => column.name === name)) return;
  opened.exec(`ALTER TABLE inquiries ADD COLUMN ${name} ${definition}`);
}

type Row = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  message: string;
  email_sent: number;
  email_error: string | null;
  created_at: string;
};

function mapRow(row: Row): StoredInquiry {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    projectType: row.project_type ?? "",
    message: row.message,
    emailSent: row.email_sent === 1,
    emailError: row.email_error,
    createdAt: row.created_at,
  };
}

export function saveInquiry(
  inquiry: InquiryInput,
  emailSent: boolean,
  emailError: string | null,
): StoredInquiry {
  const record: StoredInquiry = {
    ...inquiry,
    id: crypto.randomUUID(),
    emailSent,
    emailError,
    createdAt: new Date().toISOString(),
  };
  database()
    .prepare(`
      INSERT INTO inquiries (
        id, full_name, email, phone, company, project_type, message, email_sent, email_error, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
    record.id,
    record.fullName,
    record.email,
    record.phone,
    record.company,
    record.projectType,
    record.message,
    record.emailSent ? 1 : 0,
    record.emailError,
    record.createdAt,
  );
  return record;
}

export function listInquiries(limit = 100): StoredInquiry[] {
  const rows = database()
    .prepare(`
      SELECT id, full_name, email, phone, company, project_type, message, email_sent, email_error, created_at
      FROM inquiries
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .all(limit);
  return rows.map((row) => mapRow(row as Row));
}

export function databasePath() {
  return dbPath;
}
