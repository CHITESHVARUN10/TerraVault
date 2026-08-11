import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

/**
 * M02 – Check your email
 * Pixel match of stitch_screens/m02_check_email.html
 *
 * HTML mapping:
 *  body  -> outer View: bg-[#0c0b09] min-h-[884px] flex items-center justify-center p-gutter
 *  main  -> panel View: w-full max-w-[400px] bg-[#1a1813] border-[#241f17] p-8 md:p-12 relative
 *  corner ticks -> 4× absolute w-2 h-2 (8px) border-[1.5px] border-[#d4a845]
 *  icon  -> w-16 h-16 rounded-full border-outline-variant bg-[#17150f] + check #d4a845 text-3xl FILL 0
 *  h1    -> font-headline-lg-mobile text-headline-lg-mobile text-primary
 *  p     -> font-body-md text-body-md text-on-surface-variant
 *  button-> ghost w-full py-3 px-6 border-[#2e2a20] text-[#e8c877] font-label-ui
 */
export default function M02CheckEmailScreen() {
  const router = useRouter();

  const handleBackToSignIn = () => {
    // Mirrors web <a href="/login"> / <Link to="/login"> — back to sign-in.
    // Prefer back if history exists, otherwise replace to login.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login" as never);
    }
  };

  return (
    <View className="flex-1 bg-[#0c0b09] min-h-[884px] items-center justify-center p-6">
      {/* subtle radial glow rgba(212,168,69,0.05) circle at 50% — solid #0c0b09 is the RN equivalent; gradient would need LinearGradient/SVG */}

      {/* Panel — w-full max-w-[400px] bg-[#1a1813] border border-[#241f17] p-8 md:p-12 relative */}
      <View className="w-full max-w-[400px] bg-[#1a1813] border border-[#241f17] p-8 relative">
        {/* Signature amber corner ticks — 8px 1.5px #d4a845 */}
        <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#d4a845] pointer-events-none" />
        <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#d4a845] pointer-events-none" />
        <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#d4a845] pointer-events-none" />
        <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#d4a845] pointer-events-none" />

        {/* flex flex-col items-center text-center space-y-stack_md (2rem) */}
        <View className="flex flex-col items-center gap-8">
          {/* Checkmark icon — w-16 h-16 rounded-full border-outline-variant bg-[#17150f] mb-2 */}
          <View className="w-16 h-16 rounded-full border border-outline-variant bg-[#17150f] items-center justify-center mb-2">
            <Text
              className="text-[#d4a845] text-3xl leading-none text-center"
              accessibilityLabel="check"
            >
              ✓
            </Text>
          </View>

          {/* Headers — space-y-stack_sm (1rem) */}
          <View className="w-full flex flex-col items-center gap-4">
            <Text className="font-headline-lg-mobile text-headline-lg-mobile text-primary text-center tracking-tight leading-[1.15]">
              Check your email
            </Text>
            <Text className="font-body-md text-body-md text-on-surface-variant text-center leading-[1.6]">
              We&apos;ve sent a secure recovery link. Please follow the instructions to regain access
              to your vault.
            </Text>
          </View>

          {/* Actions — w-full pt-4 */}
          <View className="w-full pt-4">
            <Pressable
              onPress={handleBackToSignIn}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in"
              className="w-full py-3 px-6 border border-[#2e2a20] items-center justify-center active:bg-[#1a1813] active:border-[#d4a845] active:opacity-90"
            >
              <Text className="font-label-ui text-label-ui text-[#e8c877] uppercase tracking-[0.1em] text-center leading-none">
                Back to sign in
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
