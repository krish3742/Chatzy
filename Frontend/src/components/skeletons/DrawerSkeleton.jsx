const DrawerSkeleton = () => {
  const skeletonContacts = Array(5).fill(null);

  return (
    <div className="w-80 max-w-[100vw] h-screen flex flex-col">
      {skeletonContacts.map((_, idx) => (
        <div key={idx} className="w-full p-3 flex items-center gap-3">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DrawerSkeleton;
