import NewDropSection from "@/components/NewDropSection";

export const metadata = {
  title: "New Drop | Fashion Store",
  description: "Explore our latest new drop collections and products.",
};

export default function NewDropPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10">🔥 New Drop</h1>
      <NewDropSection />
    </div>
  );
}
