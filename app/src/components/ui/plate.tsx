import { View } from 'react-native';

export function CornerTicks() {
  return (
    <>
      <View className="absolute top-[-1px] left-[-1px] w-2 h-2 border-t border-l border-amber pointer-events-none" />
      <View className="absolute top-[-1px] right-[-1px] w-2 h-2 border-t border-r border-amber pointer-events-none" />
      <View className="absolute bottom-[-1px] left-[-1px] w-2 h-2 border-b border-l border-amber pointer-events-none" />
      <View className="absolute bottom-[-1px] right-[-1px] w-2 h-2 border-b border-r border-amber pointer-events-none" />
    </>
  );
}

type PlateProps = {
  children: React.ReactNode;
  className?: string;
};

export function Plate({ children, className = '' }: PlateProps) {
  return (
    <View className={`relative bg-plate border border-hairline ${className}`}>
      <CornerTicks />
      {children}
    </View>
  );
}
