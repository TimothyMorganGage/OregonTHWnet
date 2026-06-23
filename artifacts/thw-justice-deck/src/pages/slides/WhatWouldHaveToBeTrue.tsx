export default function WhatWouldHaveToBeTrue() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -bottom-[20vh] -right-[10vw] w-[42vw] h-[42vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute inset-x-0 top-0 bottom-[9vh] flex flex-col px-[8vw] pt-[6.5vh] pb-[3vh]">
        <header className="shrink-0">
          <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
            08 / A PLANNING MODEL
          </div>
          <h2 className="mt-[1.2vh] text-[4.8vw] font-extrabold leading-[1.02] tracking-tight text-text max-w-[78vw]">
            What would have to be true
          </h2>
        </header>

        <div className="flex-1 flex flex-col justify-center gap-[2.2vh]">
          <p className="text-[3vw] font-semibold leading-[1.2] text-text max-w-[68vw] border-b-[0.18vh] border-primary/20 pb-[1.4vh]">
            2030 is a conditional plan — it requires:
          </p>
          <div className="flex flex-col gap-[1.8vh]">
            <div className="flex items-baseline gap-[1.6vw]">
              <span className="text-[3vw] font-extrabold leading-[1.2] text-primary shrink-0 tabular-nums">
                01
              </span>
              <p className="text-[3vw] leading-[1.2] text-muted max-w-[64vw]">
                ~1 THW per 250 high-need patients (IMPaCT)
              </p>
            </div>
            <div className="flex items-baseline gap-[1.6vw]">
              <span className="text-[3vw] font-extrabold leading-[1.2] text-primary shrink-0 tabular-nums">
                02
              </span>
              <p className="text-[3vw] leading-[1.2] text-muted max-w-[64vw]">
                ≥75% of billed visits actually paid (Milbank 2025)
              </p>
            </div>
            <div className="flex items-baseline gap-[1.6vw]">
              <span className="text-[3vw] font-extrabold leading-[1.2] text-primary shrink-0 tabular-nums">
                03
              </span>
              <p className="text-[3vw] leading-[1.2] text-muted max-w-[64vw]">
                Commercial &amp; Medicare Advantage denials nearing parity
              </p>
            </div>
          </div>

          <div className="bg-primary/8 rounded-[1vw] border-l-[0.4vw] border-primary pl-[2.2vw] pr-[2vw] py-[1.1vh] max-w-[68vw]">
            <p className="text-[2.3vw] leading-[1.28] text-text/80">
              <span className="font-semibold text-text">Necessary, not sufficient.</span>{" "}
              IMPaCT density may not transfer to rural or tribal Oregon.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw]">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">08</span>
      </div>
    </div>
  );
}
