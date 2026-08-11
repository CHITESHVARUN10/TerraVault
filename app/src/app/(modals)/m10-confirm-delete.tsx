import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function M10ConfirmDeleteScreen() {
  const router = useRouter();

  const handleCancel = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(app)/m06-dashboard" as never);
  };

  const handleDelete = () => {
    // placeholder — permanent delete property + 5 docs + 3 visits
    handleCancel();
  };

  return (
    <View className="flex-1 bg-void items-center justify-center p-4">
      {/* contour-bg: svg 150px 150px stroke rgba(212,168,69,0.05) opacity-50 — approximated with soft radial */}
      <View
        pointerEvents="none"
        className="absolute inset-0 opacity-50 items-center justify-center overflow-hidden"
        style={{ backgroundColor: "transparent" }}
      >
        <View
          style={{
            width: 900,
            height: 900,
            borderRadius: 9999,
            backgroundColor: "rgba(212,168,69,0.05)",
          }}
        />
      </View>

      {/* Dialog Panel — relative z-10 w-full max-w-sm bg-plate border border-hairline p-8 flex-col gap-6 */}
      <View className="relative w-full max-w-sm bg-plate border border-hairline p-8 flex flex-col gap-6">
        {/* Amber Corner Ticks — 8px L shape amber #d4a845 */}
        <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none" />
        <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none" />
        <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none" />
        <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none" />

        {/* Header — flex-col gap-4 text-center items-center */}
        <View className="flex flex-col gap-4 items-center">
          {/* warning icon danger-amber #8b2e2e FILL 1 text-4xl */}
          <Text className="text-4xl leading-none text-danger-amber text-center">warning</Text>
          {/* Confirm Delete headline danger-amber — font-headline-sm 24px 1.3 400 + drop shadow rgba(139,46,46,0.4) approximated via color */}
          <Text className="font-headline-sm text-headline-sm text-danger-amber text-center">
            Confirm Delete
          </Text>
        </View>

        {/* Body — font-body-md text-body-md text-on-surface-variant text-center mentions 5 documents 3 visits */}
        <Text className="font-body-md text-body-md text-on-surface-variant text-center">
          This action will permanently remove this property record along with its 5 documents and 3 visits. Files
          already synced to your Google Drive will remain untouched.
        </Text>

        {/* Actions — flex-col gap-3 mt-2 two stacked buttons py-4 */}
        <View className="flex flex-col gap-3 mt-2">
          {/* Delete bg-danger-amber text-on-primary */}
          <Pressable
            onPress={handleDelete}
            className="w-full bg-danger-amber py-4 items-center justify-center active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="Delete property"
          >
            <Text className="font-label-eyebrow text-label-eyebrow text-on-primary uppercase tracking-widest text-center">
              Delete
            </Text>
          </Pressable>

          {/* Cancel border-outline-variant text-amber */}
          <Pressable
            onPress={handleCancel}
            className="w-full border border-outline-variant py-4 items-center justify-center bg-transparent active:bg-surface-container"
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text className="font-label-eyebrow text-label-eyebrow text-amber uppercase tracking-widest text-center">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
