import { Button } from "@/components/ui/button";

export function NavigationControl({
  isNavigating,
  loading = false,
  onPress,
}: {
  isNavigating: boolean;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      icon={isNavigating ? "stop-circle" : "navigation"}
      loading={loading}
      variant={isNavigating ? "secondary" : "primary"}
      onPress={onPress}
    >
      {isNavigating ? "หยุดนำทาง" : "เริ่มนำทางกลับ"}
    </Button>
  );
}
