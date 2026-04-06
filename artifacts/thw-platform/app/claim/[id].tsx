import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { ClaimStatus } from "@/types";
import { getCPTCode, getZCode } from "@/data/cptCodes";

const STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "#6b7280", bg: "#f3f4f6" },
  submitted: { label: "Submitted", color: "#d97706", bg: "#fef3c7" },
  approved: { label: "Approved", color: "#16a34a", bg: "#dcfce7" },
  denied: { label: "Denied", color: "#e53e3e", bg: "#fee2e2" },
  appealed: { label: "Appealing", color: "#7c3aed", bg: "#ede9fe" },
};

export default function ClaimDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { claims, updateClaim, deleteClaim } = useApp();

  const claim = claims.find(c => c.id === id);

  if (!claim) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Claim not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[claim.status];

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Submit Claim", "Submit this claim to the insurance plan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        onPress: () => updateClaim(claim.id, { status: "submitted" }),
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Claim", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteClaim(claim.id);
          router.back();
        },
      },
    ]);
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: statusConfig.bg }]}>
        <Text style={[styles.statusLabel, { color: statusConfig.color }]}>{statusConfig.label}</Text>
        {claim.status === "denied" && (
          <Text style={[styles.denialReason, { color: statusConfig.color }]}>
            {claim.denialReason}
          </Text>
        )}
      </View>

      {/* Client Info */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>CLIENT</Text>
        <Text style={[styles.clientName, { color: colors.foreground }]}>{claim.clientName}</Text>
        <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
          Service date: {formatDate(claim.dateOfService)}
        </Text>
        <Text style={[styles.planText, { color: colors.mutedForeground }]}>{claim.insurancePlan}</Text>
      </View>

      {/* Billing */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>BILLING</Text>
        <View style={styles.billingRow}>
          <View>
            <Text style={[styles.billingLabel, { color: colors.mutedForeground }]}>Billed Amount</Text>
            <Text style={[styles.billingAmount, { color: colors.foreground }]}>${claim.billedAmount}</Text>
          </View>
          {claim.paidAmount !== undefined && (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.billingLabel, { color: colors.mutedForeground }]}>Paid Amount</Text>
              <Text style={[styles.billingAmount, { color: colors.success }]}>${claim.paidAmount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* CPT Codes */}
      {claim.cptCodes.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>CPT CODES</Text>
          {claim.cptCodes.map(code => {
            const info = getCPTCode(code);
            return (
              <View key={code} style={[styles.codeRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.codeBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
                </View>
                <View style={styles.codeInfo}>
                  <Text style={[styles.codeDesc, { color: colors.foreground }]}>
                    {info?.description || code}
                  </Text>
                  {info?.hedisRelevant && (
                    <View style={[styles.hedisBadge, { backgroundColor: colors.primary + "18" }]}>
                      <Text style={[styles.hedisText, { color: colors.primary }]}>
                        HEDIS: {info.hedisCategory}
                      </Text>
                    </View>
                  )}
                  {info && (
                    <Text style={[styles.reimbText, { color: colors.mutedForeground }]}>
                      Avg: ${info.avgReimbursement} · Risk: {info.denialRisk}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Z Codes */}
      {claim.zCodes.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Z CODES (SDOH)</Text>
          {claim.zCodes.map(code => {
            const info = getZCode(code);
            return (
              <View key={code} style={[styles.codeRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.codeBadge, { backgroundColor: "#f3e8ff" }]}>
                  <Text style={[styles.codeText, { color: "#7c3aed" }]}>{code}</Text>
                </View>
                <View style={styles.codeInfo}>
                  <Text style={[styles.codeDesc, { color: colors.foreground }]}>
                    {info?.description || code}
                  </Text>
                  {info && (
                    <Text style={[styles.reimbText, { color: colors.mutedForeground }]}>
                      SDOH: {info.sdohCategory}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* HEDIS Categories */}
      {claim.hedisCategories.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>HEDIS IMPACT</Text>
          <View style={styles.hedisTagRow}>
            {claim.hedisCategories.map(cat => (
              <View key={cat} style={[styles.hedisTag, { backgroundColor: colors.primary + "15" }]}>
                <Feather name="activity" size={11} color={colors.primary} />
                <Text style={[styles.hedisTagText, { color: colors.primary }]}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Notes */}
      {claim.notes && (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>NOTES</Text>
          <Text style={[styles.notesText, { color: colors.foreground }]}>{claim.notes}</Text>
        </View>
      )}

      {/* Appeal Notes */}
      {claim.appealNotes && (
        <View style={[styles.section, { backgroundColor: "#ede9fe", borderColor: "#7c3aed30" }]}>
          <Text style={[styles.sectionTitle, { color: "#7c3aed" }]}>APPEAL NOTES</Text>
          <Text style={[styles.notesText, { color: "#4c1d95" }]}>{claim.appealNotes}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {claim.status === "draft" && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Feather name="send" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Submit Claim</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: colors.destructive }]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
          <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: { fontSize: 16 },
  backLink: { fontSize: 16, fontFamily: "Inter_500Medium" },
  statusBanner: {
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  denialReason: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  dateText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  planText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billingLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  billingAmount: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
  },
  codeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  codeInfo: { flex: 1, gap: 4 },
  codeDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  hedisBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  hedisText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  reimbText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  hedisTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  hedisTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  hedisTagText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  notesText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  actions: { gap: 10, marginTop: 8 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  deleteBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
