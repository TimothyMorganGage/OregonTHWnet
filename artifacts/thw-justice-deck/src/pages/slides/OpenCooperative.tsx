export default function OpenCooperative() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[18vh] -right-[8vw] w-[40vw] h-[40vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute inset-x-0 top-0 bottom-[9vh] flex flex-col px-[8vw] pt-[7.5vh] pb-[3vh]">
        <header className="shrink-0">
          <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
            05 / OWNERSHIP
          </div>
          <h2 className="mt-[1.2vh] text-[4.8vw] font-extrabold leading-[1.02] tracking-tight text-text max-w-[78vw]">
            An open cooperative
          </h2>
        </header>

        <div className="flex-1 flex flex-col justify-center gap-[3vh]">
          <p className="text-[3.1vw] font-semibold leading-[1.3] text-text max-w-[64vw]">
            Owned by the workers it serves — open to join, built in the open.
          </p>
          <div className="flex flex-col gap-[2.8vh]">
            <div className="flex items-start gap-[1.8vw]">
              <div className="mt-[1.3vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
              <p className="text-[3vw] leading-[1.3] text-muted max-w-[62vw]">
                Anyone can join — registration runs through Replit Auth
              </p>
            </div>
            <div className="flex items-start gap-[1.8vw]">
              <div className="mt-[1.3vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
              <p className="text-[3vw] leading-[1.3] text-muted max-w-[62vw]">
                A public forum keeps access transparent
              </p>
            </div>
            <div className="flex items-start gap-[1.8vw]">
              <div className="mt-[1.3vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
              <p className="text-[3vw] leading-[1.3] text-muted max-w-[62vw]">
                Remixable by any state or tribal nation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw]">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">05</span>
      </div>
    </div>
  );
}
