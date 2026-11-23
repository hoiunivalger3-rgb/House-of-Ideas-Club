import { promises as dns } from "dns";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISPOSABLE = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com",
  "tempmail.com", "yopmail.com", "trashmail.com", "sharklasers.com",
]);

export async function POST(req) {
  try {
    const { email } = await req.json();
    const value = String(email || "").trim().toLowerCase();

    if (!EMAIL_RE.test(value)) {
      return Response.json({ valid: false, reason: "Please enter a valid email address." });
    }

    const domain = value.split("@")[1];
    if (DISPOSABLE.has(domain)) {
      return Response.json({ valid: false, reason: "Temporary email addresses are not allowed." });
    }

    try {
      const mx = await dns.resolveMx(domain);
      if (!mx || mx.length === 0) throw Object.assign(new Error("no mx"), { code: "ENODATA" });
    } catch (err) {
      if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
        return Response.json({
          valid: false,
          reason: "This email domain can't receive emails. Please check for typos.",
        });
      }
      // DNS timeout or other server problem: don't block the registration
    }

    return Response.json({ valid: true });
  } catch {
    return Response.json({ valid: true }); // fail open if the check itself breaks
  }
}