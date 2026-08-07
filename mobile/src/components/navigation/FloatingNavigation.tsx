import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  ArrowLeft,
  House,
} from "lucide-react-native";

import { router } from "expo-router";

type FloatingNavigationProps = {
  showBack?: boolean;
  showHome?: boolean;
};

export default function FloatingNavigation({
  showBack = true,
  showHome = true,
}: FloatingNavigationProps) {
  return (
    <View
      pointerEvents="box-none"
      style={styles.wrapper}
    >
      <View style={styles.container}>
        {showBack && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace(
                  "/(tabs)/home",
                );
              }
            }}
          >
            <ArrowLeft
              size={22}
              color="#FFFFFF"
              strokeWidth={2.4}
            />
          </Pressable>
        )}

        {showHome && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              router.replace(
                "/(tabs)/home",
              );
            }}
          >
            <House
              size={22}
              color="#FFFFFF"
              strokeWidth={2.4}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom:
      Platform.OS === "ios"
        ? 22
        : 16,
    alignItems: "center",
    zIndex: 1000,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    paddingHorizontal: 8,
    paddingVertical: 8,

    borderRadius: 999,

    backgroundColor:
      "rgba(15, 23, 42, 0.72)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.18)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 12,
  },

  button: {
    width: 46,
    height: 46,

    borderRadius: 23,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.10)",
  },

  pressed: {
    opacity: 0.55,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },
});