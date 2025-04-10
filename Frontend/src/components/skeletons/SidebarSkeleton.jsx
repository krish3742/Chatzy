const SidebarSkeleton = () => {
  const skeletonContacts = Array(6).fill(null);

  return (
    <aside className="overflow-y-auto">
      <div className="flex-1 overflow-y-auto w-full">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            <div className="relative">
              <div className="skeleton size-12 rounded-full" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-20 md:w-24 lg:w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
