// Generic, provider-agnostic form submission for a fully static site.
//
// Security note: an ESP's authenticated management API (e.g. MailerLite's
// REST API) requires a secret Bearer-token API key — that must never be sent
// from client-side JavaScript, since anyone could read it from the network
// tab and take over the account. The safe, standard mechanism every ESP
// provides for exactly this static-site use case is a public FORM ACTION
// URL, generated from their "embed a form" / "HTML form" export feature —
// scoped to just that one form/list, safe to expose publicly. That's what
// this expects in PUBLIC_FORM_ENDPOINT.
//
// Until that env var is set, submissions fall back to a console.log stub so
// the forms stay fully testable with no configuration.

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

export async function submitForm(
  formType: string,
  data: Record<string, string>,
): Promise<{ ok: true }> {
  if (!ENDPOINT) {
    console.log(`Form submission (${formType}, stub — set PUBLIC_FORM_ENDPOINT to go live):`, data);
    return { ok: true };
  }

  // `no-cors` is required because the ESP's endpoint won't send back CORS
  // headers for a cross-origin browser POST. That also means the response
  // is opaque — we can't read a status code — so success here just means
  // the request was sent, matching how a plain HTML form embed would behave.
  await fetch(ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ formType, ...data }),
  });

  return { ok: true };
}
