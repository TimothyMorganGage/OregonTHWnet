const SOURCES: { cite: string; detail: string; url: string; link: string }[] = [
  {
    cite: "Kangovi et al. 2020 — Health Affairs 39(2):207–213",
    detail: "IMPaCT CHW program — 2.47:1 ROI, 1:250 density.",
    url: "https://doi.org/10.1377/hlthaff.2019.00981",
    link: "doi.org/10.1377/hlthaff.2019.00981",
  },
  {
    cite: "AHRQ HCUP Statistical Brief #316 (Feb 2026)",
    detail: "Inpatient costs by payer, 2022 — the ~$16,670 stay.",
    url: "https://hcup-us.ahrq.gov/reports/statbriefs/sb316-most-expensive-conditions-by-payer-2022.pdf",
    link: "hcup-us.ahrq.gov",
  },
  {
    cite: "KFF State Health Facts — Oregon",
    detail: "Oregon coverage mix (US Census ACS estimates).",
    url: "https://www.kff.org/state-category/health-coverage-uninsured/",
    link: "kff.org",
  },
  {
    cite: "Milbank Memorial Fund (Nov 2025)",
    detail: "CHW Medicaid reimbursement — the ≥75%-paid threshold.",
    url: "https://www.milbank.org/publications/medicaid-reimbursement-for-community-health-worker-services-model-state-plan-amendment-other-guidance-november-2025-update/",
    link: "milbank.org",
  },
  {
    cite: "CMS CY 2026 Physician Fee Schedule (CMS-1832-F)",
    detail: "G0019 / G0023 Community Health Integration codes.",
    url: "https://www.cms.gov/newsroom/fact-sheets/calendar-year-cy-2026-medicare-physician-fee-schedule-final-rule-cms-1832-f",
    link: "cms.gov",
  },
];

export default function Sources() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg font-body">
      <div className="absolute -top-[20vh] -right-[10vw] w-[42vw] h-[42vw] rounded-full border-[0.25vw] border-primary/12" />

      <div className="absolute inset-x-0 top-0 bottom-[9vh] flex flex-col px-[8vw] pt-[4.5vh] pb-[2vh]">
        <header className="shrink-0">
          <div className="text-[2.2vw] font-bold tracking-[0.18em] text-primary">
            10 / SOURCES
          </div>
          <h2 className="mt-[0.8vh] text-[4.4vw] font-extrabold leading-[1.02] tracking-tight text-text max-w-[78vw]">
            Sources &amp; citations
          </h2>
        </header>

        <div className="flex-1 flex flex-col justify-center gap-[1vh]">
          {SOURCES.map((s, i) => (
            <div key={s.cite} className="flex items-baseline gap-[1.6vw]">
              <span className="text-[2.2vw] font-extrabold leading-[1.18] text-primary shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="max-w-[72vw]">
                <p className="text-[2.2vw] font-semibold leading-[1.16] text-text">
                  {s.cite}
                </p>
                <p className="text-[2vw] leading-[1.18] text-muted">
                  {s.detail}
                </p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[2vw] font-medium leading-[1.18] text-primary underline decoration-primary/40 underline-offset-[0.4vh] hover:decoration-primary"
                >
                  {s.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-screen h-[9vh] bg-primary flex items-center justify-between px-[8vw] z-10">
        <span className="text-[2.2vw] font-semibold tracking-[0.06em] text-white">
          Oregon THW Cooperative
        </span>
        <span className="text-[2.2vw] font-medium text-white/80">10</span>
      </div>
    </div>
  );
}
