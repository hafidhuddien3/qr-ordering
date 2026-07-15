import { Platform } from "react-native";
import { WebView } from "react-native-webview";

const url = "https://fast-api-1-eight.vercel.app?dbName=qr_ordering";

export default function AIPage() {
  if (Platform.OS === "web") {
    return (
      <iframe
        src={url}
        style={{
          width: "100%",
          height: "85vh",
          border: "none",
        }}
        title="Example"
      />
    );
  }

  return (
    <WebView
      source={{ uri: url }}
      style={{ flex: 1 }}
    />
  );
}
