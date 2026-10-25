/** Minimal Node/Vercel (req, res) shape. Avoids adding @vercel/node. */
export type NodeReq = {
  method?: string;
  body?: unknown;
};

export type NodeRes = {
  status: (code: number) => NodeRes;
  json: (body: unknown) => void;
};

export async function writeResponse(res: NodeRes, response: Response) {
  const text = await response.text();
  let payload: unknown = text;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { ok: false, error: text };
    }
  }
  res.status(response.status).json(payload);
}

export function readJsonBody(req: NodeReq) {
  if (typeof req.body === "string") return req.body;
  if (req.body == null) return "";
  if (typeof req.body === "object") return JSON.stringify(req.body);
  return String(req.body);
}
