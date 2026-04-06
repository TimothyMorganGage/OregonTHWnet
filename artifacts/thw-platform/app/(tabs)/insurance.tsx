import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { INSURANCE_PLANS } from "@/data/sampleData";
import { InsurancePlan } from "@/types";

const COVERAGE_CONFIG = {
  full: { label: "Full Coverage", color: "#16a34a", bg: "#dcfce7", icon: "check-circle" as const },
  partial: { label: "Partial", color: "#d97706", bg: "#fef3c7", icon: "alert-circle" as const },
  pending: { label: "Pending", color: "#7c3aed", bg: "#ede9fe", icon: "clock" as const },
  none: { label: "No Coverage", color: "#e53e3e", bg: "#fee2e2", icon: "x-circle" as const },
};

type FilterType = "all" | "Oregon" | "National";

export default function InsuranceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const filtered = INSURANCE_PLANS.filter(p => {
    if (filter === "all") return true;
    if (filter === "Oregon") return p.state === "Oregon";
    if (filter === "National") return p.state === "National";
    return true;
  });

  const fullCoverage = INSURANCE_PLANS.filter(p => p.thwCoverage === "full").length;
  const partialCoverage = INSURANCE_PLANS.filter(p => p.thwCoverage === "partial").length;
  const noCoverage = INSURANCE_PLANS.filter(p => p.thwCoverage === "none").length;
  const pending = INSURANCE_PLANS.filter(p => p.thwCoverage === "pending").length;

  const renderPlan = ({ item }: { item: InsurancePlan }) => {
    const cov = COVERAGE_CONFIG[item.thwCoverage];
    const isExpanded = expanded === item.id;

    return (
      <TouchableOpacity
        onPress={() => setExpanded(isExpanded ? null : item.id)}
        activeOpacity={0.75}
        style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.planHeader}>
          <View style={styles.planNameCol}>
            <Text style={[styles.planName, { color: colors.foreground }]}>{item.name}</Text>
            <View style={styles.planTags}>
              <View style={[styles.typeTag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.typeTagText, { color: colors.mutedForeground }]}>
                  {item.type.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.stateTag, { color: colors.mutedForeground }]}>{item.state}</Text>
            </View>
          </View>
          <View style={[styles.covBadge, { backgroundColor: cov.bg }]}>
            <Feather name={cov.icon} size={12} color={cov.color} />
            <Text style={[styles.covText, { color: cov.color }]}>{cov.label}</Text>
          </View>
        </View>

        <View style={styles.planStats}>
          <View style={styles.planStat}>
            <Text style={[styles.planStatVal, { color: item.denialRate > 30 ? colors.destructive : item.denialRate > 15 ? colors.warning : colors.success }]}>
              {item.denialRate}%
            </Text>
            <Text style={[styles.planStatLabel, { color: colors.mutedForeground }]}>Denial Rate</Text>
          </View>
          <View style={styles.planStat}>
            <Text style={[styles.planStatVal, { color: colors.foreground }]}>
              {item.avgProcessingDays}d
            </Text>
            <Text style={[styles.planStatLabel, { color: colors.mutedForeground }]}>Processing</Text>
          </View>
          <View style={styles.planStat}>
            <Text style={[styles.planStatVal, { color: colors.primary }]}>
              {item.approvedCPTCodes.length}
            </Text>
            <Text style={[styles.planStatLabel, { color: colors.mutedForeground }]}>CPT Codes</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {item.notes && (
              <Text style={[styles.notesText, { color: colors.mutedForeground }]}>{item.notes}</Text>
            )}

            {item.approvedCPTCodes.length > 0 && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Approved CPT Codes</Text>
                <View style={styles.codesGrid}>
                  {item.approvedCPTCodes.map(code => (
                    <View key={code} style={[styles.codeChip, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.codeChipText, { color: colors.primary }]}>{code}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {item.coverageStartDate && (
              <Text style={[styles.coverageDate, { color: colors.mutedForeground }]}>
                Coverage started: {new Date(item.coverageStartDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </Text>
            )}

            {item.contactPhone && (
              <TouchableOpacity
                style={[styles.contactBtn, { borderColor: colors.primary }]}
                onPress={() => Linking.openURL(`tel:${item.contactPhone}`)}
              >
                <Feather name="phone" size={14} color={colors.primary} />
                <Text style={[styles.contactBtnText, { color: colors.primary }]}>{item.contactPhone}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={[styles.expandIcon, { transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }]}>
          <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 16, backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Insurance Plans</Text>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryItem, { backgroundColor: "#dcfce7" }]}>
            <Text style={[styles.summaryVal, { color: "#16a34a" }]}>{fullCoverage}</Text>
            <Text style={[styles.summaryLbl, { color: "#16a34a" }]}>Full</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: "#fef3c7" }]}>
            <Text style={[styles.summaryVal, { color: "#d97706" }]}>{partialCoverage}</Text>
            <Text style={[styles.summaryLbl, { color: "#d97706" }]}>Partial</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: "#ede9fe" }]}>
            <Text style={[styles.summaryVal, { color: "#7c3aed" }]}>{pending}</Text>
            <Text style={[styles.summaryLbl, { color: "#7c3aed" }]}>Pending</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: "#fee2e2" }]}>
            <Text style={[styles.summaryVal, { color: "#e53e3e" }]}>{noCoverage}</Text>
            <Text style={[styles.summaryLbl, { color: "#e53e3e" }]}>None</Text>
          </View>
        </View>

        {/* Filter */}
        <View style={[styles.filterRow, { backgroundColor: colors.secondary }]}>
          {(["all", "Oregon", "National"] as FilterType[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, { color: filter === f ? "#fff" : colors.mutedForeground }]}>
                {f === "all" ? "All Plans" : f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomInset + 100 }]}
        showsVerticalScrollIndicator={false}
        renderItem={renderPlan}
        ListHeaderComponent={
          <Text style={[styles.countText, { color: colors.mutedForeground }]}>
            {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
          </Text>
        }
      />
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
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryVal: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  summaryLbl: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  filterRow: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  filterBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 7,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  list: { padding: 16 },
  countText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  planCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planNameCol: { flex: 1, paddingRight: 8 },
  planName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
    marginBottom: 4,
  },
  planTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeTagText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  stateTag: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  covBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  covText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  planStats: {
    flexDirection: "row",
    gap: 12,
  },
  planStat: { flex: 1 },
  planStatVal: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  planStatLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  expandedContent: { marginTop: 12, gap: 10 },
  divider: { height: 1 },
  notesText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  codesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  codeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeChipText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  coverageDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  contactBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  expandIcon: {
    position: "absolute",
    bottom: 12,
    right: 14,
  },
});
