export default function TitleSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[22vh] -right-[12vw] w-[55vw] h-[55vw] rounded-full border-[0.25vw] border-primary/20" />
      <div className="absolute -top-[8vh] -right-[2vw] w-[32vw] h-[32vw] rounded-full border-[0.25vw] border-primary/10" />

      <div className="absolute top-[9vh] left-[8vw] text-[2.2vw] font-bold tracking-[0.2em] text-primary">
        OREGON THW NETWORK
      </div>

      <div className="absolute top-[9vh] bottom-[9vh] left-[8vw] right-[8vw] z-10 flex flex-col justify-center">
        <h1 className="text-[6.6vw] font-extrabold leading-[1.04] tracking-tight text-text max-w-[78vw]">
          Building Disability &amp; Economic Justice
        </h1>
        <div className="mt-[5vh] flex items-start gap-[2.5vw]">
          <div className="mt-[2vh] w-[5vw] h-[0.55vh] bg-primary shrink-0" />
          <p className="text-[2.8vw] font-normal leading-[1.45] text-muted max-w-[62vw]">
            How a cooperative-owned platform turns Traditional Health Worker care
            into justice for every Oregonian — by 2030.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw]">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">01</span>
      </div>
    </div>
  );
}
