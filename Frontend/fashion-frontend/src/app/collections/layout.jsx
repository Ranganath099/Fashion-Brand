import CollectionsSidebar from "./CollectionsSidebar";

export default function CollectionsLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        <CollectionsSidebar />
        <main className="col-span-12 md:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}
