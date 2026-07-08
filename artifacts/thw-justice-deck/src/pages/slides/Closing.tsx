const base = import.meta.env.BASE_URL;

export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-primary font-body">
      <div className="absolute -top-[22vh] -right-[12vw] w-[55vw] h-[55vw] rounded-full border-[0.25vw] border-white/15" />
      <div className="absolute -bottom-[26vh] -left-[10vw] w-[44vw] h-[44vw] rounded-full border-[0.25vw] border-white/10" />

      <div className="absolute top-[10vh] left-[8vw] text-[2.2vw] font-bold tracking-[0.2em] text-white/80">
        OREGON THW NETWORK
      </div>

      <div className="absolute top-[8vh] right-[8vw] w-[15vw] h-[15vw] rounded-full bg-white/95 flex items-center justify-center shadow-[0_0_2vw_rgba(0,0,0,0.15)]">
        <img
          src={`${base}freelancers-union-badge.png`}
          crossOrigin="anonymous"
          alt="Proud member of Freelancers Union"
          className="w-[13vw] h-[13vw] object-contain"
        />
      </div>

      <div className="absolute top-[18vh] bottom-[9vh] left-[8vw] right-[8vw] flex flex-col justify-center">
        <h2 className="text-[6vw] font-extrabold leading-[1.05] tracking-tight text-white max-w-[66vw]">
          Join, remix, advance the work
        </h2>
        <div className="mt-[4vh] flex items-start gap-[2.5vw]">
          <div className="mt-[2vh] w-[5vw] h-[0.55vh] bg-white shrink-0" />
          <p className="text-[2.8vw] font-normal leading-[1.4] text-white/85 max-w-[64vw]">
            Join the Oregon THW Network to close the coverage gap — and feel free
            to fork the app for your state and/or tribal nation!
          </p>
        </div>
        <div className="mt-[4.5vh] flex flex-col gap-[1.6vh]">
          <a
            href="https://hedis-econometric-optimizer.replit.app/oregon-thw-network/"
            target="_blank"
            rel="noreferrer"
            className="text-[2.2vw] font-semibold text-white underline decoration-white/40 underline-offset-[0.5vh] hover:decoration-white"
          >
            hedis-econometric-optimizer.replit.app/oregon-thw-network
          </a>
          <p className="text-[2.2vw] font-medium text-white/80">tmgtyw@gmail.com</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] flex items-center justify-between px-[8vw] border-t border-white/20">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/70">09</span>
      </div>
    </div>
  );
}
