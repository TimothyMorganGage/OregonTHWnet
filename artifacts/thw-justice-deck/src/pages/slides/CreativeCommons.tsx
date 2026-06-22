export default function CreativeCommons() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -bottom-[20vh] -right-[10vw] w-[42vw] h-[42vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute top-[8vh] left-[8vw] right-[8vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
          06 / ACCOUNTABILITY
        </div>
        <h2 className="mt-[1.6vh] text-[4.8vw] font-extrabold leading-[1.05] tracking-tight text-text">
          Creative Commons accountability
        </h2>
      </div>

      <div className="absolute left-[8vw] right-[8vw] top-[27vh] bottom-[10vh]">
        <p className="text-[3.1vw] font-semibold leading-[1.25] text-text max-w-[82vw]">
          Open licensing turns the platform into shared public infrastructure —
          and keeps it honest.
        </p>
        <div className="mt-[2.5vh] flex flex-col gap-[2.4vh]">
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.25] text-muted max-w-[78vw]">
              Methods and code are public, so anyone can inspect, fork, and
              improve them
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.25] text-muted max-w-[78vw]">
              Every dollar figure cites a named, dated public source — no
              unverifiable claims
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.25] text-muted max-w-[78vw]">
              Demo data is labeled fictional until verified — what isn&apos;t
              proven says &ldquo;Not verified&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw]">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">06</span>
      </div>
    </div>
  );
}
