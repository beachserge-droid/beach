import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store data in a JSON file inside the project (not in public)
const DATA_FILE = path.join(process.cwd(), 'data', 'reservations.json');

function readDB(): Record<string, unknown>[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeDB(data: Record<string, unknown>[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/reservations — list all
export async function GET() {
  const data = readDB();
  return NextResponse.json(data);
}

// POST /api/reservations — create or update (upsert by id)
export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;
  const list = readDB();
  const idx = list.findIndex((r) => r.id === body.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...body };
  } else {
    list.push(body);
  }
  writeDB(list);
  return NextResponse.json({ ok: true });
}

// PATCH /api/reservations — partial update (for admin actions)
export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json() as Record<string, unknown>;
  const list = readDB();
  const idx = list.findIndex((r) => r.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates };
    writeDB(list);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
}

// DELETE /api/reservations?id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const list = readDB();
  if (id) {
    writeDB(list.filter((r) => r.id !== id));
  } else {
    writeDB([]);
  }
  return NextResponse.json({ ok: true });
}
