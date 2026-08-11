import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M01ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    // transactional — replace with real reset-link dispatch
  };

  const handleReturnToLogin = () => {
    // @ts-ignore — adjust route to your login screen
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/m03-login-layered" as never);
  };

  return (
    <View className="flex-1 bg-[#16130e]">
      {/* contour-bg — radial + repeating-linear 45deg 2px/8px approximation */}
      <View pointerEvents="none" className="absolute inset-0 bg-[#16130e]" />
      {/* radial wash center 50% 50% rgba(212,168,69,0.05) — HTML: radial-gradient(circle at 50% 50%, rgba(212,168,69,0.05) 0%, transparent 100%) */}
      <View
        pointerEvents="none"
        className="absolute left-1/2 top-1/2 w-[1200px] h-[1200px] rounded-full"
        style={{
          backgroundColor: "rgba(212,168,69,0.05)",
          transform: [{ translateX: -600 }, { translateY: -600 }],
        }}
      />
      {/* repeating-linear 45deg 2px/8px — HTML: repeating-linear-gradient(45deg, rgba(232,200,119,0.02) 0px, rgba(232,200,119,0.02) 2px, transparent 2px, transparent 8px) bg-size 100px 100px */}
      <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 72 }).map((_, i) => (
          <View
            key={i}
            className="absolute h-[2px] bg-[#e8c877]"
            style={{
              width: 1600,
              top: i * 11.32 - 200,
              left: -400,
              opacity: 0.02,
              transform: [{ rotate: "45deg" }],
            }}
          />
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingVertical: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* main w-full max-w-[28rem] relative z-10 flex flex-col gap-stack_lg (64px) */}
        <View className="w-full max-w-[448px] flex-col gap-16">
          {/* Header / Brand — text-center mb-stack_md (32px) */}
          <View className="w-full items-center mb-8">
            <Text className="text-[32px] font-normal leading-[38.4px] tracking-[6.4px] text-[#ffe5a8] text-center" style={{ fontFamily: "Fraunces" }}>
              TERRAVAULT
            </Text>
          </View>

          {/* Archival Panel — plate-container bg-[#1a1813] border-[#241f17] hover #2e2a20 + 4 ticks */}
          <View className="relative bg-[#1a1813] border border-[#241f17] p-8">
            {/* Amber Corner Ticks — 8px L, 2px stroke #d4a845, pointer-events-none z-10 */}
            {/* top-left ::before */}
            <View
              pointerEvents="none"
              className="absolute top-0 left-0 w-2 h-2 border-[#d4a845]"
              style={{ borderTopWidth: 2, borderLeftWidth: 2, zIndex: 10 }}
            />
            {/* top-right ::after */}
            <View
              pointerEvents="none"
              className="absolute top-0 right-0 w-2 h-2 border-[#d4a845]"
              style={{ borderTopWidth: 2, borderRightWidth: 2, zIndex: 10 }}
            />
            {/* bottom-left .tick-bl */}
            <View
              pointerEvents="none"
              className="absolute bottom-0 left-0 w-2 h-2 border-[#d4a845]"
              style={{ borderBottomWidth: 2, borderLeftWidth: 2, zIndex: 10 }}
            />
            {/* bottom-right .tick-br */}
            <View
              pointerEvents="none"
              className="absolute bottom-0 right-0 w-2 h-2 border-[#d4a845]"
              style={{ borderBottomWidth: 2, borderRightWidth: 2, zIndex: 10 }}
            />

            <View className="flex-col items-center">
              {/* Amber Eyebrow — Vault access #d4a845 label-eyebrow 12px/0.3em/600 */}
              <Text className="text-[12px] font-semibold uppercase tracking-[3.6px] text-[#d4a845] text-center mb-4" style={{ fontFamily: "Manrope" }}>
                Vault access
              </Text>

              {/* Serif Heading — Reset your password 36px headline-lg-mobile */}
              <Text
                className="text-[36px] font-normal leading-[41.4px] text-[#e9e1d8] text-center mb-8"
                style={{ fontFamily: "Fraunces", fontWeight: "380" as any }}
              >
                Reset your password
              </Text>

              {/* Dim-gold copy — #e3c373/80 body-md 16px/1.6 max-w-xs mx-auto */}
              <Text
                className="text-[16px] leading-[25.6px] text-[#e3c373] text-center mb-8 max-w-[320px] opacity-80"
                style={{ fontFamily: "Manrope", fontWeight: "350" as any }}
              >
                Enter the email address associated with your archive ledger. A secure link will be dispatched to reset your clearance credentials.
              </Text>

              {/* Recovery Form — w-full gap-stack_md (32px) */}
              <View className="w-full gap-8">
                {/* Archive Email field */}
                <View className="w-full gap-2">
                  <Text className="text-[12px] font-semibold uppercase tracking-[3.6px] text-[#cfc5b3]" style={{ fontFamily: "Manrope" }}>
                    Archive Email
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="identifier@ledger.io"
                    placeholderTextColor="rgba(207,197,179,0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    className={`w-full bg-[#17150f] rounded-none px-0 py-3 text-[16px] leading-[25.6px] text-[#e9e1d8] ${focused ? "border-[#d4a845]" : "border-[#241f17]"}`}
                    style={{
                      fontFamily: "Manrope",
                      borderBottomWidth: 1,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      borderTopWidth: 0,
                    }}
                  />
                </View>

                {/* Button — w-full bg-primary-container #e8c877 text #16130e py-4 + arrow_forward 18px */}
                <Pressable onPress={handleSend} className="w-full bg-[#e8c877] py-4 px-6 mt-4 flex-row items-center justify-center gap-2 active:opacity-90 border border-transparent">
                  <Text className="text-[14px] font-medium leading-none text-[#16130e] text-center" style={{ fontFamily: "Manrope" }}>
                    Send reset link
                  </Text>
                  <Text className="text-[18px] leading-none text-[#16130e]">→</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Footer Link — Return to Login #d4a845 label-ui 14px */}
          <View className="w-full items-center mt-4">
            <Pressable onPress={handleReturnToLogin} hitSlop={8} className="flex-row items-center gap-2 active:opacity-70">
              <Text className="text-[16px] leading-none text-[#d4a845]">←</Text>
              <Text className="text-[14px] font-medium leading-none text-[#d4a845]" style={{ fontFamily: "Manrope" }}>
                Return to Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
