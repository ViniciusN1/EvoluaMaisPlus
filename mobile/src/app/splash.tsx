import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

useEffect(() => {
  Animated.parallel([
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }),

    Animated.spring(logoScale, {
      toValue: 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }),

    Animated.timing(contentTranslateY, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }),
  ]).start();

  const timer = setTimeout(() => {
    router.replace("/login");
  }, 2500);

  return () => clearTimeout(timer);
}, [contentTranslateY, logoOpacity, logoScale]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { translateY: contentTranslateY },
            ],
          },
        ]}
      >
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>EVOLUA MAIS</Text>

        <Text style={styles.subtitle}>
          Sua evolução, todos os dias
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.loadingTrack}>
          <Animated.View style={styles.loadingBar} />
        </View>

        <Text style={styles.loadingText}>
          Preparando sua experiência...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071C47",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    alignItems: "center",
  },

  logo: {
    width: 170,
    height: 170,
    borderRadius: 38,
    marginBottom: 28,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 2,
  },

  subtitle: {
    color: "#BAE6FD",
    fontSize: 16,
    marginTop: 10,
  },

  footer: {
    position: "absolute",
    left: 32,
    right: 32,
    bottom: 48,
    alignItems: "center",
  },

  loadingTrack: {
    width: "100%",
    maxWidth: 240,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.20)",
    overflow: "hidden",
  },

  loadingBar: {
    width: "70%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#38BDF8",
  },

  loadingText: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 12,
  },
});