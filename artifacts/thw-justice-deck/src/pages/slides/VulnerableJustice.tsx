const base = import.meta.env.BASE_URL;

export default function VulnerableJustice() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute right-0 top-0 bottom-[9vh] w-[37vw] overflow-hidden">
        <img
          src={`${base}community-health-worker.png`}
          crossOrigin="anonymous"
          alt="A community health worker talking with an older person at home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/10" />
      </div>

      <div className="absolute top-[9vh] left-[8vw] w-[47vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.16em] text-primary">
          03 / VULNERABLE OREGONIANS
        </div>
        <h2 className="mt-[1.6vh] text-[3.7vw] font-extrabold leading-[1.06] tracking-tight text-text">
          Justice for vulnerable Oregonians
        </h2>
        <p className="mt-[2vh] text-[3vw] font-semibold leading-[1.25] text-text">
          THWs reach the people the medical system misses.
        </p>
      </div>

      <div className="absolute left-[8vw] w-[47vw] top-[44vh] bottom-[10vh] flex flex-col justify-start gap-[2.8vh]">
        <div className="flex items-start gap-[1.6vw]">
          <div className="mt-[1.6vh] w-[2vw] h-[0.45vh] bg-primary shrink-0" />
          <p className="text-[3vw] leading-[1.25] text-muted">
            Meets housing, food, and transport needs
          </p>
        </div>
        <div className="flex items-start gap-[1.6vw]">
          <div className="mt-[1.6vh] w-[2vw] h-[0.45vh] bg-primary shrink-0" />
          <p className="text-[3vw] leading-[1.25] text-muted">
            AHRQ: an avoidable inpatient stay costs about $16,670
          </p>
        </div>
        <div className="flex items-start gap-[1.6vw]">
          <div className="mt-[1.6vh] w-[2vw] h-[0.45vh] bg-primary shrink-0" />
          <p className="text-[3vw] leading-[1.25] text-muted">
            Fewer denials means care reaches those who qualify
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw] z-10">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">03</span>
      </div>
    </div>
  );
}
