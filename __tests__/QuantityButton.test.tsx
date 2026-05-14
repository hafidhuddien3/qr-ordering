import { useCartStore } from "@/src/state/stores/useCartStore";
import { fireEvent, render } from "@testing-library/react-native";
import { Button } from "react-native";
import { sampleCartStore } from "./cart.test";

function QuantityButton() {
  const store = useCartStore.getState();

  store.clearCart();

  store.addItem(sampleCartStore);

  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);

  return (
    <Button
      testID="add"
      title="Add"
      onPress={() => updateItemQuantity("1", 2)}
    />
  );
}

test("calls updateItemQuantity", () => {
  const { getByTestId } = render(<QuantityButton />);

  fireEvent.press(getByTestId("add"));

  expect(useCartStore.getState().order.item[0].quantity).toBe(2);
});
