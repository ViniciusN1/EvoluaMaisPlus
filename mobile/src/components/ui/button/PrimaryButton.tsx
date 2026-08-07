import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import {
  Colors,
  spacing,
} from "../../../theme";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,

        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,

    backgroundColor: Colors.primary,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",
  },

  pressed: {
    opacity: 0.85,
  },

  text: {
    color: Colors.white,

    fontSize: 17,

    fontWeight: "700",
  },
});