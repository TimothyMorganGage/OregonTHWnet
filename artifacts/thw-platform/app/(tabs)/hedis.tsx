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
import { HEDIS_MEASURES, FORECAST_DATA } from "@/data/sampleData";
import { ProgressBar } from "@/components/ProgressBar";
import { MiniChart } from "@/components/MiniChart";

const CATEGORIES = ["All", "Chronic Disease Management", "Behavioral Health", "Preventive Care", "Maternal Health", "Equity & Access", "Substance Use"];

export default function HEDISScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"hedis" | "forecast">("hedis");

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const filtered = selectedCategory === "All"
    ? HEDIS_MEASURES
    : HEDIS_MEASURES.filter(m => m.category === selectedCategory);

  const approvalRates = FORECAST_DATA.map(f => f.approvalRate);
  const denialRates = FORECAST_DATA.map(f => f.denialRate);
  const revenues = FORECAST_DATA.map(f => f.projectedRevenue / 1000000);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 16, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>HEDIS & Forecast</Text>
        <View style={[styles.tabBar, { backgroundColor: colors.secondary }]}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === "hedis" && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab("hedis")}
          >
            <Text style={[styles.tabText, { color: activeTab === "hedis" ? "#fff" : colors.mutedForeground }]}>
              HEDIS Measures
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === "forecast" && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab("forecast")}
          >
            <Text style={[styles.tabText, { color: activeTab === "forecast" ? "#fff" : colors.mutedForeground }]}>
              2030 Forecast
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "hedis" ? (
          <>
            {/* Category Filter */}
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

            {/* THW Impact Summary */}
            <View style={[styles.impactBanner, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
              <Feather name="activity" size={16} color={colors.primary} />
              <Text style={[styles.impactText, { color: colors.primary }]}>
                THWs positively impact <Text style={{ fontFamily: "Inter_700Bold" }}>{HEDIS_MEASURES.length} HEDIS measures</Text> across Oregon health plans
              </Text>
            </View>

            {/* Measures List */}
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
                      {
                        backgroundColor: measure.trending === "up" ? "#dcfce7" : "#f1f5f9",
                      },
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

                <View style={styles.progressSection}>
                  <ProgressBar value={measure.currentRate} color={colors.primary} height={6} />
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>0%</Text>
                    <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>Target: {measure.targetRate}%</Text>
                    <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>100%</Text>
                  </View>
                </View>

                {measure.relatedCPTCodes.length > 0 && (
                  <View style={styles.codeRow}>
                    <Text style={[styles.codeRowLabel, { color: colors.mutedForeground }]}>Related codes: </Text>
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
        ) : (
          <>
            {/* Forecast Tab */}
            <View style={[styles.forecastHeader2, { backgroundColor: colors.primary }]}>
              <Text style={styles.forecastHeadline}>Oregon THW Econometric Forecast</Text>
              <Text style={styles.forecastSubhead}>
                Zero denial rate projected by 2030 as insurance coverage expands
              </Text>
            </View>

            {/* Forecast Timeline */}
            {FORECAST_DATA.map((point, index) => {
              const isTarget = point.year === 2030;
              const isPast = point.year < 2026;
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
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : colors.destructive }]}>
                        {point.denialRate}%
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        Denial Rate
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
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : colors.foreground }]}>
                        {point.thwRecognitionCount}
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        Plans
                      </Text>
                    </View>
                    <View style={styles.forecastMetric}>
                      <Text style={[styles.fMetricVal, { color: isTarget ? "#fff" : colors.primary }]}>
                        ${(point.projectedRevenue / 1000000).toFixed(1)}M
                      </Text>
                      <Text style={[styles.fMetricLabel, { color: isTarget ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                        Revenue
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Key Assumptions */}
            <View style={[styles.assumptionsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.assumptionsTitle, { color: colors.foreground }]}>Model Assumptions</Text>
              {[
                "Annual 15–20% growth in THW-recognizing insurance plans",
                "Oregon legislative mandates expanding through 2027",
                "Federal CMS THW billing guidance implementation 2025–2026",
                "HEDIS measure improvements drive plan adoption incentives",
                "Advocacy campaigns converting 6–8 new national plans annually",
              ].map((item, i) => (
                <View key={i} style={styles.assumptionRow}>
                  <View style={[styles.assumptionDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.assumptionText, { color: colors.mutedForeground }]}>{item}</Text>
                </View>
              ))}
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
  progressSection: { gap: 4 },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
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
  forecastHeader2: {
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
    letterSpacing: 0.5,
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
});
