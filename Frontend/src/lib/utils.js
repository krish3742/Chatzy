export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getUserProfilePic(users, authUser) {
  return users[0]._id === authUser._id
    ? users[1]?.profilePic
    : users[0].profilePic;
}

export function getUserName(users, authUser) {
  return users[0]._id === authUser._id ? users[1]?.fullName : users[0].fullName;
}

export function getUserId(users, authUser) {
  return users[0]._id === authUser._id ? users[1]?._id : users[0]._id;
}

export function getUserEmail(users, authUser) {
  return users[0]._id === authUser._id ? users[1]?.email : users[0].email;
}
