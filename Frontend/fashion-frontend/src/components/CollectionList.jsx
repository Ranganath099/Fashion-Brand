"use client";

// export default function CollectionList({ collections, onSelect, selected }) {
//   return (
//     <div className="flex gap-3 flex-wrap mb-8 justify-center sm:justify-start">
//       <button
//         onClick={() => onSelect(null)}
//         className={`px-5 py-2 rounded-full border transition
//           ${
//             selected === null
//               ? "bg-black text-white dark:bg-white dark:text-black"
//               : "bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//           }`}
//       >
//         All
//       </button>

//       {collections.map((c) => (
//         <button
//           key={c.id}
//           onClick={() => onSelect(c.id)}
//           className={`px-5 py-2 rounded-full border transition
//             ${
//               selected === c.id
//                 ? "bg-black text-white dark:bg-white dark:text-black"
//                 : "bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//             }`}
//         >
//           {c.name}
//         </button>
//       ))}
//     </div>
//   );
// }

export default function CollectionList({ collections, selected, onSelect }) {
  return (
    <div className="flex gap-4 flex-wrap mb-6">
      {collections.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition
            ${
              selected === c.id
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

