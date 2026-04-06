import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string;
  subLabel?: string;
  accent?: boolean;
  color?: string;
}

export function StatCard({ label, value, subLabel, accent, color }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: accent ? (color || colors.primary) : colors.card,
          borderColor: colors.border,
          borderWidth: accent ? 0 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.value,
          { color: accent ? colors.primaryForeground : (color || colors.primary) },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          { color: accent ? "rgba(255,255,255,0.85)" : colors.mutedForeground },
        ]}
      >
        {label}
      </Text>
      {subLabel && (
        <Text
          style={[
            styles.subLabel,
            { color: accent ? "rgba(255,255,255,0.7)" : colors.mutedForeground },
          ]}
        >
          {subLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 80,
    justifyContent: "center",
  },
  value: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
});
