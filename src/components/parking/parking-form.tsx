import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { parkingSchema, type ParkingInput } from "@/core/schema/parking.schema";
import { Button } from "@/components/ui/button";
import { FormTextField } from "@/components/ui/text-field";
import { colors, radii, spacing } from "@/theme";

const emptyInput: ParkingInput = {
  placeName: "",
  floor: "",
  zone: "",
  parkingNumber: "",
  note: "",
};

export function ParkingForm({
  initialValues,
  isEditing = false,
  onSubmit,
  submitting = false,
}: {
  initialValues?: ParkingInput;
  isEditing?: boolean;
  onSubmit: (input: ParkingInput) => Promise<void>;
  submitting?: boolean;
}) {
  const { control, handleSubmit, reset } = useForm<ParkingInput>({
    resolver: zodResolver(parkingSchema),
    defaultValues: initialValues ?? emptyInput,
  });
  useEffect(() => reset(initialValues ?? emptyInput), [initialValues, reset]);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.step}>
          <Text style={styles.stepText}>01</Text>
        </View>
        <View>
          <Text style={styles.title}>
            {isEditing ? "แก้ไขข้อมูลจุดจอด" : "จอดรถไว้ตรงไหน"}
          </Text>
          <Text style={styles.subtitle}>
            กรอกเท่าที่จำได้ ทุกช่องเว้นว่างได้
          </Text>
        </View>
      </View>
      <View style={styles.fields}>
        <FormTextField
          control={control}
          name="placeName"
          label="ชื่อห้างหรือสถานที่"
          placeholder="เช่น เซ็นทรัลเวิลด์"
          icon="place"
        />
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <FormTextField
              control={control}
              name="floor"
              label="ชั้น"
              placeholder="เช่น B2, 3"
              icon="layers"
            />
          </View>
          <View style={styles.column}>
            <FormTextField
              control={control}
              name="zone"
              label="โซน"
              placeholder="เช่น โซน C"
              icon="grid-view"
            />
          </View>
        </View>
        <FormTextField
          control={control}
          name="parkingNumber"
          label="หมายเลขที่จอด"
          placeholder="เช่น C-128"
          icon="directions-car"
        />
        <FormTextField
          control={control}
          name="note"
          label="จุดสังเกต"
          placeholder="เช่น ใกล้ลิฟต์แก้ว"
          icon="edit-note"
          multiline
        />
      </View>
      <View style={styles.hint}>
        <MaterialIcons name="my-location" size={18} color="#52745b" />
        <Text style={styles.hintText}>
          {isEditing
            ? "แก้ไขข้อความโดยคงพิกัดรถเดิม"
            : "จะบันทึกตำแหน่ง GPS ปัจจุบันให้ด้วย"}
        </Text>
      </View>
      <Button
        icon={isEditing ? "check" : "arrow-forward"}
        loading={submitting}
        onPress={handleSubmit(onSubmit)}
      >
        {isEditing ? "บันทึกการแก้ไข" : "บันทึกจุดจอด"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderColor: "#e2e9df",
    borderWidth: 1,
    borderRadius: radii.lg,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  step: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: "#e7eee4",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { color: "#305849", fontFamily: "Prompt_600SemiBold" },
  title: { color: colors.text, fontFamily: "Prompt_600SemiBold", fontSize: 18 },
  subtitle: {
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 12,
  },
  fields: { gap: spacing.lg },
  twoColumns: { flexDirection: "row", gap: spacing.md },
  column: { flex: 1 },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceSoft,
  },
  hintText: {
    color: colors.textMuted,
    fontFamily: "Prompt_400Regular",
    fontSize: 12,
  },
});
