import Link from "next/link";
import { fetchCollections } from "@/lib/api";

export default async function CollectionsSidebar() {
  const collections = await fetchCollections();

  return (
    <aside
      className="
        col-span-12 md:col-span-3
        border border-gray-200 dark:border-gray-700
        rounded-lg p-4 h-fit
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
      "
    >
      <h2 className="font-semibold mb-4">
        Collections
      </h2>

      <ul className="space-y-2">
        {collections.map((c) => (
          <li key={c.id}>
            <Link
              href={`/collections/${c.slug}`}
              className="
                block px-3 py-2 rounded-md
                transition cursor-pointer
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800
                hover:text-gray-900 dark:hover:text-gray-100
              "
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
