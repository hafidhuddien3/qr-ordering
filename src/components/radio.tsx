import { View } from "react-native";

export function Radio({ selected }: { selected: boolean }) {
    const color = 'green'
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: selected ? color : "#999",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected && (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  );
}