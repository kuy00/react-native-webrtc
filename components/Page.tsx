import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

interface PageProps {
  children: React.ReactNode;
  edges?: ("top" | "bottom" | "left" | "right")[];
  className?: string;
}

const Page = (props: PageProps) => {
  const {
    children,
    edges = ["top", "bottom", "left", "right"],
    className = "",
  } = props;

  return (
    <SafeAreaView
      className={twMerge("flex-1 bg-white", className)}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

export default Page;
