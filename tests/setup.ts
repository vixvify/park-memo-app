jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Text } = jest.requireActual<typeof import("react-native")>("react-native");

  return {
    __esModule: true,
    default: ({ name }: { name: string }) => React.createElement(Text, null, name),
  };
});
