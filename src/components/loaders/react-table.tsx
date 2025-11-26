import { Skeleton } from "@/components/ui/skeleton"; // shadcn skeleton

export default function ReactTableSkeleton({ columns = 5, rows = 8 }: { columns?: number; rows?: number }) {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] bg-gray-100 dark:bg-gray-800">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="p-2 font-medium text-sm text-gray-500">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] border-t"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="p-2">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
