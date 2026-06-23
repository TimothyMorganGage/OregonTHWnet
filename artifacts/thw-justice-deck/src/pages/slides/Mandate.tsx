export default function Mandate() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[18vh] -left-[8vw] w-[40vw] h-[40vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute inset-x-0 top-0 bottom-[9vh] flex flex-col px-[8vw] pt-[7.5vh] pb-[3vh]">
        <header className="shrink-0">
          <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
            07 / THE 2030 MANDATE
          </div>
          <h2 className="mt-[1.2vh] text-[4.8vw] font-extrabold leading-[1.02] tracking-tight text-text max-w-[78vw]">
            The 2030 mandate
          </h2>
        </header>

        <div className="flex-1 flex flex-col justify-center gap-[2.6vh]">
          <p className="text-[3.1vw] font-semibold leading-[1.25] text-text max-w-[64vw]">
            What if every private insurer in Oregon had to cover THW claims — not
            just Medicaid?
          </p>

          <div className="grid grid-cols-3 gap-[2.6vw]">
            <div className="bg-panel rounded-[1.2vw] px-[2.2vw] py-[2.2vh]">
              <div className="text-[5vw] font-extrabold leading-none text-primary">
                ~30%
              </div>
              <p className="mt-[1vh] text-[2.4vw] leading-[1.2] text-muted">
                Medicaid — covered today
              </p>
            </div>
            <div className="bg-panel rounded-[1.2vw] px-[2.2vw] py-[2.2vh]">
              <div className="text-[5vw] font-extrabold leading-none text-primary">
                ~50%
              </div>
              <p className="mt-[1vh] text-[2.4vw] leading-[1.2] text-muted">
                Commercial — the coverage gap
              </p>
            </div>
            <div className="bg-panel rounded-[1.2vw] px-[2.2vw] py-[2.2vh]">
              <div className="text-[5vw] font-extrabold leading-none text-primary">
                ~17%
              </div>
              <p className="mt-[1vh] text-[2.4vw] leading-[1.2] text-muted">
                Medicare — partial reach
              </p>
            </div>
          </div>

          <p className="text-[2.5vw] leading-[1.3] text-muted max-w-[64vw]">
            A mandate would extend care to the ~50% on commercial plans — the
            segment driving the disparity gap. Coverage mix: KFF.
          </p>
        </div>
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
