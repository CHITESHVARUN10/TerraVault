import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const DOC_OPTIONS = [
  { label: "Ownership Deed", value: "deed" },
  { label: "Survey Map", value: "survey" },
  { label: "Cargo Manifest", value: "manifest" },
  { label: "Architectural Blueprint", value: "blueprint" },
];

export default function M15AddDocumentScreen() {
  const router = useRouter();
  const [docType, setDocType] = useState("deed");
  const [showDocType, setShowDocType] = useState(false);
  const [reference, setReference] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const handleStore = () => {
    handleClose();
  };

  const selectedLabel =
    DOC_OPTIONS.find((o) => o.value === docType)?.label ?? "Ownership Deed";

  return (
    <View className="flex-1 bg-surface-container-lowest">
      {/* Body bg-contours radial rgba(232,200,119,0.03) — repeating-radial approximated with large circle */}
      <View
        pointerEvents="none"
        className="absolute inset-0 items-center justify-center overflow-hidden"
        style={{ backgroundColor: "transparent" }}
      >
        <View
          style={{
            width: 900,
            height: 900,
            borderRadius: 9999,
            backgroundColor: "rgba(232,200,119,0.03)",
          }}
        />
      </View>

      {/* Mobile Screen Container Constraint — max-w-[420px] h-screen border-x */}
      <View className="flex-1 items-center justify-center">
        <View className="relative w-full max-w-[420px] flex-1 bg-background border-x border-outline-variant shadow-2xl flex flex-col overflow-hidden max-h-[850px]">
          {/* Transactional Header (Suppresses Global Nav per rules) — px-6 py-5 border-b */}
          <View className="flex-row justify-between items-center px-6 py-5 border-b border-outline-variant bg-background z-20">
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              className="p-1 -ml-1 active:opacity-60"
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Text className="text-outline text-[24px] leading-none">close</Text>
            </Pressable>
            <Text className="text-[12px] font-semibold tracking-[0.3em] text-outline uppercase leading-none text-center">
              SECURE ENTRY
            </Text>
            <View className="w-6" />
          </View>

          {/* Dialog Content Area — flex-1 px-6 py-8 flex flex-col justify-center */}
          <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-6 py-8 flex flex-col justify-center"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Archival Dialog Plate — bg-surface border-outline-variant p-6 sm:p-8 */}
            <View className="relative bg-surface border border-outline-variant p-6">
              {/* Amber Corner Ticks — 2px border-primary-container */}
              <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t-2 border-l-2 border-primary-container pointer-events-none z-20" />
              <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t-2 border-r-2 border-primary-container pointer-events-none z-20" />
              <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b-2 border-l-2 border-primary-container pointer-events-none z-20" />
              <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b-2 border-r-2 border-primary-container pointer-events-none z-20" />

              {/* Title */}
              <View className="mb-8">
                <Text className="text-[32px] leading-[1.2] font-normal text-on-background mb-2">
                  Add Document
                </Text>
                <Text className="text-[16px] leading-[1.6] font-light text-on-surface-variant">
                  Log physical artifact parameters into the digital vault.
                </Text>
              </View>

              {/* Form gap-8 */}
              <View className="flex flex-col gap-8">
                {/* Document Type Dropdown */}
                <View className="flex flex-col gap-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-outline uppercase leading-none">
                    Document Type
                  </Text>
                  <Pressable
                    onPress={() => setShowDocType((v) => !v)}
                    className={`w-full flex-row items-center justify-between bg-transparent border-0 border-b py-2 pl-0 pr-8 ${showDocType || focused === "doc_type" ? "border-primary-container" : "border-outline-variant"}`}
                    accessibilityLabel="Select Document Type"
                    accessibilityRole="button"
                  >
                    <Text className="text-[18px] leading-[1.6] font-light text-on-surface">
                      {selectedLabel}
                    </Text>
                    <Text className="absolute right-0 text-outline text-[20px] leading-none">
                      arrow_drop_down
                    </Text>
                  </Pressable>
                  {/* material arrow expand_more alternative — arrow_drop_down per spec */}
                  {showDocType ? (
                    <View className="bg-surface border border-outline-variant rounded-sm mt-1 overflow-hidden">
                      {DOC_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt.value}
                          onPress={() => {
                            setDocType(opt.value);
                            setShowDocType(false);
                          }}
                          className={`px-3 py-3 border-b border-outline-variant last:border-b-0 ${docType === opt.value ? "bg-surface-container" : "bg-surface"} active:bg-surface-container`}
                        >
                          <Text
                            className={`text-[16px] leading-[1.6] ${docType === opt.value ? "text-primary-container font-semibold" : "text-on-surface"}`}
                          >
                            {opt.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>

                {/* Dropzone — Artifact Data */}
                <View className="flex flex-col gap-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-outline uppercase leading-none">
                    Artifact Data
                  </Text>
                  <Pressable className="border border-dashed border-outline-variant bg-surface-container-low p-6 flex flex-col items-center justify-center active:bg-surface-container">
                    <Text className="text-outline text-[32px] leading-none mb-3 text-center">
                      upload_file
                    </Text>
                    <View className="flex flex-col gap-1 items-center">
                      <Text className="text-[16px] leading-[1.6] text-on-surface text-center">
                        deed_scanned_01.pdf
                      </Text>
                      <View className="flex-row items-center gap-2 justify-center">
                        <View className="px-2 py-0.5 bg-[#17150f] border border-outline-variant rounded-sm">
                          <Text className="text-[10px] font-semibold tracking-[0.2em] text-outline leading-none">
                            VERIFIED
                          </Text>
                        </View>
                        <Text className="text-[14px] leading-none font-medium text-on-surface-variant">
                          2.4 MB
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </View>

                {/* Meta Input — Reference Code */}
                <View className="flex flex-col gap-2">
                  <Text className="text-[12px] font-semibold tracking-[0.3em] text-outline uppercase leading-none">
                    Reference Code
                  </Text>
                  <TextInput
                    value={reference}
                    onChangeText={setReference}
                    onFocus={() => setFocused("reference")}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. TX-492-A"
                    placeholderTextColor="#4c4638"
                    className={`w-full bg-transparent border-0 border-b py-2 px-0 text-[18px] leading-[1.6] text-on-surface ${focused === "reference" ? "border-primary-container" : "border-outline-variant"}`}
                  />
                </View>

                {/* Action Button — Store in vault bg-primary-container */}
                <Pressable
                  onPress={handleStore}
                  className="w-full bg-primary-container py-4 mt-4 items-center justify-center active:opacity-90"
                  accessibilityRole="button"
                  accessibilityLabel="Store in vault"
                >
                  <Text className="text-[14px] font-medium uppercase tracking-widest text-[#14120e] text-center leading-none">
                    Store in vault
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
