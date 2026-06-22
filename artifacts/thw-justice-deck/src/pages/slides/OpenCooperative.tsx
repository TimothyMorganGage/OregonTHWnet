export default function OpenCooperative() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[18vh] -right-[8vw] w-[40vw] h-[40vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute top-[8vh] left-[8vw] right-[8vw]">
        <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
          05 / OWNERSHIP
        </div>
        <h2 className="mt-[1.6vh] text-[4.8vw] font-extrabold leading-[1.05] tracking-tight text-text">
          An open cooperative
        </h2>
      </div>

      <div className="absolute left-[8vw] right-[8vw] top-[27vh] bottom-[10vh]">
        <p className="text-[3.1vw] font-semibold leading-[1.25] text-text max-w-[80vw]">
          The platform is owned by the workers it serves — open to join, built in
          the open.
        </p>
        <div className="mt-[2.5vh] flex flex-col gap-[2.4vh]">
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.25] text-muted max-w-[76vw]">
              Anyone can apply to join — registration runs through Replit Auth,
              so every application comes from a verified identity, no paywall
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.25] text-muted max-w-[76vw]">
              A public member forum and join flow keep decisions and access
              transparent
            </p>
          </div>
          <div className="flex items-start gap-[1.8vw]">
            <div className="mt-[1.6vh] w-[2.2vw] h-[0.45vh] bg-primary shrink-0" />
            <p className="text-[3vw] leading-[1.25] text-muted max-w-[76vw]">
              Any state or tribal nation can remix the platform for their own
              jurisdiction
            </p>
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
