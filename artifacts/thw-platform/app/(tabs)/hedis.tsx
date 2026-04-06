import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { HEDIS_MEASURES, FORECAST_DATA, ILOS_MAPPINGS, INSURANCE_PLANS } from "@/data/sampleData";
import { ProgressBar } from "@/components/ProgressBar";

const CATEGORIES = ["All", "Chronic Disease Management", "Behavioral Health", "Preventive Care", "Maternal Health", "Equity & Access", "Substance Use"];

type ActiveTab = "hedis" | "forecast" | "roi";

export default function HEDISScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<ActiveTab>("hedis");

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const filtered = selectedCategory === "All"
    ? HEDIS_MEASURES
    : HEDIS_MEASURES.filter(m => m.category === selectedCategory);

  const currentYear = FORECAST_DATA.find(f => f.year === 2026)!;
  const ilosPlans = INSURANCE_PLANS.filter(p => p.supportsILOS).length;

  const formatM = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };

  const formatK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 16, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Analytics</Text>
        <View style={[styles.tabBar, { backgroundColor: colors.secondary }]}>
          {([
            { key: "hedis", label: "HEDIS" },
            { key: "forecast", label: "Forecast" },
            { key: "roi", label: "ROI" },
          ] as const).map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, activeTab === tab.key && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, { color: activeTab === tab.key ? "#fff" : colors.mutedForeground }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset + 100 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ─────────────────── HEDIS TAB ─────────────────── */}
        {activeTab === "hedis" && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: selectedCategory === cat ? colors.primary : colors.secondary,
                      borderColor: selectedCategory === cat ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.catText, { color: selectedCategory === cat ? "#fff" : colors.mutedForeground }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[styles.impactBanner, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
              <Feather name="activity" size={16} color={colors.primary} />
              <Text style={[styles.impactText, { color: colors.primary }]}>
                THWs positively impact <Text style={{ fontFamily: "Inter_700Bold" }}>{HEDIS_MEASURES.length} HEDIS measures</Text> — both via direct FFS billing and ILOS cost substitution
              </Text>
            </View>

            {filtered.map(measure => (
              <View
                key={measure.id}
                style={[styles.measureCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.measureHeader}>
                  <View style={[styles.abbrBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.abbrText, { color: colors.primary }]}>{measure.abbreviation}</Text>
                  </View>
                  <View style={styles.measureMeta}>
                    <Text style={[styles.measureName, { color: colors.foreground }]}>{measure.name}</Text>
                    <Text style={[styles.measureCategory, { color: colors.mutedForeground }]}>{measure.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.impactBadge,
                      { backgroundColor: measure.trending === "up" ? "#dcfce7" : "#f1f5f9" },
                    ]}
                  >
                    <Feather
                      name={measure.trending === "up" ? "trending-up" : "minus"}
                      size={12}
                      color={measure.trending === "up" ? "#16a34a" : "#64748b"}
                    />
                    <Text style={[styles.impactPct, { color: measure.trending === "up" ? "#16a34a" : "#64748b" }]}>
                      +{measure.thwImpact}%
                    </Text>
                  </View>
                </View>

                <Text style={[styles.measureDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {measure.description}
                </Text>

                <View style={styles.ratesRow}>
                  <View style={styles.rateStat}>
                    <Text style={[styles.rateValue, { color: colors.primary }]}>{measure.currentRate}%</Text>
                    <Text style={[styles.rateLabel, { color: colors.mutedForeground }]}>Current</Text>
                  </View>
                  <View style={styles.rateStat}>
                    <Text style={[styles.rateValue, { color: colors.foreground }]}>{measure.nationalAvg}%</Text>
                    <Text style={[styles.rateLabel, { color: colors.mutedForeground }]}>Nat. Avg</Text>
                  </View>
                  <View style={styles.rateStat}>
                    <Text style={[styles.rateValue, { color: colors.accent }]}>{measure.targetRate}%</Text>
                    <Text style={[styles.rateLabel, { color: colors.mutedForeground }]}>Target</Text>
                  </View>
                </View>

                <ProgressBar value={measure.currentRate} color={colors.primary} height={6} />

                {measure.relatedCPTCodes.length > 0 && (
                  <View style={styles.codeRow}>
                    <Text style={[styles.codeRowLabel, { color: colors.mutedForeground }]}>Codes: </Text>
                    {measure.relatedCPTCodes.map(code => (
                      <View key={code} style={[styles.codeTag, { backgroundColor: colors.secondary }]}>
                        <Text style={[styles.codeTagText, { color: colors.primary }]}>{code}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* ─────────────────── FORECAST TAB ─────────────────── */}
        {activeTab === "forecast" && (
          <>
            <View style={[styles.forecastBanner, { backgroundColor: colors.primary }]}>
              <Text style={styles.forecastHeadline}>Oregon THW Econometric Forecast</Text>
              <Text style={styles.forecastSubhead}>
                Zero denial rate projected by 2030 as insurance coverage expands nationwide
              </Text>
            </View>

            {FORECAST_DATA.map(point => {
              const isTarget = point.year === 2030;
              const isCurrent = point.year === 2026;
              return (
                <View
                  key={point.year}
                  style={[
                    styles.forecastRow,
                    { backgroundColor: isTarget ? colors.primary : colors.card, borderColor: isTarget ? colors.primary : colors.border },
                  ]}
                >
                  <View style={styles.forecastYearCol}>
                    <Text style={[styles.forecastYear, { color: isTarget ? "#fff" : colors.foreground }]}>
                      {point.year}
                    </Text>
                    {isTarget && (
                      <View style={styles.targetBadge}>
                        <Text style={styles.targetText}>GOAL</Text>
                      </View>
                    )}
                    {isCurrent && (
                      <View style={[styles.currentBadge, { backgroundColor: colors.secondary }]}>
                        <Text style={[styles.currentText, { color: colors.primary }]}>NOW</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.forecastMetrics}>
                    <View style={styles.forecastMetric}>
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : "#e53e3e" }]}>
                        {point.denialRate}%
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        Denial
                      </Text>
                    </View>
                    <View style={styles.forecastMetric}>
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : colors.success }]}>
                        {point.approvalRate}%
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        Approval
                      </Text>
                    </View>
                    <View style={styles.forecastMetric}>
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : colors.warning }]}>
                        {point.combinedROI}x
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        ROI
                      </Text>
                    </View>
                    <View style={styles.forecastMetric}>
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : colors.primary }]}>
                        {formatM(point.combinedNetBenefit)}
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        Net Benefit
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={[styles.assumptionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.assumptionsTitle, { color: colors.foreground }]}>Model Assumptions</Text>
              {[
                "Annual 15–20% growth in THW-recognizing insurance plans",
                "Oregon legislative mandates expanding FFS codes through 2027",
                "Federal CMS THW billing guidance (2025–2026) unlocks national FFS",
                "ILOS contracts grow from 2 plans (2024) to 38+ plans (2030)",
                "Combined ROI improves from 3.5x → 17x as approval rates reach ~99%",
                "ILOS avoidance savings grow as plan scope expands to inpatient & specialty",
              ].map((item, i) => (
                <View key={i} style={styles.assumptionRow}>
                  <View style={[styles.assumptionDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.assumptionText, { color: colors.mutedForeground }]}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ─────────────────── ROI ANALYSIS TAB ─────────────────── */}
        {activeTab === "roi" && (
          <>
            {/* Hero ROI summary for current year */}
            <View style={[styles.roiHero, { backgroundColor: colors.primary }]}>
              <Text style={styles.roiHeroYear}>2026 ROI Snapshot</Text>
              <Text style={styles.roiHeroSub}>
                Fee For Service + In Lieu of Services combined return on THW program investment
              </Text>
              <View style={styles.roiHeroStats}>
                <View style={styles.roiHeroStat}>
                  <Text style={styles.roiHeroVal}>{currentYear.combinedROI}x</Text>
                  <Text style={styles.roiHeroLbl}>Combined ROI</Text>
                </View>
                <View style={[styles.roiHeroDivider, { backgroundColor: "rgba(255,255,255,0.2)" }]} />
                <View style={styles.roiHeroStat}>
                  <Text style={styles.roiHeroVal}>{formatM(currentYear.combinedNetBenefit)}</Text>
                  <Text style={styles.roiHeroLbl}>Net Benefit</Text>
                </View>
                <View style={[styles.roiHeroDivider, { backgroundColor: "rgba(255,255,255,0.2)" }]} />
                <View style={styles.roiHeroStat}>
                  <Text style={styles.roiHeroVal}>{ilosPlans}</Text>
                  <Text style={styles.roiHeroLbl}>ILOS Plans</Text>
                </View>
              </View>
            </View>

            {/* FFS vs ILOS Side-by-Side */}
            <View style={styles.roiSideBySide}>
              {/* FFS Card */}
              <View style={[styles.roiModelCard, { backgroundColor: "#e8f4f0", flex: 1 }]}>
                <View style={styles.roiModelHeader}>
                  <View style={[styles.roiModelIcon, { backgroundColor: colors.primary }]}>
                    <Feather name="dollar-sign" size={14} color="#fff" />
                  </View>
                  <Text style={[styles.roiModelTitle, { color: colors.primary }]}>Fee For Service</Text>
                </View>
                <Text style={[styles.roiModelROI, { color: colors.primary }]}>
                  {currentYear.ffsROI}x
                </Text>
                <Text style={[styles.roiModelROILabel, { color: colors.mutedForeground }]}>ROI ratio</Text>
                <View style={[styles.roiModelDivider, { backgroundColor: colors.border }]} />
                <View style={styles.roiModelStat}>
                  <Text style={[styles.roiModelStatVal, { color: colors.foreground }]}>{formatM(currentYear.ffsRevenue)}</Text>
                  <Text style={[styles.roiModelStatLbl, { color: colors.mutedForeground }]}>Revenue</Text>
                </View>
                <View style={styles.roiModelStat}>
                  <Text style={[styles.roiModelStatVal, { color: colors.foreground }]}>{formatK(currentYear.ffsVisitCount)}</Text>
                  <Text style={[styles.roiModelStatLbl, { color: colors.mutedForeground }]}>Visits</Text>
                </View>
                <View style={styles.roiModelStat}>
                  <Text style={[styles.roiModelStatVal, { color: colors.foreground }]}>${currentYear.ffsAvgReimbursement}</Text>
                  <Text style={[styles.roiModelStatLbl, { color: colors.mutedForeground }]}>Avg/Visit</Text>
                </View>
                <Text style={[styles.roiModelNote, { color: colors.mutedForeground }]}>
                  Direct billing revenue per approved claim across all recognized plans
                </Text>
              </View>

              {/* ILOS Card */}
              <View style={[styles.roiModelCard, { backgroundColor: "#fef3c7", flex: 1 }]}>
                <View style={styles.roiModelHeader}>
                  <View style={[styles.roiModelIcon, { backgroundColor: "#d97706" }]}>
                    <Feather name="shield" size={14} color="#fff" />
                  </View>
                  <Text style={[styles.roiModelTitle, { color: "#d97706" }]}>In Lieu of Services</Text>
                </View>
                <Text style={[styles.roiModelROI, { color: "#d97706" }]}>
                  {currentYear.ilosROI}x
                </Text>
                <Text style={[styles.roiModelROILabel, { color: colors.mutedForeground }]}>ROI ratio</Text>
                <View style={[styles.roiModelDivider, { backgroundColor: "#fde68a" }]} />
                <View style={styles.roiModelStat}>
                  <Text style={[styles.roiModelStatVal, { color: colors.foreground }]}>{formatM(currentYear.ilosAvoidedCost)}</Text>
                  <Text style={[styles.roiModelStatLbl, { color: colors.mutedForeground }]}>Cost Avoidance</Text>
                </View>
                <View style={styles.roiModelStat}>
                  <Text style={[styles.roiModelStatVal, { color: colors.foreground }]}>{formatK(currentYear.ilosVisitCount)}</Text>
                  <Text style={[styles.roiModelStatLbl, { color: colors.mutedForeground }]}>ILOS Visits</Text>
                </View>
                <View style={styles.roiModelStat}>
                  <Text style={[styles.roiModelStatVal, { color: colors.foreground }]}>${currentYear.ilosAvgAvoidance.toLocaleString()}</Text>
                  <Text style={[styles.roiModelStatLbl, { color: colors.mutedForeground }]}>Avg Avoidance</Text>
                </View>
                <Text style={[styles.roiModelNote, { color: colors.mutedForeground }]}>
                  Value of traditional services avoided by equivalent THW visits
                </Text>
              </View>
            </View>

            {/* Explanation */}
            <View style={[styles.explainerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.explainerHeader}>
                <Feather name="info" size={15} color={colors.primary} />
                <Text style={[styles.explainerTitle, { color: colors.foreground }]}>How ROI is Calculated</Text>
              </View>
              <View style={styles.explainerRow}>
                <View style={[styles.explainerDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.explainerText, { color: colors.mutedForeground }]}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>FFS ROI</Text>
                  {" "}= THW billing revenue ÷ program cost basis. At 72.9% approval (2026), each dollar invested returns ${currentYear.ffsROI.toFixed(2)} in direct reimbursements.
                </Text>
              </View>
              <View style={styles.explainerRow}>
                <View style={[styles.explainerDot, { backgroundColor: "#d97706" }]} />
                <Text style={[styles.explainerText, { color: colors.mutedForeground }]}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>ILOS ROI</Text>
                  {" "}= Avoided traditional service cost ÷ program cost basis. When a THW visit (avg ${currentYear.ffsAvgReimbursement}) substitutes an ED or hospitalization visit (avg ${currentYear.ilosAvgAvoidance.toLocaleString()}), each dollar invested avoids ${currentYear.ilosROI.toFixed(2)} in system costs.
                </Text>
              </View>
              <View style={styles.explainerRow}>
                <View style={[styles.explainerDot, { backgroundColor: "#7c3aed" }]} />
                <Text style={[styles.explainerText, { color: colors.mutedForeground }]}>
                  <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>Combined ROI ({currentYear.combinedROI}x)</Text>
                  {" "}= (FFS revenue + ILOS avoidance) ÷ program cost. Net benefit to the Oregon healthcare system: {formatM(currentYear.combinedNetBenefit)}/year.
                </Text>
              </View>
            </View>

            {/* ROI Year-over-Year Table */}
            <View style={[styles.roiTableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.roiTableTitle, { color: colors.foreground }]}>ROI Trajectory 2024 → 2030</Text>
              <View style={[styles.roiTableHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.roiTableHeadCell, { color: colors.mutedForeground, flex: 1 }]}>Year</Text>
                <Text style={[styles.roiTableHeadCell, { color: colors.primary, flex: 1.1, textAlign: "center" }]}>FFS ROI</Text>
                <Text style={[styles.roiTableHeadCell, { color: "#d97706", flex: 1.2, textAlign: "center" }]}>ILOS ROI</Text>
                <Text style={[styles.roiTableHeadCell, { color: "#7c3aed", flex: 1.2, textAlign: "center" }]}>Combined</Text>
              </View>
              {FORECAST_DATA.map(point => {
                const isCurrent = point.year === 2026;
                const isGoal = point.year === 2030;
                return (
                  <View
                    key={point.year}
                    style={[
                      styles.roiTableRow,
                      {
                        borderBottomColor: colors.border,
                        backgroundColor: isGoal ? colors.primary + "10" : isCurrent ? colors.secondary : "transparent",
                      },
                    ]}
                  >
                    <View style={[styles.roiTableCell, { flex: 1 }]}>
                      <Text style={[styles.roiTableYearText, { color: colors.foreground }]}>{point.year}</Text>
                      {isCurrent && (
                        <View style={[styles.nowTag, { backgroundColor: colors.primary }]}>
                          <Text style={styles.nowTagText}>NOW</Text>
                        </View>
                      )}
                      {isGoal && (
                        <View style={[styles.nowTag, { backgroundColor: "#7c3aed" }]}>
                          <Text style={styles.nowTagText}>GOAL</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.roiTableValCell, { color: colors.primary, flex: 1.1 }]}>
                      {point.ffsROI}x
                    </Text>
                    <Text style={[styles.roiTableValCell, { color: "#d97706", flex: 1.2 }]}>
                      {point.ilosROI}x
                    </Text>
                    <Text style={[styles.roiTableValCell, { color: "#7c3aed", flex: 1.2, fontFamily: "Inter_700Bold" }]}>
                      {point.combinedROI}x
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* ILOS Service Substitution Mappings */}
            <Text style={[styles.sectionTitle2, { color: colors.foreground }]}>
              ILOS Service Substitutions
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
              Each THW visit type and the higher-cost service it replaces in-lieu
            </Text>

            {ILOS_MAPPINGS.map(mapping => {
              const savings = mapping.replacedCostPerVisit - mapping.thwCostPerVisit;
              const savingsPct = Math.round((savings / mapping.replacedCostPerVisit) * 100);
              const annualSavings = savings * mapping.annualUtilizationPerTHW;
              const outcomeColor = mapping.outcomeEquivalence === "superior"
                ? "#16a34a"
                : mapping.outcomeEquivalence === "equivalent"
                  ? colors.primary
                  : "#d97706";

              return (
                <View
                  key={mapping.id}
                  style={[styles.ilosCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  {/* THW side */}
                  <View style={styles.ilosServiceRow}>
                    <View style={[styles.ilosServiceBox, { backgroundColor: "#e8f4f0", flex: 1 }]}>
                      <Text style={[styles.ilosServiceLabel, { color: colors.primary }]}>THW Service (FFS)</Text>
                      <Text style={[styles.ilosServiceName, { color: colors.foreground }]} numberOfLines={2}>
                        {mapping.thwService}
                      </Text>
                      <Text style={[styles.ilosCost, { color: colors.primary }]}>${mapping.thwCostPerVisit}/visit</Text>
                    </View>
                    <View style={styles.ilosArrow}>
                      <Feather name="arrow-right" size={18} color={colors.mutedForeground} />
                      <Text style={[styles.ilosArrowLabel, { color: colors.mutedForeground }]}>ILOS</Text>
                    </View>
                    {/* Replaced service side */}
                    <View style={[styles.ilosServiceBox, { backgroundColor: "#fee2e2", flex: 1 }]}>
                      <Text style={[styles.ilosServiceLabel, { color: "#e53e3e" }]}>Replaced Service</Text>
                      <Text style={[styles.ilosServiceName, { color: colors.foreground }]} numberOfLines={2}>
                        {mapping.replacedService}
                      </Text>
                      <Text style={[styles.ilosCost, { color: "#e53e3e" }]}>${mapping.replacedCostPerVisit.toLocaleString()}/visit</Text>
                    </View>
                  </View>

                  {/* Savings metrics */}
                  <View style={styles.ilosMetrics}>
                    <View style={styles.ilosMetric}>
                      <Text style={[styles.ilosMetricVal, { color: "#16a34a" }]}>${savings.toLocaleString()}</Text>
                      <Text style={[styles.ilosMetricLbl, { color: colors.mutedForeground }]}>Saved/Visit</Text>
                    </View>
                    <View style={styles.ilosMetric}>
                      <Text style={[styles.ilosMetricVal, { color: "#16a34a" }]}>{savingsPct}%</Text>
                      <Text style={[styles.ilosMetricLbl, { color: colors.mutedForeground }]}>Cost Reduction</Text>
                    </View>
                    <View style={styles.ilosMetric}>
                      <Text style={[styles.ilosMetricVal, { color: colors.primary }]}>{mapping.annualUtilizationPerTHW}</Text>
                      <Text style={[styles.ilosMetricLbl, { color: colors.mutedForeground }]}>Visits/THW/yr</Text>
                    </View>
                    <View style={styles.ilosMetric}>
                      <Text style={[styles.ilosMetricVal, { color: "#7c3aed" }]}>{formatM(annualSavings)}</Text>
                      <Text style={[styles.ilosMetricLbl, { color: colors.mutedForeground }]}>Annual Savings</Text>
                    </View>
                  </View>

                  {/* Outcome equivalence */}
                  <View style={styles.ilosFooter}>
                    <View style={[styles.outcomeBadge, { backgroundColor: outcomeColor + "18" }]}>
                      <Feather
                        name={mapping.outcomeEquivalence === "superior" ? "award" : "check-circle"}
                        size={11}
                        color={outcomeColor}
                      />
                      <Text style={[styles.outcomeBadgeText, { color: outcomeColor }]}>
                        Outcome: {mapping.outcomeEquivalence.charAt(0).toUpperCase() + mapping.outcomeEquivalence.slice(1)}
                      </Text>
                    </View>
                    <View style={[styles.hedisBadge2, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.hedisBadge2Text, { color: colors.primary }]}>{mapping.hedisCategory}</Text>
                    </View>
                  </View>

                  <Text style={[styles.outcomeNotes, { color: colors.mutedForeground }]}>
                    {mapping.outcomeNotes}
                  </Text>
                </View>
              );
            })}

            {/* Total ILOS Potential */}
            <View style={[styles.ilosTotalCard, { backgroundColor: colors.primary }]}>
              <Text style={styles.ilosTotalTitle}>Annual ILOS Savings Potential (per THW)</Text>
              <Text style={styles.ilosTotalVal}>
                {formatM(ILOS_MAPPINGS.reduce((sum, m) => sum + (m.replacedCostPerVisit - m.thwCostPerVisit) * m.annualUtilizationPerTHW, 0))}
              </Text>
              <Text style={styles.ilosTotalSub}>
                Combined avoided costs across all {ILOS_MAPPINGS.length} ILOS substitution types
              </Text>
              <View style={styles.ilosTotalStats}>
                <View style={styles.ilosTotalStat}>
                  <Text style={styles.ilosTotalStatVal}>
                    {ILOS_MAPPINGS.reduce((sum, m) => sum + m.annualUtilizationPerTHW, 0)}
                  </Text>
                  <Text style={styles.ilosTotalStatLbl}>Total Substituted Visits/yr</Text>
                </View>
                <View style={styles.ilosTotalStat}>
                  <Text style={styles.ilosTotalStatVal}>
                    {ILOS_MAPPINGS.filter(m => m.outcomeEquivalence === "superior").length}
                  </Text>
                  <Text style={styles.ilosTotalStatLbl}>Superior Outcome Services</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  content: { padding: 16, gap: 10 },
  categoryRow: { gap: 6, paddingBottom: 4 },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  catText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  impactBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  impactText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  measureCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  measureHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  abbrBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  abbrText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  measureMeta: { flex: 1 },
  measureName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  measureCategory: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  impactBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  impactPct: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  measureDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  ratesRow: {
    flexDirection: "row",
    gap: 12,
  },
  rateStat: { flex: 1 },
  rateValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  rateLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  codeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  codeRowLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  codeTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  codeTagText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  forecastBanner: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 4,
  },
  forecastHeadline: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  forecastSubhead: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  forecastRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 14,
  },
  forecastYearCol: {
    alignItems: "center",
    minWidth: 52,
  },
  forecastYear: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  targetBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  targetText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  currentText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  forecastMetrics: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  forecastMetric: { alignItems: "center" },
  fMetricVal: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  fMetricLabel: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 2,
  },
  assumptionsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  assumptionsTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  assumptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  assumptionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
    flexShrink: 0,
  },
  assumptionText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },

  // ROI tab
  roiHero: {
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  roiHeroYear: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  roiHeroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  roiHeroStats: {
    flexDirection: "row",
    marginTop: 4,
  },
  roiHeroStat: {
    flex: 1,
    alignItems: "center",
  },
  roiHeroVal: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  roiHeroLbl: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    textAlign: "center",
  },
  roiHeroDivider: {
    width: 1,
    marginVertical: 4,
  },
  roiSideBySide: {
    flexDirection: "row",
    gap: 8,
  },
  roiModelCard: {
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  roiModelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  roiModelIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  roiModelTitle: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    flex: 1,
    lineHeight: 16,
  },
  roiModelROI: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  roiModelROILabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: -4,
  },
  roiModelDivider: {
    height: 1,
    marginVertical: 4,
  },
  roiModelStat: { gap: 1 },
  roiModelStatVal: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  roiModelStatLbl: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  roiModelNote: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    lineHeight: 14,
    marginTop: 4,
  },
  explainerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  explainerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  explainerTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  explainerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  explainerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  explainerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  roiTableCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 0,
  },
  roiTableTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  roiTableHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  roiTableHeadCell: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  roiTableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  roiTableCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  roiTableYearText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  roiTableValCell: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  nowTag: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nowTagText: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  sectionTitle2: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    marginTop: 6,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
    marginTop: -4,
  },
  ilosCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  ilosServiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ilosServiceBox: {
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  ilosServiceLabel: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ilosServiceName: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 15,
  },
  ilosCost: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.2,
  },
  ilosArrow: {
    alignItems: "center",
    gap: 2,
  },
  ilosArrowLabel: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ilosMetrics: {
    flexDirection: "row",
    gap: 4,
  },
  ilosMetric: {
    flex: 1,
    alignItems: "center",
  },
  ilosMetricVal: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  ilosMetricLbl: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginTop: 1,
    textAlign: "center",
  },
  ilosFooter: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  outcomeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  outcomeBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  hedisBadge2: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  hedisBadge2Text: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  outcomeNotes: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
    fontStyle: "italic",
  },
  ilosTotalCard: {
    borderRadius: 16,
    padding: 20,
    gap: 8,
    marginTop: 6,
  },
  ilosTotalTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ilosTotalVal: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.5,
  },
  ilosTotalSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  ilosTotalStats: {
    flexDirection: "row",
    marginTop: 8,
    gap: 20,
  },
  ilosTotalStat: { gap: 2 },
  ilosTotalStatVal: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  ilosTotalStatLbl: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
});
