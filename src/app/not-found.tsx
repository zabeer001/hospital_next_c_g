import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell grid min-h-[70vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow justify-center">404 · Off the map</p>
        <p className="mt-8 text-[8rem] font-medium leading-none tracking-[-.08em] text-sage">
          404
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">
          This page needs a check-up.
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-muted">
          The page may have moved, or the address may not be quite right.
        </p>
        <Link href="/" className="button button-dark mt-8">
          Return home <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
