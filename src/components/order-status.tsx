import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Ready"
  | "Served";

type Props = {
  currentStatus: string;
};

const STATUS_ORDER: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Served",
];

const statusConfig: Record<
  OrderStatus,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }
> = {
  Pending: {
    icon: "time-outline",
    color: "#f59e0b",
  },
  Confirmed: {
    icon: "checkmark-circle-outline",
    color: "#3b82f6",
  },
  Preparing: {
    icon: "restaurant-outline",
    color: "#ef4444",
  },
  Ready: {
    icon: "bag-check-outline",
    color: "#10b981",
  },
  Served: {
    icon: "checkmark-done-circle-outline",
    color: "#22c55e",
  },
};

function PreparingAnimatedIcon({ color }: { color: string }) {
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 1800 }), -1);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotate.value}deg`,
      },
    ],
  }));

  return (
    <Animated.View style={style}>
      <Ionicons name="restaurant-outline" size={28} color={color} />
    </Animated.View>
  );
}

export default function OrderStatusStepper({ currentStatus }: Props) {
  if (!STATUS_ORDER.includes(currentStatus as OrderStatus)) {
    return null;
  }
  const currentIndex = STATUS_ORDER.indexOf(currentStatus as OrderStatus);

  if (currentIndex === -1) {
    console.log("Invalid status");
  }

  return (
    <View
      accessibilityLabel="Order status stepper"
      style={{
        padding: 20,
        backgroundColor: "#111827",
        borderRadius: 20,
        marginVertical: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {STATUS_ORDER.map((status, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          const config = statusConfig[status];

          return (
            <React.Fragment key={status}>
              <Animated.View
                entering={FadeInDown.delay(index * 120)}
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: completed
                      ? config.color
                      : active
                      ? "#1f2937"
                      : "#374151",
                    borderWidth: active ? 2 : 0,
                    borderColor: config.color,
                  }}
                >
                  {status === "Preparing" && active ? (
                    <PreparingAnimatedIcon color={config.color} />
                  ) : (
                    <Animated.View entering={FadeIn}>
                      <Ionicons
                        name={config.icon}
                        size={28}
                        color={completed || active ? config.color : "#9ca3af"}
                      />
                    </Animated.View>
                  )}
                </View>

                <Text
                  style={{
                    width: 70,
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: 12,
                    color: active ? "#fff" : "#9ca3af",
                    fontWeight: active ? "700" : "500",
                  }}
                >
                  {status}
                </Text>
              </Animated.View>

              {index !== STATUS_ORDER.length - 1 && (
                <View
                  style={{
                    height: 4,
                    flex: 1,
                    marginHorizontal: 6,
                    borderRadius: 999,
                    backgroundColor:
                      index < currentIndex ? "#22c55e" : "#374151",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
