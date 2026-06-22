export default function Mandate() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[18vh] -left-[8vw] w-[40vw] h-[40vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute top-[8vh] left-[8vw] right-[8vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
          07 / THE 2030 MANDATE
        </div>
        <h2 className="mt-[1.6vh] text-[4.8vw] font-extrabold leading-[1.05] tracking-tight text-text">
          The 2030 mandate
        </h2>
      </div>

      <div className="absolute left-[8vw] right-[8vw] top-[27vh] bottom-[10vh]">
        <p className="text-[3.1vw] font-semibold leading-[1.25] text-text max-w-[82vw]">
          What if every private insurer in Oregon had to cover THW claims — not
          just Medicaid?
        </p>

        <div className="mt-[3vh] grid grid-cols-3 gap-[3vw]">
          <div className="bg-panel rounded-[1.2vw] px-[2.2vw] py-[2.4vh]">
            <div className="text-[5vw] font-extrabold leading-none text-primary">
              ~30%
            </div>
            <p className="mt-[1.2vh] text-[2.4vw] leading-[1.25] text-muted">
              Medicaid — covered today
            </p>
          </div>
          <div className="bg-panel rounded-[1.2vw] px-[2.2vw] py-[2.4vh]">
            <div className="text-[5vw] font-extrabold leading-none text-primary">
              ~50%
            </div>
            <p className="mt-[1.2vh] text-[2.4vw] leading-[1.25] text-muted">
              Commercial — the coverage gap
            </p>
          </div>
          <div className="bg-panel rounded-[1.2vw] px-[2.2vw] py-[2.4vh]">
            <div className="text-[5vw] font-extrabold leading-none text-primary">
              ~17%
            </div>
            <p className="mt-[1.2vh] text-[2.4vw] leading-[1.25] text-muted">
              Medicare — partial reach
            </p>
          </div>
        </div>

        <p className="mt-[3vh] text-[2.8vw] leading-[1.3] text-muted max-w-[84vw]">
          A mandate would extend care to the ~50% on commercial plans — the
          segment driving the disparity gap. Coverage mix: KFF.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw]">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">07</span>
      </div>
    </div>
  );
}
