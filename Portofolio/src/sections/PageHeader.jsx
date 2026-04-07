export default function PageHeader() {
  return (
    <header className="fixed top-0 z-[3] flex h-28 w-full flex-col items-center justify-center gap-3 px-[5%] text-xs uppercase tracking-[0.25em] text-white sm:flex-row sm:justify-between sm:text-sm sm:tracking-[0.5em]">
      <div>Animated Sections</div>
      <div>
        <a
          href="https://codepen.io/BrianCross/pen/PoWapLP"
          target="_blank"
          rel="noreferrer"
          className="text-white no-underline"
        >
          Original Inspiration
        </a>
      </div>
    </header>
  )
}
