import { StyleSheet } from 'react-native';

import QRScanner from "@/src/screens/QRScanner";

export default function ModalScreen() {
  return (
    <QRScanner />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
