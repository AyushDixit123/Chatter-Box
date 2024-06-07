export const getSender = (loggedUser, users) => {
  if (!users || users.length !== 2) {
    console.error('Unexpected users array:', users);
    return 'Unknown User';
  }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
