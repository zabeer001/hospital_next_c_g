import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders Doctor Tracker landing content and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Doctor Tracker/);
  assert.match(html, /Better care starts with a clearer picture/);
  assert.match(html, /Healthcare, clearly connected/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("renders the blog listing and a static article", async () => {
  const blog = await render("/blog");
  assert.equal(blog.status, 200);
  assert.match(await blog.text(), /Ideas for calmer, smarter care/);
  const article = await render("/blog/designing-for-clinical-clarity");
  assert.equal(article.status, 200);
  const html = await article.text();
  assert.match(html, /Designing for clinical clarity/);
  assert.match(html, /In this article/);
  assert.match(html, /Clarity is a clinical feature/);
});

test("renders contact page and returns 404 for unknown article", async () => {
  const contact = await render("/contact");
  assert.equal(contact.status, 200);
  assert.match(await contact.text(), /We’re here to help/);
  const missing = await render("/blog/does-not-exist");
  assert.equal(missing.status, 404);
});

test("renders the local sign-in fallback", async () => {
  const response = await render("/signin");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Welcome back/);
  assert.match(html, /Sign in securely/);
  assert.match(html, /Email address/);
});

test("exposes the three client-rendered dashboard routes without an auth guard", async () => {
  for (const path of ["/dashboard", "/dashboard/doctors", "/dashboard/patients"]) {
    const response = await render(path);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Doctor Tracker/);
  }
});
