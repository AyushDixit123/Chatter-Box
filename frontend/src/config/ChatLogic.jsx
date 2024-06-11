const getSender = (loggedUser, users) => {
  console.log("loggedUser in getSender:", loggedUser);
  console.log("users in getSender:", users);
  
  if (loggedUser && users && users.length >= 2) {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  } else {
    // Handle cases where loggedUser, users, or users[0] is null or undefined
    return "Sender Not Found";
  }
};
export default getSender;


export const getSenderFull = (loggedUser, users) => {
  if (loggedUser && users && users.length >= 2 && users[0] && users[1]) {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  } else {
    // Handle cases where loggedUser, users, or users[0] is null or undefined
    return "Sender Not Found";
  }
};

