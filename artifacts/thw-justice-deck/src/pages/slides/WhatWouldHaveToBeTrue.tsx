export default function WhatWouldHaveToBeTrue() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -bottom-[20vh] -right-[10vw] w-[42vw] h-[42vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute top-[8vh] left-[8vw] right-[8vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
          08 / A PLANNING MODEL
        </div>
        <h2 className="mt-[1.6vh] text-[4.8vw] font-extrabold leading-[1.05] tracking-tight text-text">
          What would have to be true
        </h2>
      </div>

      <div className="absolute left-[8vw] right-[8vw] top-[22vh] bottom-[10vh]">
        <p className="text-[3vw] font-semibold leading-[1.2] text-text max-w-[64vw]">
          2030 is a conditional plan, not a prediction. It requires:
        </p>
        <div className="mt-[2vh] flex flex-col gap-[1.8vh]">
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.2] text-muted max-w-[64vw]">
              ~1 THW per 250 high-need patients (IMPaCT)
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.2] text-muted max-w-[64vw]">
              ≥75% of billed visits actually paid (Milbank 2025)
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.2] text-muted max-w-[64vw]">
              Commercial &amp; Medicare Advantage denials nearing parity
            </p>
          </div>
        </div>

        <p className="mt-[1.5vh] text-[2.8vw] leading-[1.25] text-text/80 max-w-[64vw] border-l-[0.4vw] border-primary pl-[2vw]">
          Necessary, not sufficient: the workforce alone can&apos;t close every
          gap, and IMPaCT density may not transfer to rural or tribal Oregon.
        </p>
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
