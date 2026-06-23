export default function EconomicJustice() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -bottom-[20vh] -left-[10vw] w-[42vw] h-[42vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute top-[8vh] left-[8vw] right-[8vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
          04 / EVERY OREGONIAN
        </div>
        <h2 className="mt-[1.6vh] text-[4.8vw] font-extrabold leading-[1.05] tracking-tight text-text">
          Justice for healthy Oregonians
        </h2>
      </div>

      <div className="absolute left-[8vw] right-[8vw] top-[30vh] bottom-[10vh] flex items-center gap-[6vw]">
        <div className="w-[40vw] shrink-0">
          <div className="text-[12vw] font-extrabold leading-[0.9] tracking-tight text-primary">
            $2.47
          </div>
          <p className="mt-[2vh] text-[3vw] font-semibold leading-[1.28] text-text">
            returned for every $1 invested in community health work
          </p>
          <p className="mt-[1.5vh] text-[2.3vw] leading-[1.3] text-muted">
            Penn IMPaCT — Kangovi 2020, Health Affairs
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-[3.5vh]">
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.28] text-muted max-w-[33vw]">
              Fewer avoidable admissions ease premiums across the whole risk pool
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.28] text-muted max-w-[33vw]">
              A sustainable workforce keeps care local and creates living-wage jobs
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw] z-10">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">04</span>
      </div>
    </div>
  );
}
