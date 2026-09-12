export default function BlogLoading() {
  return (
    <main className="site-shell py-20" aria-busy="true">
      <div className="h-4 w-36 animate-pulse rounded bg-sage" />
      <div className="mt-8 h-20 max-w-3xl animate-pulse rounded-3xl bg-forest/10" />
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[430px] animate-pulse rounded-[2rem] bg-white"
          />
        ))}
      </div>
      <span className="sr-only">Loading insights</span>
    </main>
  );
}
