import { Alert, Platform } from "react-native";

export const utilsConfirm = ({
  title = "Confirm",
  message,
  isDestructiveStyle = false,
  onConfirm,
}: {
  title?: string;
  message: string;
  isDestructiveStyle?: boolean;
  onConfirm: () => void;
}) => {
  Platform.OS == 'web' && confirm(message) ? onConfirm() : null;
  Alert.alert(title, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: isDestructiveStyle ? "Delete" : "Confirm",
      style: isDestructiveStyle ? "destructive" : "default",
      onPress: onConfirm,
    },
  ]);
};
