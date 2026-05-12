import { Alert } from "react-native";

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
  confirm(message) ? onConfirm() : null;
  Alert.alert(title, message, [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      style: isDestructiveStyle ? "destructive" : "default",
      onPress: onConfirm,
    },
  ]);
};
