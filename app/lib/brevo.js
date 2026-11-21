export const BREVO_FORM_ACTION =
  "https://565bfdea.sibforms.com/serve/MUIFAAB36kzCUiK0yaR9DhyrF_tIatXJ6fa5LcNHW9qmdhxPu_mSgDanQ2URRSOSfr9ALJsjqKT7FgWJUPdqQFfwawU6GoBLC5AIaeP-zmOn3QLc2ytRzDefO6TJ7Lx8Jg0lYjwAqOE3spkmIvx1E5NYPfWAB-9T2cpCAbaC52atks4Ffl6jfAjuxusr3rw0nl1cW2b244Vohxnh-w==";

export function buildBrevoPayload(formData) {
  const params = new URLSearchParams();
  const countryCode = (formData.get("SMS__COUNTRY_CODE") || "")
    .toString()
    .replace(/^\+/, "")
    .trim();
  const rawSms = (formData.get("SMS") || "")
    .toString()
    .replace(/^0+/, "")
    .replace(/\D/g, "");

  for (const [key, value] of formData.entries()) {
    if (key === "SMS__COUNTRY_CODE") continue;
    if (key === "SMS") {
      params.append("SMS", rawSms ? `${countryCode}${rawSms}` : "");
    } else {
      params.append(key, value.toString());
    }
  }

  if (!params.has("locale")) {
    params.append("locale", "en");
  }

  return params;
}

export async function submitToBrevo(formElement) {
  const formData = new FormData(formElement);
  const payload = buildBrevoPayload(formData);

  await fetch(BREVO_FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  return Object.fromEntries(payload.entries());
}