import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function M19ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = () => {
    // placeholder — wire to transmission endpoint when available
  };

  const inputBorder = (key: string) => (focused === key ? "#d4a845" : "#241f17");

  return (
    <View className="flex-1 bg-[#0c0b09]">
      {/* TopAppBar — shield + TerraVault | menu — sticky bg-background border-b */}
      <View className="w-full bg-[#16130e] border-b border-[#4c4638] z-50">
        <View className="flex-row items-center justify-between px-6 py-4 w-full max-w-[76rem] self-center">
          <View className="flex-row items-center gap-3">
            <Text className="text-[#ffe5a8] text-[20px] leading-none">🛡</Text>
            <Text
              className="text-[20px] font-normal tracking-tighter text-[#ffe5a8]"
              style={{ fontFamily: "Fraunces" } as never}
            >
              TerraVault
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Menu"
            hitSlop={8}
            onPress={() => router.push("/" as never)}
            className="w-8 h-8 items-center justify-center active:opacity-60"
          >
            <Text className="text-[#cfc5b3] text-[22px] leading-none">≡</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-[#0c0b09]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[76rem] self-center px-6 py-8 flex-col gap-8 pb-28">
          {/* Page header — Support / Contact */}
          <View className="flex-col gap-2 mb-8">
            <Text
              className="text-[36px] font-normal leading-[1.15] text-[#ffe5a8]"
              style={{ fontFamily: "Fraunces" } as never}
            >
              Support / Contact
            </Text>
            <Text className="text-[18px] leading-[1.6] text-[#cfc5b3]">
              Secure communication channels for archival inquiries.
            </Text>
          </View>

          {/* Main grid 12 — md:grid-cols-12 gap-8 md:gap-gutter — stacks on native */}
          <View className="w-full flex-col gap-8 md:flex-row">
            {/* Left — md:col-7 lg:col-span-8 — Send a Message archive-plate p-6 md:p-8 */}
            <View className="w-full md:w-[58%] lg:w-[66%] flex-col">
              <View className="relative bg-[#1a1813] border border-[#241f17] p-6 md:p-8 rounded-sm w-full flex-col">
                {/* 4 amber-ticks #d4a845 8px L */}
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none z-10" />

                <Text
                  className="text-[24px] leading-[1.3] font-normal text-[#e9e1d8] mb-6"
                  style={{ fontFamily: "Fraunces" } as never}
                >
                  Send a Message
                </Text>

                <View className="flex-col gap-6">
                  {/* Name */}
                  <View className="flex-col">
                    <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                      Name
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      placeholder="Enter your designation"
                      placeholderTextColor="#4c4638"
                      autoCapitalize="words"
                      autoCorrect={false}
                      className="w-full bg-transparent rounded-none py-2 text-[16px] leading-[1.6] text-[#e9e1d8]"
                      style={
                        {
                          borderTopWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderBottomWidth: 1,
                          borderBottomColor: inputBorder("name"),
                          paddingLeft: 0,
                          paddingRight: 0,
                        } as never
                      }
                    />
                  </View>

                  {/* Email */}
                  <View className="flex-col">
                    <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                      Email
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="Authorized contact address"
                      placeholderTextColor="#4c4638"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      className="w-full bg-transparent rounded-none py-2 text-[16px] leading-[1.6] text-[#e9e1d8]"
                      style={
                        {
                          borderTopWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderBottomWidth: 1,
                          borderBottomColor: inputBorder("email"),
                          paddingLeft: 0,
                          paddingRight: 0,
                        } as never
                      }
                    />
                  </View>

                  {/* Subject */}
                  <View className="flex-col">
                    <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                      Subject
                    </Text>
                    <TextInput
                      value={subject}
                      onChangeText={setSubject}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused(null)}
                      placeholder="Nature of inquiry"
                      placeholderTextColor="#4c4638"
                      autoCapitalize="sentences"
                      autoCorrect={false}
                      className="w-full bg-transparent rounded-none py-2 text-[16px] leading-[1.6] text-[#e9e1d8]"
                      style={
                        {
                          borderTopWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderBottomWidth: 1,
                          borderBottomColor: inputBorder("subject"),
                          paddingLeft: 0,
                          paddingRight: 0,
                        } as never
                      }
                    />
                  </View>

                  {/* Message */}
                  <View className="flex-col">
                    <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                      Message
                    </Text>
                    <TextInput
                      value={message}
                      onChangeText={setMessage}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder="Detail your transmission..."
                      placeholderTextColor="#4c4638"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      className="w-full bg-transparent rounded-none py-2 text-[16px] leading-[1.6] text-[#e9e1d8]"
                      style={
                        {
                          borderTopWidth: 0,
                          borderLeftWidth: 0,
                          borderRightWidth: 0,
                          borderBottomWidth: 1,
                          borderBottomColor: inputBorder("message"),
                          paddingLeft: 0,
                          paddingRight: 0,
                          minHeight: 96,
                        } as never
                      }
                    />
                  </View>

                  {/* Submit Transmission — vault-btn-primary bg-[#e8c877] */}
                  <View className="pt-4">
                    <Pressable
                      onPress={handleSubmit}
                      className="bg-[#e8c877] px-8 py-3 rounded-sm w-full md:w-auto self-stretch md:self-start items-center justify-center active:opacity-90"
                    >
                      <Text className="text-[14px] font-medium uppercase tracking-[0.15em] text-[#0c0b09] text-center">
                        Submit Transmission
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            {/* Right aside — md:col-5 lg:col-span-4 — 3 archive-plate p-6 info */}
            <View className="w-full md:w-[42%] lg:w-[34%] flex-col gap-4">
              {/* Direct Channel — mail */}
              <View className="relative bg-[#1a1813] border border-[#241f17] p-6 rounded-sm flex-row items-start gap-4 w-full">
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none z-10" />

                <Text className="text-[#ffe5a8] text-[20px] leading-none mt-1">✉</Text>
                <View className="flex-1 flex-col">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                    Direct Channel
                  </Text>
                  <Text className="text-[16px] leading-[1.6] text-[#e9e1d8]">official@terravault.archival</Text>
                </View>
              </View>

              {/* Response Protocol — schedule */}
              <View className="relative bg-[#1a1813] border border-[#241f17] p-6 rounded-sm flex-row items-start gap-4 w-full">
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none z-10" />

                <Text className="text-[#ffe5a8] text-[20px] leading-none mt-1">◷</Text>
                <View className="flex-1 flex-col">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                    Response Protocol
                  </Text>
                  <Text className="text-[16px] leading-[1.6] text-[#e9e1d8]">Typical response: 24-48 hours</Text>
                </View>
              </View>

              {/* Security Note — lock */}
              <View className="relative bg-[#1a1813] border border-[#241f17] p-6 rounded-sm flex-row items-start gap-4 w-full">
                <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-[#d4a845] pointer-events-none z-10" />
                <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-[#d4a845] pointer-events-none z-10" />

                <Text className="text-[#ffe5a8] text-[20px] leading-none mt-1">⌖</Text>
                <View className="flex-1 flex-col">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-[#cfc5b3] uppercase mb-2">
                    Security Note
                  </Text>
                  <Text className="text-[16px] leading-[1.6] text-[#e9e1d8]">
                    All communications are encrypted and purged after resolution.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BottomNav — h-16 active settings — md:hidden fixed bottom-0 */}
      <View className="bg-[#221f1a] border-t border-[#4c4638] w-full absolute bottom-0 left-0 right-0 z-40">
        <View className="flex-row justify-around items-center h-16 px-4">
          <Pressable
            onPress={() => router.push("/(app)/m06-dashboard" as never)}
            className="flex-1 flex-col items-center justify-center h-full active:opacity-60 gap-1"
            accessibilityLabel="Fingerprint"
          >
            <Text className="text-[#cfc5b3] text-[18px] leading-none">◧</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(app)/m07-all-properties" as never)}
            className="flex-1 flex-col items-center justify-center h-full active:opacity-60 gap-1"
            accessibilityLabel="History"
          >
            <Text className="text-[#cfc5b3] text-[18px] leading-none">▤</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(app)/m06-dashboard" as never)}
            className="flex-1 flex-col items-center justify-center h-full active:opacity-60 gap-1"
            accessibilityLabel="Wallet"
          >
            <Text className="text-[#cfc5b3] text-[18px] leading-none">⬢</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Settings active"
            className="flex-1 flex-col items-center justify-center h-full active:opacity-80"
          >
            <View
              className="bg-[#e8c877] rounded-full px-4 py-2 flex-col items-center justify-center"
              style={{ transform: [{ scale: 0.95 }] } as never}
            >
              <Text className="text-[#6a530b] text-[18px] leading-none">⚙</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
