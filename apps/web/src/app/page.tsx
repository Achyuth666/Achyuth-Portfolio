import Link from "next/link";


export default function Home() {
  return (
    <main id="main" className="flex flex-1 flex-col justify-center gap-6 px-6 py-24 sm:px-16">
      <p className="label text-fg/60">Latent Space, under construction</p>
      <h1 className="display-xl max-w-[12ch]">
        Achyuth builds AI that <em>ships.</em>
      </h1>
      <p className="body-lg max-w-xl text-fg/80">
        AI engineer working on GenAI, agentic AI and MLOps in Bengaluru. The full site is on its way; the design
        system lives at <Link className="underline decoration-fg/24 underline-offset-4 hover:decoration-fg" href="/style">/style</Link>.
      </p>
    </main>
  );
}
