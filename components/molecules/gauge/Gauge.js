import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Svg, { Path, Line } from "react-native-svg";
import LeftArrowButton from "../../atoms/button/LeftArrowButton";
import RightArrowButton from "../../atoms/button/RightArrowButton";

const Gauge = ({ size, strokeWidth, strokeColor, onFuelLevelChange, setIsCalculating }) => {
  const numLines = 16;
  const [angle, setAngle] = useState(-90);
  const [lineIndex, setLineIndex] = useState(numLines / 2);
  const [debouncedLineIndex, setDebouncedLineIndex] = useState(lineIndex);

  useEffect(() => {
    setIsCalculating(true)
    // Debounce the onFuelLevelChange function call
    const timeoutId = setTimeout(() => {
      setDebouncedLineIndex(lineIndex);
      setIsCalculating(false)
    }, 500); // debounce time is 500ms
    

    return () => clearTimeout(timeoutId);
                                          // if useEffect is run again within 500ms
  }, [lineIndex]);

  useEffect(() => {
    setIsCalculating(true)
    // Call the onFuelLevelChange function whenever the debouncedLineIndex value changes
    if (onFuelLevelChange) {
      onFuelLevelChange(getFraction(debouncedLineIndex, numLines));
    }
    
    setIsCalculating(false)
  }, [debouncedLineIndex]);

  const radius = (size - strokeWidth) / 2;
  const lineLength = 25; // length of longer lines

  const lines = [];
  for (let i = 0; i <= numLines; i++) {
    const lineAngle = (i * Math.PI) / numLines - Math.PI;
    const x1 = size / 2 + radius * Math.cos(lineAngle);
    const y1 = size / 2 + radius * Math.sin(lineAngle);
    const currentLineLength = i % (numLines / 4) === 0 ? lineLength : 10; // make every fourth line longer
    const x2 = size / 2 + (radius - currentLineLength) * Math.cos(lineAngle);
    const y2 = size / 2 + (radius - currentLineLength) * Math.sin(lineAngle);
    lines.push(
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

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
      const gcd = (a, b) => {
        if (!b) {
          return a;
        }
        return gcd(b, a % b);
      };
      const numerator = lineIndex;
      const denominator = numLines;
      const divisor = gcd(numerator, denominator);
      return [numerator / divisor, "/", denominator / divisor];
    }
  };

  const handlePress = (side) => {

    if (side === "left") {
      if (angle > -180) {
        setAngle((prevAngle) => prevAngle - 180 / numLines);
        setLineIndex((prevLineIndex) => {
          const newLineIndex = prevLineIndex - 1;
          if (newLineIndex < 0) {
            return numLines;
          } else {
            return newLineIndex;
          }
        });
      }
    } else if (side === "right") {
      if (angle < 0) {
        setAngle((prevAngle) => prevAngle + 180 / numLines);
        setLineIndex((prevLineIndex) => {
          const newLineIndex = prevLineIndex + 1;
          if (newLineIndex > numLines) {
            return 0;
          } else {
            return newLineIndex;
          }
        });
      }
    }
  };

  return (
    <View style={styles.gauge}>
      <Svg width={size} height={size / 1.5}>
        <Path
          d={`M${size / 2} ${size / 2} L${
            size / 2 + radius * Math.cos((angle * Math.PI) / 180)
          } ${size / 2 + radius * Math.sin((angle * Math.PI) / 180)}`}
          stroke="#f00"
          strokeWidth={strokeWidth}
        />
        {lines}
      </Svg>

      <View style={styles.fuelLevel}>
        <Text style={styles.empty}>E</Text>
        <Text style={styles.full}>F</Text>
      </View>

      <Text>{getFraction(lineIndex, numLines)}</Text>

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
  },
  tankLevel: {
    color: "black",
    fontSize: 15,
  },
  fuelLevel: {
    flexDirection: "row",
    marginTop: -70,
  },
  empty: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1 / 2,
  },
  full: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1 / 2,
  },
  pressableContainer: {
    flexDirection: "row",
  },
});

export default Gauge;
