# SiteCare Security Steering

User-supplied URLs are untrusted input.

SSRF protections must:
- Reject private, loopback, link-local, multicast, reserved IPv4 and IPv6 destinations.
- Resolve and inspect DNS results.
- Constrain the actual network connection to validated destinations.
- Defend against DNS rebinding.
- Revalidate every redirect destination.
- Bound redirect count, timeouts, and response size.
- Avoid forwarding cookies, credentials, and authorization headers.
- Avoid disclosing private IPs in public responses.

Authentication:
- Verify ownership on every resource operation.
- Use secure sessions and cookies.
- Rate-limit sensitive endpoints.
- Never log secrets.

Billing:
- Resolve plan and price server-side.
- Verify webhook signatures.
- Process webhook event IDs idempotently.
- Never activate subscriptions based only on browser redirects.

Reports:
- Use cryptographically random tokens.
- Store token hashes, not plaintext tokens.
- Support expiry and revocation.
- Expose only explicitly approved report data.
