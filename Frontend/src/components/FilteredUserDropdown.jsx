import { createPortal } from "react-dom";

function FilteredUserDropdown({ users, position }) {
  return createPortal(
    <div
      className="absolute z-[999] bg-white border rounded shadow-md max-h-60 overflow-auto w-[90%]"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
      }}
    >
      {users.map((user) => (
        <div key={user._id}>{user.name}</div>
      ))}
    </div>,
    document.body
  );
}

export default FilteredUserDropdown;
