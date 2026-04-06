import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { THW_CPT_CODES, THW_Z_CODES } from "@/data/cptCodes";
import { INSURANCE_PLANS } from "@/data/sampleData";
import { Claim } from "@/types";

export default function NewClaimScreen() {
  const colors = useColors();
  const router = useRouter();
  const { addClaim } = useApp();

  const [clientName, setClientName] = useState("");
  const [dateOfService, setDateOfService] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedCPT, setSelectedCPT] = useState<string[]>([]);
  const [selectedZ, setSelectedZ] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"info" | "cpt" | "z" | "review">("info");

  const toggleCPT = (code: string) => {
    Haptics.selectionAsync();
    setSelectedCPT(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleZ = (code: string) => {
    Haptics.selectionAsync();
    setSelectedZ(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const getTotalBilled = () => {
    return selectedCPT.reduce((sum, code) => {
      const info = THW_CPT_CODES.find(c => c.code === code);
      return sum + (info?.avgReimbursement || 0);
    }, 0);
  };

  const getHEDISCategories = () => {
    const cats = new Set<string>();
    selectedCPT.forEach(code => {
      const info = THW_CPT_CODES.find(c => c.code === code);
      if (info?.hedisCategory) cats.add(info.hedisCategory);
    });
    return Array.from(cats);
  };

  const handleSave = () => {
    if (!clientName.trim()) {
      Alert.alert("Required", "Please enter client name");
      return;
    }
    if (selectedCPT.length === 0) {
      Alert.alert("Required", "Please select at least one CPT code");
      return;
    }

    const newClaim: Claim = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      clientId: Date.now().toString(),
      clientName: clientName.trim(),
      dateOfService,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      cptCodes: selectedCPT,
      zCodes: selectedZ,
      insurancePlan: selectedPlan,
      billedAmount: getTotalBilled(),
      notes: notes.trim(),
      hedisCategories: getHEDISCategories(),
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addClaim(newClaim).then(() => {
      router.back();
    });
  };

  const renderStepIndicator = () => (
    <View style={styles.stepRow}>
      {(["info", "cpt", "z", "review"] as const).map((s, i) => (
        <View key={s} style={styles.stepItem}>
          <View
            style={[
              styles.stepDot,
              {
                backgroundColor: step === s ? colors.primary : s === "info" || (s === "cpt" && step !== "info") || (s === "z" && (step === "z" || step === "review")) || (s === "review" && step === "review")
                  ? colors.primary
                  : colors.border,
              },
            ]}
          >
            <Text style={styles.stepDotText}>{i + 1}</Text>
          </View>
          {i < 3 && <View style={[styles.stepLine, { backgroundColor: colors.border }]} />}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepIndicator()}

        {step === "info" && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Client Information</Text>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Client Name *</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
                value={clientName}
                onChangeText={setClientName}
                placeholder="Full name"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Date of Service</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
                value={dateOfService}
                onChangeText={setDateOfService}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Insurance Plan</Text>
              <ScrollView style={styles.planScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {INSURANCE_PLANS.filter(p => p.state === "Oregon").map(plan => (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => {
                      setSelectedPlan(plan.name);
                      Haptics.selectionAsync();
                    }}
                    style={[
                      styles.planOption,
                      {
                        backgroundColor: selectedPlan === plan.name ? colors.primary : colors.card,
                        borderColor: selectedPlan === plan.name ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.planOptionText, { color: selectedPlan === plan.name ? "#fff" : colors.foreground }]}>
                      {plan.name}
                    </Text>
                    <Text style={[styles.planDenialRate, { color: selectedPlan === plan.name ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
                      {plan.denialRate}% denial rate
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Notes</Text>
              <TextInput
                style={[styles.textarea, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Service notes, SDOH observations..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}

        {step === "cpt" && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>CPT Codes</Text>
            <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
              Select all billable THW services provided
            </Text>
            {THW_CPT_CODES.filter(c => c.code !== "Z56.0").map(code => {
              const selected = selectedCPT.includes(code.code);
              return (
                <TouchableOpacity
                  key={code.code}
                  onPress={() => toggleCPT(code.code)}
                  style={[
                    styles.codeOption,
                    {
                      backgroundColor: selected ? colors.primary + "12" : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <View style={styles.codeOptionHeader}>
                    <View style={[styles.codeTag, { backgroundColor: selected ? colors.primary : colors.secondary }]}>
                      <Text style={[styles.codeTagText, { color: selected ? "#fff" : colors.primary }]}>{code.code}</Text>
                    </View>
                    <View style={styles.codeOptionMeta}>
                      <Text style={[styles.codeOptionAmt, { color: colors.foreground }]}>${code.avgReimbursement}</Text>
                      <View style={[
                        styles.riskBadge,
                        { backgroundColor: code.denialRisk === "low" ? "#dcfce7" : code.denialRisk === "medium" ? "#fef3c7" : "#fee2e2" }
                      ]}>
                        <Text style={[
                          styles.riskText,
                          { color: code.denialRisk === "low" ? "#16a34a" : code.denialRisk === "medium" ? "#d97706" : "#e53e3e" }
                        ]}>
                          {code.denialRisk} risk
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.codeOptionDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {code.description}
                  </Text>
                  {code.hedisRelevant && code.hedisCategory && (
                    <View style={[styles.hedhisTag, { backgroundColor: colors.primary + "15" }]}>
                      <Feather name="activity" size={10} color={colors.primary} />
                      <Text style={[styles.hedisTagText, { color: colors.primary }]}>HEDIS: {code.hedisCategory}</Text>
                    </View>
                  )}
                  {selected && (
                    <View style={styles.selectedCheck}>
                      <Feather name="check-circle" size={18} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === "z" && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Z Codes (SDOH)</Text>
            <Text style={[styles.stepSubtitle, { color: colors.mutedForeground }]}>
              Document social determinants of health factors
            </Text>
            {THW_Z_CODES.map(code => {
              const selected = selectedZ.includes(code.code);
              return (
                <TouchableOpacity
                  key={code.code}
                  onPress={() => toggleZ(code.code)}
                  style={[
                    styles.codeOption,
                    {
                      backgroundColor: selected ? "#f3e8ff" : colors.card,
                      borderColor: selected ? "#7c3aed" : colors.border,
                    },
                  ]}
                  activeOpacity={0.75}
                >
                  <View style={styles.codeOptionHeader}>
                    <View style={[styles.codeTag, { backgroundColor: selected ? "#7c3aed" : "#f3e8ff" }]}>
                      <Text style={[styles.codeTagText, { color: selected ? "#fff" : "#7c3aed" }]}>{code.code}</Text>
                    </View>
                    <View style={[styles.sdohBadge, { backgroundColor: "#ede9fe" }]}>
                      <Text style={[styles.sdohText, { color: "#7c3aed" }]}>{code.sdohCategory}</Text>
                    </View>
                  </View>
                  <Text style={[styles.codeOptionDesc, { color: colors.mutedForeground }]}>
                    {code.description}
                  </Text>
                  {selected && (
                    <View style={styles.selectedCheck}>
                      <Feather name="check-circle" size={18} color="#7c3aed" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {step === "review" && (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Review Claim</Text>

            <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: colors.mutedForeground }]}>CLIENT</Text>
              <Text style={[styles.reviewVal, { color: colors.foreground }]}>{clientName}</Text>
              <Text style={[styles.reviewSub, { color: colors.mutedForeground }]}>{dateOfService}</Text>
              <Text style={[styles.reviewSub, { color: colors.mutedForeground }]}>{selectedPlan || "No plan selected"}</Text>
            </View>

            <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: colors.mutedForeground }]}>ESTIMATED BILLING</Text>
              <Text style={[styles.reviewAmount, { color: colors.primary }]}>${getTotalBilled()}</Text>
            </View>

            <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: colors.mutedForeground }]}>CPT CODES ({selectedCPT.length})</Text>
              <View style={styles.reviewCodes}>
                {selectedCPT.map(c => (
                  <View key={c} style={[styles.reviewCode, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.reviewCodeText, { color: colors.primary }]}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>

            {selectedZ.length > 0 && (
              <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.reviewSectionTitle, { color: colors.mutedForeground }]}>Z CODES ({selectedZ.length})</Text>
                <View style={styles.reviewCodes}>
                  {selectedZ.map(c => (
                    <View key={c} style={[styles.reviewCode, { backgroundColor: "#f3e8ff" }]}>
                      <Text style={[styles.reviewCodeText, { color: "#7c3aed" }]}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {getHEDISCategories().length > 0 && (
              <View style={[styles.reviewCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
                <Text style={[styles.reviewSectionTitle, { color: colors.primary }]}>HEDIS IMPACT</Text>
                {getHEDISCategories().map(cat => (
                  <View key={cat} style={styles.hedisImpactRow}>
                    <Feather name="activity" size={12} color={colors.primary} />
                    <Text style={[styles.hedisImpactText, { color: colors.primary }]}>{cat}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Nav Buttons */}
      <View style={[styles.navBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step !== "info" && (
          <TouchableOpacity
            style={[styles.navBtn, { borderColor: colors.border }]}
            onPress={() => {
              const steps = ["info", "cpt", "z", "review"] as const;
              const idx = steps.indexOf(step);
              if (idx > 0) setStep(steps[idx - 1]);
            }}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
            <Text style={[styles.navBtnText, { color: colors.foreground }]}>Back</Text>
          </TouchableOpacity>
        )}
        {step !== "review" ? (
          <TouchableOpacity
            style={[styles.navBtnPrimary, { backgroundColor: colors.primary, flex: 1 }]}
            onPress={() => {
              const steps = ["info", "cpt", "z", "review"] as const;
              const idx = steps.indexOf(step);
              if (idx < steps.length - 1) setStep(steps[idx + 1]);
            }}
          >
            <Text style={styles.navBtnPrimaryText}>Continue</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtnPrimary, { backgroundColor: colors.primary, flex: 1 }]}
            onPress={handleSave}
          >
            <Feather name="save" size={16} color="#fff" />
            <Text style={styles.navBtnPrimaryText}>Save Draft</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 120 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  stepLine: {
    flex: 1,
    height: 1,
  },
  stepContent: { gap: 14 },
  stepTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginTop: -6,
  },
  field: { gap: 6 },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    minHeight: 80,
    textAlignVertical: "top",
  },
  planScroll: { maxHeight: 240 },
  planOption: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 6,
  },
  planOptionText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  planDenialRate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  codeOption: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 6,
    position: "relative",
  },
  codeOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  codeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeTagText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  codeOptionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  codeOptionAmt: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  riskBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  riskText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  codeOptionDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  hedhisTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  hedisTagText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  sdohBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: "auto",
  },
  sdohText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  selectedCheck: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  reviewSectionTitle: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reviewVal: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  reviewSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  reviewAmount: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  reviewCodes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  reviewCode: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reviewCodeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  hedisImpactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hedisImpactText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    padding: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  navBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  navBtnPrimaryText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
