import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Claim, ClaimStatus } from "@/types";

const STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; icon: string }> = {
  draft: { label: "Draft", color: "#6b7280", icon: "edit-3" },
  submitted: { label: "Submitted", color: "#d97706", icon: "send" },
  approved: { label: "Approved", color: "#2d8a5e", icon: "check-circle" },
  denied: { label: "Denied", color: "#e53e3e", icon: "x-circle" },
  appealed: { label: "Appealing", color: "#7c3aed", icon: "refresh-cw" },
};

interface ClaimCardProps {
  claim: Claim;
  onPress: () => void;
}

export function ClaimCard({ claim, onPress }: ClaimCardProps) {
  const colors = useColors();
  const statusConfig = STATUS_CONFIG[claim.status];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatCurrency = (amount: number) =>
    "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0 });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {claim.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </Text>
          </View>
          <View style={styles.nameInfo}>
            <Text style={[styles.clientName, { color: colors.foreground }]}>{claim.clientName}</Text>
            <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
              {formatDate(claim.dateOfService)}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + "18" }]}>
          <Feather name={statusConfig.icon as any} size={11} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <View style={styles.codeRow}>
          {claim.cptCodes.slice(0, 3).map(code => (
            <View key={code} style={[styles.codePill, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
            </View>
          ))}
          {claim.zCodes.slice(0, 2).map(code => (
            <View key={code} style={[styles.codePill, { backgroundColor: "#f3e8ff" }]}>
              <Text style={[styles.codeText, { color: "#7c3aed" }]}>{code}</Text>
            </View>
          ))}
        </View>
        <View style={styles.amountRow}>
          <Text style={[styles.billedLabel, { color: colors.mutedForeground }]}>Billed</Text>
          <Text style={[styles.billedAmount, { color: colors.foreground }]}>
            {formatCurrency(claim.billedAmount)}
          </Text>
        </View>
      </View>

      {claim.insurancePlan && (
        <Text style={[styles.planText, { color: colors.mutedForeground }]}>
          {claim.insurancePlan}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  nameInfo: { flex: 1 },
  clientName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    flex: 1,
  },
  codePill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  codeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  amountRow: { alignItems: "flex-end" },
  billedLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  billedAmount: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  planText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
  },
});
