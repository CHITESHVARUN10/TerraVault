import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M16AddVisitScreen() {
  const router = useRouter();

  const [latitude, setLatitude] = useState("27.1204° N");
  const [longitude, setLongitude] = useState("78.0018° E");
  const [notes, setNotes] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const handleSave = () => {
    handleClose();
  };

  const inputBorder = (key: string) =>
    focused === key ? "border-primary-container" : "border-outline-variant";

  return (
    <View className="flex-1 bg-background relative">
      {/* Grid backdrop — 4rem outline-variant 20% (HTML: bg-[linear-gradient(...)] bg-[size:4rem_4rem] opacity-20) */}
      <View pointerEvents="none" className="absolute inset-0 opacity-20" style={{ backgroundColor: "transparent" }}>
        <View className="absolute inset-0 border-outline-variant opacity-20" />
      </View>
      {/* Radial dim — HTML: bg-[radial-gradient(ellipse_at_center,_...)] from-transparent via-background/90 to-background */}
      <View pointerEvents="none" className="absolute inset-0" style={{ backgroundColor: "rgba(22,19,14,0.9)" }} />

      {/* Centered shell — HTML: main flex-1 flex items-center justify-center p-gutter relative z-10 w-full max-w-md mx-auto */}
      <View className="flex-1 items-center justify-center p-4 relative z-10">
        {/* Archival Dialog Panel — w-full bg-surface-container border border-outline-variant p-6 sm:p-8 max-w-md gap-stack_md */}
        <View className="w-full max-w-md bg-surface-container border border-outline-variant p-6 sm:p-8 flex flex-col gap-8 relative">
          {/* Amber Corner Ticks — w-2 h-2 border-t-2 border-l-2 border-primary-container -mt-[1px] -ml-[1px] */}
          <View className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-container -mt-[1px] -ml-[1px] pointer-events-none" />
          <View className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-container -mt-[1px] -mr-[1px] pointer-events-none" />
          <View className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary-container -mb-[1px] -ml-[1px] pointer-events-none" />
          <View className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary-container -mb-[1px] -mr-[1px] pointer-events-none" />

          {/* Header — flex justify-between items-end border-b border-outline-variant pb-4 */}
          <View className="flex-row justify-between items-end border-b border-outline-variant pb-4">
            <Text className="font-headline-sm text-headline-sm text-on-surface text-[24px] leading-[1.3] font-normal">
              Add Visit
            </Text>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              className="-mr-1 p-1 active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <Text className="text-outline text-[22px] leading-none">close</Text>
            </Pressable>
          </View>

          {/* Form — ScrollView wraps flex-col gap-stack_sm (gap-4) */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="flex flex-col gap-4">
              {/* Date — readonly Oct 24, 2024 */}
              <View className="flex flex-col gap-1">
                <Text className="font-label-eyebrow text-label-eyebrow text-outline uppercase tracking-[0.3em] text-[12px] font-semibold leading-none">
                  Date
                </Text>
                <TextInput
                  value="Oct 24, 2024"
                  editable={false}
                  selectTextOnFocus={false}
                  className={`w-full bg-transparent border-0 border-b px-0 pb-2 text-body-md text-on-surface text-[16px] leading-[1.6] ${inputBorder("date")}`}
                  placeholderTextColor="#4c4638"
                />
              </View>

              {/* Coordinates Grid — flex gap-4 split */}
              <View className="flex-row gap-4 w-full pt-2">
                <View className="flex-1 flex flex-col gap-1">
                  <Text className="font-label-eyebrow text-label-eyebrow text-outline uppercase tracking-[0.3em] text-[12px] font-semibold leading-none">
                    Latitude
                  </Text>
                  <TextInput
                    value={latitude}
                    onChangeText={setLatitude}
                    onFocus={() => setFocused("latitude")}
                    onBlur={() => setFocused(null)}
                    placeholder="27.1204° N"
                    placeholderTextColor="#4c4638"
                    className={`w-full bg-transparent border-0 border-b px-0 pb-2 text-body-md text-on-surface text-[16px] leading-[1.6] ${inputBorder("latitude")}`}
                  />
                </View>
                <View className="flex-1 flex flex-col gap-1">
                  <Text className="font-label-eyebrow text-label-eyebrow text-outline uppercase tracking-[0.3em] text-[12px] font-semibold leading-none">
                    Longitude
                  </Text>
                  <TextInput
                    value={longitude}
                    onChangeText={setLongitude}
                    onFocus={() => setFocused("longitude")}
                    onBlur={() => setFocused(null)}
                    placeholder="78.0018° E"
                    placeholderTextColor="#4c4638"
                    className={`w-full bg-transparent border-0 border-b px-0 pb-2 text-body-md text-on-surface text-[16px] leading-[1.6] ${inputBorder("longitude")}`}
                  />
                </View>
              </View>

              {/* Notes — textarea rows2 */}
              <View className="flex flex-col gap-1 pt-2">
                <Text className="font-label-eyebrow text-label-eyebrow text-outline uppercase tracking-[0.3em] text-[12px] font-semibold leading-none">
                  Notes
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  onFocus={() => setFocused("notes")}
                  onBlur={() => setFocused(null)}
                  placeholder="Record physical conditions..."
                  placeholderTextColor="#4c4638"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  className={`w-full bg-transparent border-0 border-b px-0 pb-2 text-body-md text-on-surface text-[16px] leading-[1.6] min-h-[56px] ${inputBorder("notes")}`}
                />
              </View>

              {/* Dim-Gold Helper Plate — bg-surface-container-highest border + w-[2px] bg-secondary-fixed-dim + explore icon */}
              <View className="mt-4 bg-surface-container-highest border border-outline-variant p-4 flex-row gap-3 relative overflow-hidden">
                <View className="absolute left-0 top-0 bottom-0 w-[2px] bg-secondary-fixed-dim" />
                <Text className="text-secondary-fixed-dim text-[20px] leading-none shrink-0">explore</Text>
                <Text className="font-label-ui text-label-ui text-secondary-fixed-dim text-[14px] leading-[1.6] font-medium flex-1">
                  5 directional photos (standing, north, east, south, west) will be captured for this visit.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action — pt-4 mt-auto w-full bg-primary-container + save FILL 1 */}
          <View className="pt-4">
            <Pressable
              onPress={handleSave}
              className="w-full bg-primary-container py-4 px-6 flex-row items-center justify-center gap-2 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Save visit"
            >
              {/* Material Symbol save FILL 1 — HTML style="font-variation-settings:'FILL' 1; font-size:18px" */}
              <Text className="text-background text-[18px] leading-none">save</Text>
              <Text className="font-label-ui text-label-ui text-background text-[14px] font-medium text-center">
                Save visit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
