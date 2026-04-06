import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { ClaimCard } from "@/components/ClaimCard";
import { SectionHeader } from "@/components/SectionHeader";
import { HEDIS_MEASURES, FORECAST_DATA } from "@/data/sampleData";
import { ProgressBar } from "@/components/ProgressBar";
import { Feather } from "@expo/vector-icons";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { claims, stats, isLoading } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const topMeasures = HEDIS_MEASURES.slice(0, 3);
  const recentClaims = claims.slice(0, 3);
  const currentForecast = FORECAST_DATA.find(f => f.year === 2026) || FORECAST_DATA[2];
  const nextForecast = FORECAST_DATA.find(f => f.year === 2027) || FORECAST_DATA[3];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: bottomInset + 100 },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Oregon THW Network
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Dashboard</Text>
        </View>
        <View style={[styles.goalBadge, { backgroundColor: colors.primary }]}>
          <Feather name="target" size={12} color="#fff" />
          <Text style={styles.goalText}>2030 Goal</Text>
        </View>
      </View>

      {/* 2030 Forecast Banner */}
      <View style={[styles.forecastBanner, { backgroundColor: colors.primary }]}>
        <View style={styles.forecastHeader}>
          <Feather name="trending-up" size={18} color="rgba(255,255,255,0.9)" />
          <Text style={styles.forecastTitle}>Zero Denial Forecast Progress</Text>
        </View>
        <View style={styles.forecastStats}>
          <View style={styles.forecastStat}>
            <Text style={styles.forecastVal}>{currentForecast.denialRate}%</Text>
            <Text style={styles.forecastLbl}>Current Denial Rate</Text>
          </View>
          <View style={[styles.forecastArrow]}>
            <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.6)" />
          </View>
          <View style={styles.forecastStat}>
            <Text style={styles.forecastVal}>0.8%</Text>
            <Text style={styles.forecastLbl}>2030 Target</Text>
          </View>
          <View style={styles.forecastStat}>
            <Text style={styles.forecastVal}>{currentForecast.thwRecognitionCount}</Text>
            <Text style={styles.forecastLbl}>Plans Recognizing THWs</Text>
          </View>
        </View>
        <View style={styles.forecastBarWrapper}>
          <ProgressBar
            value={100 - currentForecast.denialRate}
            max={100}
            color="rgba(255,255,255,0.85)"
            height={8}
          />
          <Text style={styles.forecastBarLabel}>
            {(100 - currentForecast.denialRate).toFixed(1)}% approval rate achieved
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            label="Total Claims"
            value={stats.totalClaims.toString()}
            accent
          />
          <StatCard
            label="Approval Rate"
            value={`${stats.approvalRate.toFixed(0)}%`}
            subLabel={stats.approvedClaims + " approved"}
            color={colors.success}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="Total Billed"
            value={formatCurrency(stats.totalBilled)}
            subLabel="This period"
          />
          <StatCard
            label="Open Denials"
            value={stats.openDenials.toString()}
            subLabel="Need action"
            color={stats.openDenials > 0 ? colors.destructive : colors.success}
          />
        </View>
      </View>

      {/* HEDIS Measures */}
      <SectionHeader
        title="HEDIS Impact"
        actionLabel="View All"
        onAction={() => router.push("/(tabs)/hedis")}
      />
      {topMeasures.map(measure => (
        <View
          key={measure.id}
          style={[styles.hedisCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.hedisHeader}>
            <View style={styles.hedisAbbr}>
              <Text style={[styles.hedisAbbrText, { color: colors.primary }]}>
                {measure.abbreviation}
              </Text>
            </View>
            <View style={styles.hedisInfo}>
              <Text style={[styles.hedisName, { color: colors.foreground }]} numberOfLines={1}>
                {measure.name}
              </Text>
              <Text style={[styles.hedisCategory, { color: colors.mutedForeground }]}>
                {measure.category}
              </Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: measure.trending === "up" ? "#dcfce7" : "#fee2e2" }]}>
              <Feather
                name={measure.trending === "up" ? "arrow-up-right" : "minus"}
                size={12}
                color={measure.trending === "up" ? "#16a34a" : "#6b7280"}
              />
              <Text style={[styles.trendText, { color: measure.trending === "up" ? "#16a34a" : "#6b7280" }]}>
                {measure.thwImpact}%
              </Text>
            </View>
          </View>
          <View style={styles.hedisBar}>
            <ProgressBar value={measure.currentRate} color={colors.primary} height={5} />
          </View>
          <View style={styles.hedisRates}>
            <Text style={[styles.rateText, { color: colors.mutedForeground }]}>
              Current: <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{measure.currentRate}%</Text>
            </Text>
            <Text style={[styles.rateText, { color: colors.mutedForeground }]}>
              Target: <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{measure.targetRate}%</Text>
            </Text>
          </View>
        </View>
      ))}

      {/* Recent Claims */}
      <SectionHeader
        title="Recent Claims"
        actionLabel="All Claims"
        onAction={() => router.push("/(tabs)/claims")}
      />
      {recentClaims.map(claim => (
        <ClaimCard
          key={claim.id}
          claim={claim}
          onPress={() => router.push(`/claim/${claim.id}`)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  goalText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  forecastBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  forecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  forecastTitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  forecastStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  forecastStat: {
    flex: 1,
  },
  forecastArrow: {
    paddingHorizontal: 4,
  },
  forecastVal: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  forecastLbl: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  forecastBarWrapper: { gap: 6 },
  forecastBarLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  statsGrid: { marginBottom: 24, gap: 8 },
  statsRow: { flexDirection: "row", gap: 8 },
  hedisCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  hedisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hedisAbbr: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#e8f4f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  hedisAbbrText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  hedisInfo: { flex: 1 },
  hedisName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  hedisCategory: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  hedisBar: { marginBottom: 8 },
  hedisRates: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rateText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
