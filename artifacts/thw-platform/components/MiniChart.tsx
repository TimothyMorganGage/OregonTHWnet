import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polyline, Circle, Line } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface MiniChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  filled?: boolean;
}

export function MiniChart({ data, color, width = 120, height = 48, filled }: MiniChartProps) {
  const colors = useColors();
  const chartColor = color || colors.primary;
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;

  const points = data.map((val, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + ((max - val) / range) * (height - pad * 2);
    return `${x},${y}`;
  });

  const polylinePoints = points.join(" ");

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={chartColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((_, i) => {
          const [x, y] = points[i].split(",").map(Number);
          return i === data.length - 1 ? (
            <Circle key={i} cx={x} cy={y} r={3} fill={chartColor} />
          ) : null;
        })}
      </Svg>
    </View>
  );
}
