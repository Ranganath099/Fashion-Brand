"use client";
import { SIZE_CHARTS } from "@/config/sizeCharts";

/* =========================
   Helper: slug → chart key
========================= */
function getSizeChartKey(slug) {
  if (!slug) return null;

  const normalized = slug.toLowerCase();

  // 1️⃣ Direct match (best & fastest)
  if (SIZE_CHARTS[normalized]) {
    return normalized;
  }

  // 2️⃣ Handle known patterns (SEO slug → technical key)
  return normalized
    .replace(/-t-shirts$/, "_tshirt") // oversized-t-shirts
    .replace(/t-shirts$/, "tshirt")   // t-shirts
    .replace(/vests$/, "vest")         // vests
    .replace(/-/g, "_");               // fallback
}

/* =========================
   Component
========================= */
export default function SizeChart({ collection }) {
  if (!collection || !collection.slug) {
    return null;
  }

  const key = getSizeChartKey(collection.slug);
  const chart = SIZE_CHARTS[key];

  if (!chart) {
    return (
      <p className="text-sm mt-4 text-yellow-600 dark:text-yellow-400">
        ⚠️ Size chart not available
      </p>
    );
  }

  return (
    <div
      className="
        mt-6 rounded-md p-4
        border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
      "
    >
      <h3 className="font-semibold mb-3">
        Size Chart ({chart.unit})
      </h3>

      <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            {chart.columns.map((col) => (
              <th
                key={col}
                className="border border-gray-300 dark:border-gray-700 p-2 text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {chart.data.map((row, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
            >
              {chart.columns.map((col) => (
                <td
                  key={col}
                  className="border border-gray-300 dark:border-gray-700 p-2 text-center"
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
