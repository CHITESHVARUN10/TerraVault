import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M04LoginRecoveryScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSignIn = () => {
    // transactional submit — replace with real auth
  };

  const handleForgotPassword = () => {
    // recovery flow for password
  };

  const handleForgotKey = () => {
    // recovery flow for security key
  };

  const handleOpenVault = () => {
    // open registration
  };

  const inputBorder = (key: string) =>
    focused === key ? "border-[#d4a845]" : "border-[#241f17]";

  return (
    <View className="flex-1 bg-[#0c0b09] items-center justify-center p-5">
      {/* contour-bg #0c0b09 radial approximation */}
      <View className="w-full max-w-[28rem] self-center">
        {/* Archival Panel — bg-[#1a1813] border #241f17 p-8 sm:p-10 max-w-[28rem] rounded shadow-2xl with 4 ticks */}
        <View className="relative bg-[#1a1813] border border-[#241f17] rounded p-8 shadow-2xl overflow-hidden">
          {/* Amber Corner Ticks — 4 corners, 8px L shape #d4a845 */}
          <View className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4a845] rounded-tl-[1px] pointer-events-none" />
          <View className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#d4a845] rounded-tr-[1px] pointer-events-none" />
          <View className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#d4a845] rounded-bl-[1px] pointer-events-none" />
          <View className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4a845] rounded-br-[1px] pointer-events-none" />

          {/* Header inside panel — mb-8 text-center space-y-4 */}
          <View className="mb-8 items-center gap-4">
            <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#d4a845] text-center">
              Vault Access
            </Text>
            <Text className="text-[36px] font-normal leading-[1.15] text-[#e9e1d8] text-center">
              Sign in
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="gap-6">
              {/* ARCHIVE ID / EMAIL */}
              <View className="gap-2">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#cfc5b3]">
                  ARCHIVE ID / EMAIL
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your credential"
                  placeholderTextColor="#4c4638"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className={`w-full bg-[#17150f] border-0 border-b rounded-none px-0 py-3 text-[16px] leading-[1.6] text-[#e8c877] ${inputBorder("email")}`}
                  style={{ borderBottomWidth: 1 }}
                />
              </View>

              {/* SECURITY CIPHER */}
              <View className="gap-2">
                <View className="flex-row justify-between items-baseline">
                  <Text className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#cfc5b3]">
                    SECURITY CIPHER
                  </Text>
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  placeholderTextColor="#4c4638"
                  secureTextEntry
                  className={`w-full bg-[#17150f] border-0 border-b rounded-none px-0 py-3 text-[16px] leading-[1.6] text-[#e8c877] ${inputBorder("password")}`}
                  style={{ borderBottomWidth: 1 }}
                />
                {/* Two Forgot links — #b39b5c + d4a845/70, block stacked, text-right */}
                <View className="mt-2 items-end gap-2">
                  <Pressable onPress={handleForgotPassword} hitSlop={8} className="active:opacity-70">
                    <Text className="text-[14px] font-medium leading-none text-[#b39b5c] text-right">
                      Forgot your password?
                    </Text>
                  </Pressable>
                  <Pressable onPress={handleForgotKey} hitSlop={8} className="active:opacity-70">
                    <Text className="text-[14px] font-medium leading-none text-[#d4a845] opacity-70 text-right">
                      Forgot your security key?
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Submit Button — w-full bg-[#e8c877] text-[#0c0b09] py-4 */}
              <Pressable
                onPress={handleSignIn}
                className="w-full bg-[#e8c877] py-4 px-6 rounded items-center justify-center mt-2 active:opacity-90"
              >
                <Text className="text-[14px] font-semibold uppercase tracking-widest text-[#0c0b09] text-center">
                  Sign in
                </Text>
              </Pressable>

              {/* Footer Area — mt-8 pt-6 border-t border-[#241f17] text-center */}
              <View className="mt-8 pt-6 border-t border-[#241f17] items-center">
                <Text className="text-[16px] leading-[1.6] text-[#cfc5b3] text-center">
                  New to TerraVault?{" "}
                  <Text onPress={handleOpenVault} className="text-[#d4a845] font-medium">
                    Open your vault
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
