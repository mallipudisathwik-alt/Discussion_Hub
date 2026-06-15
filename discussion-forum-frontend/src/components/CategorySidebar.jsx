import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categoriesApi'

export default function CategorySidebar() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  })

  return (
    <div className="bg-[#1e293b] rounded-lg border border-[#475569] p-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Categories</h3>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-[#334155] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
               to={`/?categoryId=${cat.id}`}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#334155] transition text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#3B82F6' }} />
                <span className="text-gray-300">{cat.name}</span>
              </div>
              <span className="text-gray-500 text-xs">{cat.postCount}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
