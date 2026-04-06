import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { DenialRecord } from "@/types";

const STATUS_CONFIG = {
  open: { label: "Open", color: "#e53e3e", bg: "#fee2e2", icon: "alert-circle" as const },
  appealing: { label: "Appealing", color: "#7c3aed", bg: "#ede9fe", icon: "refresh-cw" as const },
  won: { label: "Won", color: "#16a34a", bg: "#dcfce7", icon: "check-circle" as const },
  lost: { label: "Lost", color: "#6b7280", bg: "#f3f4f6", icon: "x-circle" as const },
};

export default function DenialsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { denials, updateDenial } = useApp();
  const [filter, setFilter] = useState<"all" | "open" | "appealing" | "resolved">("all");

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const filtered = denials.filter(d => {
    if (filter === "all") return true;
    if (filter === "open") return d.status === "open";
    if (filter === "appealing") return d.status === "appealing";
    if (filter === "resolved") return d.status === "won" || d.status === "lost";
    return true;
  });

  const openCount = denials.filter(d => d.status === "open").length;
  const appealingCount = denials.filter(d => d.status === "appealing").length;
  const wonCount = denials.filter(d => d.status === "won").length;

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const dl = new Date(deadline);
    const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleStartAppeal = (denial: DenialRecord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Start Appeal",
      `Begin appeal process for claim against ${denial.insurancePlan}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Appeal",
          onPress: () => updateDenial(denial.id, { status: "appealing" }),
        },
      ]
    );
  };

  const handleMarkWon = (denial: DenialRecord) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Mark as Won",
      "Has this appeal been resolved in your favor?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Won",
          onPress: () => updateDenial(denial.id, { status: "won" }),
        },
      ]
    );
  };

  const renderDenial = ({ item }: { item: DenialRecord }) => {
    const statusConfig = STATUS_CONFIG[item.status];
    const daysUntil = getDaysUntilDeadline(item.appealDeadline);
    const isUrgent = daysUntil <= 7 && (item.status === "open" || item.status === "appealing");

    return (
      <View
        style={[
          styles.denialCard,
          {
            backgroundColor: colors.card,
            borderColor: isUrgent ? "#e53e3e" : colors.border,
            borderLeftWidth: isUrgent ? 3 : 1,
            borderLeftColor: isUrgent ? "#e53e3e" : colors.border,
          },
        ]}
      >
        {isUrgent && (
          <View style={[styles.urgentBanner, { backgroundColor: "#fee2e2" }]}>
            <Feather name="alert-triangle" size={12} color="#e53e3e" />
            <Text style={[styles.urgentText, { color: "#e53e3e" }]}>
              Appeal deadline in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
            </Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <Text style={[styles.clientName, { color: colors.foreground }]}>{item.clientName}</Text>
            <Text style={[styles.planName, { color: colors.mutedForeground }]}>{item.insurancePlan}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Feather name={statusConfig.icon} size={11} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          </View>
        </View>

        <View style={[styles.reasonBox, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.reasonLabel, { color: colors.mutedForeground }]}>Denial Reason</Text>
          <Text style={[styles.reasonText, { color: colors.foreground }]}>{item.denialReason}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Denied</Text>
            <Text style={[styles.metaValue, { color: colors.foreground }]}>
              {new Date(item.denialDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Deadline</Text>
            <Text style={[styles.metaValue, { color: isUrgent ? "#e53e3e" : colors.foreground }]}>
              {new Date(item.appealDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Amount</Text>
            <Text style={[styles.metaValue, { color: colors.foreground }]}>
              ${item.billedAmount}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Codes</Text>
            <Text style={[styles.metaValue, { color: colors.primary }]}>
              {item.cptCodes.join(", ")}
            </Text>
          </View>
        </View>

        {item.appealNotes && (
          <Text style={[styles.appealNotes, { color: colors.mutedForeground }]} numberOfLines={2}>
            {item.appealNotes}
          </Text>
        )}

        {/* Actions */}
        {item.status === "open" && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => handleStartAppeal(item)}
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Start Appeal</Text>
          </TouchableOpacity>
        )}
        {item.status === "appealing" && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#16a34a" }]}
            onPress={() => handleMarkWon(item)}
            activeOpacity={0.8}
          >
            <Feather name="check" size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Mark Appeal Won</Text>
          </TouchableOpacity>
        )}
      </View>
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
        <Text style={[styles.title, { color: colors.foreground }]}>Denial Management</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: "#fee2e2" }]}>
            <Text style={[styles.statVal, { color: "#e53e3e" }]}>{openCount}</Text>
            <Text style={[styles.statLbl, { color: "#e53e3e" }]}>Open</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: "#ede9fe" }]}>
            <Text style={[styles.statVal, { color: "#7c3aed" }]}>{appealingCount}</Text>
            <Text style={[styles.statLbl, { color: "#7c3aed" }]}>Appealing</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: "#dcfce7" }]}>
            <Text style={[styles.statVal, { color: "#16a34a" }]}>{wonCount}</Text>
            <Text style={[styles.statLbl, { color: "#16a34a" }]}>Won</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.statVal, { color: colors.foreground }]}>{denials.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Total</Text>
          </View>
        </View>

        {/* Filter */}
        <View style={[styles.filterRow, { backgroundColor: colors.secondary }]}>
          {([
            { key: "all", label: "All" },
            { key: "open", label: "Open" },
            { key: "appealing", label: "Appealing" },
            { key: "resolved", label: "Resolved" },
          ] as const).map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, filter === f.key && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, { color: filter === f.key ? "#fff" : colors.mutedForeground }]}>
                {f.label}
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
        renderItem={renderDenial}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="shield" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No denials in this view</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Track and appeal denied claims here
            </Text>
          </View>
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
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
  statVal: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  statLbl: {
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
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  list: { padding: 16, gap: 10 },
  denialCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  urgentBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  clientInfo: { flex: 1 },
  clientName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  planName: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  reasonBox: {
    borderRadius: 8,
    padding: 10,
    gap: 3,
  },
  reasonLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
  },
  metaItem: { flex: 1 },
  metaLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  appealNotes: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
    fontStyle: "italic",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
