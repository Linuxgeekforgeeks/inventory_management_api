const users = [
  { id: 1, name: "Alice", isPaid: true },
  { id: 2, name: "Bob", isPaid: false },
  { id: 3, name: "Charlie", isPaid: true },
  { id: 4, name: "David", isPaid: false },
  { id: 5, name: "Eve", isPaid: false },
];


 const getAllUnpaidUsers=()=>{
      const unpaid = users.filter(user => !user.isPaid);
      console.log("These are the Unpaid users",unpaid)
  return unpaid;
}

export default getAllUnpaidUsers;