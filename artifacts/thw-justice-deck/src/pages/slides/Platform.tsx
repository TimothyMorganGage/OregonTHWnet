export default function Platform() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[18vh] -right-[8vw] w-[40vw] h-[40vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute top-[7vh] left-[8vw] right-[8vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
          02 / WHAT IT DOES
        </div>
        <h2 className="mt-[1.4vh] text-[4.8vw] font-extrabold leading-[1.05] tracking-tight text-text">
          What the platform does
        </h2>
      </div>

      <div className="absolute left-[8vw] right-[8vw] top-[26vh] bottom-[10.5vh] grid grid-cols-2 grid-rows-2 gap-[2.5vh_3vw]">
        <div className="bg-panel rounded-[1.2vw] px-[2.4vw] py-[2.4vh] flex flex-col">
          <div className="w-[2.2vw] h-[2.2vw] rounded-[0.5vw] bg-primary/90" />
          <h3 className="mt-[1.6vh] text-[3vw] font-bold text-text">Claims &amp; coding</h3>
          <p className="mt-[1vh] text-[3vw] leading-[1.28] text-muted">
            15 CPT + 25 Z codes, incl. G0019 / G0023
          </p>
        </div>
        <div className="bg-panel rounded-[1.2vw] px-[2.4vw] py-[2.4vh] flex flex-col">
          <div className="w-[2.2vw] h-[2.2vw] rounded-[0.5vw] bg-primary/90" />
          <h3 className="mt-[1.6vh] text-[3vw] font-bold text-text">Coverage &amp; denials</h3>
          <p className="mt-[1vh] text-[3vw] leading-[1.28] text-muted">
            Insurance, denials, appeals in one place
          </p>
        </div>
        <div className="bg-panel rounded-[1.2vw] px-[2.4vw] py-[2.4vh] flex flex-col">
          <div className="w-[2.2vw] h-[2.2vw] rounded-[0.5vw] bg-primary/90" />
          <h3 className="mt-[1.6vh] text-[3vw] font-bold text-text">Forecasting</h3>
          <p className="mt-[1vh] text-[3vw] leading-[1.28] text-muted">
            Illustrative model toward fewer denials by 2030
          </p>
        </div>
        <div className="bg-panel rounded-[1.2vw] px-[2.4vw] py-[2.4vh] flex flex-col">
          <div className="w-[2.2vw] h-[2.2vw] rounded-[0.5vw] bg-primary/90" />
          <h3 className="mt-[1.6vh] text-[3vw] font-bold text-text">Sourced numbers</h3>
          <p className="mt-[1vh] text-[3vw] leading-[1.28] text-muted">
            Every figure tied to a dated source
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw]">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">02</span>
      </div>
    </div>
  );
}
