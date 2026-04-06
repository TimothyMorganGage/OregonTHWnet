import React from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ value, max = 100, color, height = 6 }: ProgressBarProps) {
  const colors = useColors();
  const pct = Math.min((value / max) * 100, 100);

  return (
    <View style={[styles.track, { backgroundColor: colors.muted, height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${pct}%` as any,
            backgroundColor: color || colors.primary,
            height,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 100,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    borderRadius: 100,
  },
});
