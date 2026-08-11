import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M05RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = () => {
    router.push("/(app)/m06-dashboard" as any);
  };

  const handleSignIn = () => {
    router.push("/(auth)/m04-login" as any);
  };

  const borderFor = (key: string) => (focused === key ? "border-[#d4a845]" : "border-[#241f17]");

  return (
    <View className="flex-1 bg-[#0c0b09] relative">
      {/* contour-bg fallback: solid ink + diagonal hairline overlay approximation */}
      <View className="absolute inset-0 bg-[#0c0b09] opacity-100" pointerEvents="none" />
      {/* subtle repeating-linear gradient approximation — two diagonal hairline strokes */}
      <View className="absolute inset-0 opacity-[0.18]" pointerEvents="none">
        <View className="absolute inset-0 bg-transparent" />
      </View>
      {/* ambient-light — radial ellipse at 20% top center, blur feel via large soft circle */}
      <View
        className="absolute left-1/2 -translate-x-1/2 w-[320px] h-[160px] rounded-full bg-[#e8c877]/5 opacity-60"
        style={{ top: 120 }}
        pointerEvents="none"
      />
      {/* secondary ambient glow */}
      <View
        className="absolute left-1/2 -translate-x-1/2 w-[280px] h-[140px] rounded-full bg-[#e8c877]/[0.04] opacity-40"
        style={{ top: 140 }}
        pointerEvents="none"
      />

      {/* Header — brand anchor centered */}
      <View className="w-full flex-row items-center justify-center pt-8 pb-4 z-20">
        <View className="flex-row items-center gap-2">
          <Text className="text-[#e8c877] text-[28px] leading-none">🛡</Text>
          <Text className="text-[32px] font-normal tracking-tighter text-[#ffe5a8] leading-none">
            TerraVault
          </Text>
        </View>
      </View>

      {/* Main canvas */}
      <ScrollView
        className="flex-1 z-10"
        contentContainerClassName="flex-grow items-center justify-center px-6 py-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md">
          {/* Plate — bg-[#1a1813] border-[#241f17] rounded-sm shadow-2xl with amber ticks */}
          <View className="w-full bg-[#1a1813] border border-[#241f17] p-8 rounded-sm shadow-2xl relative">
            {/* plate ticks — 8px amber L corners */}
            <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none z-10" />
            <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none z-10" />
            <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none z-10" />
            <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none z-10" />

            {/* Header group */}
            <View className="items-center mb-8">
              <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#d4a845] leading-none mb-4 text-center">
                OPEN YOUR VAULT
              </Text>
              <Text className="text-[36px] font-normal leading-[1.15] text-[#e9e1d8] text-center">Create your vault</Text>
            </View>

            {/* Registration Form */}
            <View className="flex-col gap-6">
              {/* Full Name */}
              <View className="flex-col gap-0">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-[#cfc5b3] mb-2">
                  Full name
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocused("fullName")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#4c4638"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className={`w-full bg-transparent border-0 border-b pb-2 px-0 text-[16px] leading-[1.6] text-[#e9e1d8] ${borderFor("fullName")}`}
                />
              </View>

              {/* Email */}
              <View className="flex-col gap-0">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-[#cfc5b3] mb-2">
                  Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your email address"
                  placeholderTextColor="#4c4638"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={`w-full bg-transparent border-0 border-b pb-2 px-0 text-[16px] leading-[1.6] text-[#e9e1d8] ${borderFor("email")}`}
                />
              </View>

              {/* Password */}
              <View className="flex-col gap-0 mb-1">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-[#cfc5b3] mb-2">
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Create a secure password"
                  placeholderTextColor="#4c4638"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={`w-full bg-transparent border-0 border-b pb-2 px-0 text-[16px] leading-[1.6] text-[#e9e1d8] ${borderFor("password")}`}
                />
              </View>

              {/* Microcopy */}
              <View className="items-start mb-2 -mt-2">
                <Text className="text-[10px] font-semibold uppercase tracking-widest text-[#eec05a]/60 leading-none">
                  Min. 6 characters
                </Text>
              </View>

              {/* Action Button — w-full bg-[#e8c877] text-[#16130e] py-4 + key icon 18px, btn-lift */}
              <View className="pt-4">
                <Pressable
                  onPress={handleSubmit}
                  className="w-full bg-[#e8c877] py-4 px-6 rounded-sm flex-row items-center justify-center gap-2 border border-transparent active:opacity-90"
                >
                  <Text className="text-[14px] font-medium uppercase tracking-widest text-[#16130e] text-center">
                    CREATE ACCOUNT
                  </Text>
                  <Text className="text-[18px] leading-none text-[#16130e] opacity-70">🔑</Text>
                </Pressable>
              </View>
            </View>

            {/* Footer link — Already have a vault? Sign in #d4a845 link-sweep */}
            <View className="mt-8 items-center justify-center">
              <View className="flex-row items-center justify-center flex-wrap">
                <Text className="text-[16px] leading-[1.6] text-[#cfc5b3]">Already have a vault? </Text>
                <Pressable onPress={handleSignIn} className="ml-1 active:opacity-60" hitSlop={8}>
                  <View className="border-b border-[#d4a845]/0">
                    <Text className="text-[14px] font-medium text-[#d4a845]">Sign in</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* bottom decorative hairline */}
      <View className="w-full h-[1px] bg-[#241f17] opacity-50" />
    </View>
  );
}
