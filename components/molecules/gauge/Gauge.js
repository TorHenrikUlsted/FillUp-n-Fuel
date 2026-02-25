import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import LeftArrowButton from "../../atoms/button/LeftArrowButton";
import RightArrowButton from "../../atoms/button/RightArrowButton";

const GAUGE_COLORS = {
  track: "#2a2d3a",
  trackBorder: "#3d4152",
  filled: "#00d4aa",
  filledEnd: "#00a884",
  needle: "#dc2626",
  needleHighlight: "#ef4444",
  needleShadow: "rgba(0,0,0,0.35)",
  pinCap: "#b91c1c",
  tick: "rgba(255,255,255,0.35)",
  tickMajor: "rgba(255,255,255,0.6)",
  text: "#475569",
  textMuted: "#64748b",
};

const Gauge = ({ size, strokeWidth, strokeColor, onFuelLevelChange, setIsCalculating }) => {
  const numLines = 16;
  const [angle, setAngle] = useState(-90);
  const [lineIndex, setLineIndex] = useState(numLines / 2);
  const [debouncedLineIndex, setDebouncedLineIndex] = useState(lineIndex);

  useEffect(() => {
    setIsCalculating(true);
    const timeoutId = setTimeout(() => {
      setDebouncedLineIndex(lineIndex);
      setIsCalculating(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [lineIndex]);

  useEffect(() => {
    setIsCalculating(true);
    if (onFuelLevelChange) {
      onFuelLevelChange(getFraction(debouncedLineIndex, numLines));
    }
    setIsCalculating(false);
  }, [debouncedLineIndex]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth * 2) / 2 - 8;
  const lineLengthMajor = 14;
  const lineLengthMinor = 8;
  const needleLength = radius - 4;

  const trackPath = useMemo(() => {
    const startX = cx - radius;
    const startY = cy;
    const endX = cx + radius;
    const endY = cy;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  }, [cx, cy, radius]);

  const filledPath = useMemo(() => {
    const angleRad = (angle * Math.PI) / 180;
    const endX = cx + radius * Math.cos(angleRad);
    const endY = cy + radius * Math.sin(angleRad);
    const startX = cx - radius;
    const startY = cy;
    if (angle <= -179.9) return "";
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  }, [angle, cx, cy, radius]);

  const lines = useMemo(() => {
    const linesArray = [];
    for (let i = 0; i <= numLines; i++) {
      const lineAngle = (i * Math.PI) / numLines - Math.PI;
      const isMajor = i % (numLines / 4) === 0;
      const currentLineLength = isMajor ? lineLengthMajor : lineLengthMinor;
      const x1 = cx + radius * Math.cos(lineAngle);
      const y1 = cy + radius * Math.sin(lineAngle);
      const x2 = cx + (radius - currentLineLength) * Math.cos(lineAngle);
      const y2 = cy + (radius - currentLineLength) * Math.sin(lineAngle);
      linesArray.push(
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isMajor ? GAUGE_COLORS.tickMajor : GAUGE_COLORS.tick}
          strokeWidth={isMajor ? 2.5 : 1.5}
          strokeLinecap="round"
        />
      );
    }
    return linesArray;
  }, [size, numLines, radius, cx, cy]);

  const angleRad = (angle * Math.PI) / 180;
  const needleTipX = cx + needleLength * Math.cos(angleRad);
  const needleTipY = cy + needleLength * Math.sin(angleRad);
  const needleBackAngle = ((angle + 180) * Math.PI) / 180;
  const needleBackLength = 6;
  const needleWidth = 4;
  const backPerpX = needleWidth * Math.cos(angleRad + Math.PI / 2);
  const backPerpY = needleWidth * Math.sin(angleRad + Math.PI / 2);
  const needleBackX = cx + needleBackLength * Math.cos(needleBackAngle);
  const needleBackY = cy + needleBackLength * Math.sin(needleBackAngle);
  const baseLeftX = needleBackX + backPerpX;
  const baseLeftY = needleBackY + backPerpY;
  const baseRightX = needleBackX - backPerpX;
  const baseRightY = needleBackY - backPerpY;
  const needlePath = `M ${needleTipX} ${needleTipY} L ${baseLeftX} ${baseLeftY} L ${baseRightX} ${baseRightY} Z`;

  const getFraction = (lineIndex, numLines) => {
    if (lineIndex === 0) {
      return [0, "/", 0];
    } else if (lineIndex === numLines / 4) {
      return [1, "/", 4];
    } else if (lineIndex === numLines / 2) {
      return [1, "/", 2];
    } else if (lineIndex === (numLines / 4) * 3) {
      return [3, "/", 4];
    } else if (lineIndex === numLines) {
      return [1, "/", 1];
    } else {
      const gcd = (a, b) => (b ? gcd(b, a % b) : a);
      const numerator = lineIndex;
      const denominator = numLines;
      const divisor = gcd(numerator, denominator);
      return [numerator / divisor, "/", denominator / divisor];
    }
  };

  const handlePress = (side) => {
    if (side === "left") {
      if (angle > -180) {
        setAngle((prev) => prev - 180 / numLines);
        setLineIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? numLines : next;
        });
      }
    } else if (side === "right") {
      if (angle < 0) {
        setAngle((prev) => prev + 180 / numLines);
        setLineIndex((prev) => {
          const next = prev + 1;
          return next > numLines ? 0 : next;
        });
      }
    }
  };

  const fraction = getFraction(lineIndex, numLines);
  const fractionDisplay =
    fraction[0] === 0 && fraction[2] === 0 ? "0" : `${fraction[0]}/${fraction[2]}`;

  const svgHeight = size / 1.5;

  return (
    <View style={styles.gauge}>
      <View style={[styles.gaugeTouchWrapper, { width: size, height: svgHeight }]}>
        <Svg width={size} height={svgHeight} style={styles.svg}>
        <Defs>
          <LinearGradient id="gaugeFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={GAUGE_COLORS.filledEnd} />
            <Stop offset="100%" stopColor={GAUGE_COLORS.filled} />
          </LinearGradient>
          <LinearGradient id="needleGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor={GAUGE_COLORS.pinCap} />
            <Stop offset="60%" stopColor={GAUGE_COLORS.needle} />
            <Stop offset="100%" stopColor={GAUGE_COLORS.needleHighlight} />
          </LinearGradient>
        </Defs>

        {/* Background track */}
        <Path
          d={trackPath}
          stroke={GAUGE_COLORS.trackBorder}
          strokeWidth={strokeWidth + 4}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={trackPath}
          stroke={GAUGE_COLORS.track}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Filled progress arc */}
        {filledPath ? (
          <Path
            d={filledPath}
            stroke="url(#gaugeFill)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        ) : null}

        {/* Tick marks */}
        {lines}

        {/* Needle shadow (slightly offset) */}
        <Path
          d={needlePath}
          fill={GAUGE_COLORS.needleShadow}
          transform={`translate(2, 2)`}
        />
        {/* Needle — modern red visor pin */}
        <Path d={needlePath} fill="url(#needleGradient)" />
        {/* Center cap — visor pin head */}
        <Circle cx={cx} cy={cy} r={10} fill={GAUGE_COLORS.trackBorder} />
        <Circle cx={cx} cy={cy} r={7} fill={GAUGE_COLORS.pinCap} />
        <Circle cx={cx} cy={cy} r={4} fill={GAUGE_COLORS.needleHighlight} />
      </Svg>
        <Pressable
          style={styles.gaugeTouchLeft}
          onPress={() => handlePress("left")}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Decrease fuel level"
        />
        <Pressable
          style={styles.gaugeTouchRight}
          onPress={() => handlePress("right")}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Increase fuel level"
        />
      </View>

      <View style={styles.labelsRow}>
        <Text style={styles.label}>E</Text>
        <Text style={styles.fraction}>{fractionDisplay}</Text>
        <Text style={styles.label}>F</Text>
      </View>

      <View style={styles.pressableContainer}>
        <LeftArrowButton onPress={() => handlePress("left")} />
        <RightArrowButton onPress={() => handlePress("right")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gauge: {
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeTouchWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  svg: {
    marginBottom: 0,
  },
  gaugeTouchLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "50%",
    height: "100%",
  },
  gaugeTouchRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "50%",
    height: "100%",
  },
  labelsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 200,
    marginTop: -44,
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: GAUGE_COLORS.textMuted,
    letterSpacing: 1,
  },
  fraction: {
    fontSize: 22,
    fontWeight: "600",
    color: GAUGE_COLORS.text,
    fontVariant: ["tabular-nums"],
    includeFontPadding: false,
  },
  pressableContainer: {
    flexDirection: "row",
    gap: 24,
  },
});

export default React.memo(Gauge);
