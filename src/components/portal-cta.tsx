export function PortalCta({ portalUrl }: { portalUrl: string }) {
  return (
    <section className="bg-amber px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow justify-center">Your workspace is ready</p>
        <h2 className="section-title mt-5">Step into a clearer day of care.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-forest/70">Everything your team needs to move from scattered information to coordinated action.</p>
        <a href={portalUrl} className="button button-dark mt-9">Sign in to Doctor Tracker <span aria-hidden="true">↗</span></a>
        <p className="mt-5 text-xs text-forest/55">Access is available to authorized care teams.</p>
      </div>
    </section>
  );
}
