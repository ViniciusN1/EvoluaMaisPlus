import {
  StyleSheet,
  Text,
} from "react-native";

import {
  Colors,
  Typography,
} from "../../../theme";

type Props = {
  title: string;
};

export default function SectionTitle({
  title,
}: Props) {
  return (
    <Text style={styles.title}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.text,

    ...Typography.subtitle,

    marginBottom: 16,
  },
});