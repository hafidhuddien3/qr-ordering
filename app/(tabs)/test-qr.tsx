import { Image, StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ScrollView, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <ScrollView
      style={{
        padding: 32,
        backgroundColor: "white",
      }}
    >
      <ThemedText type="title">Test QR</ThemedText>
      <View style={{ height: 16 }} />
      <ThemedText type="subtitle" style={{textAlign: 'center'}}>Table 1</ThemedText>
      <View style={styles.card}>
        <Image
          source={require("../../test-assets/qr-images/ipottableT001.jpeg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <ThemedText type="subtitle" style={{textAlign: 'center'}}>Table 2</ThemedText>
      <View style={styles.card}>
        <Image
          source={require("../../test-assets/qr-images/ipottableT002.jpeg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <ThemedText type="subtitle" style={{textAlign: 'center'}}>Invalid QR</ThemedText>
      <View style={styles.card}>
        <Image
          source={require("../../test-assets/qr-images/random.jpeg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    // flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    marginTop: 5,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#f0f0f0",
  }
});
