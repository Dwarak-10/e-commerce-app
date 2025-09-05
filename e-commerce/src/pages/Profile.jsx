import { useSelector } from "react-redux";
import EditProfile from "../components/EditProfile";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const user = useSelector((store) => store.user);
  // const [users, setUser] = useState([])
  // const [form, setForm] = useState({})
  // const [edit, setEdit] = useState(null)

  // const fetchUser = async () => {
  //   const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')
  //   setUser(data)
  //   // console.log(data)
  // }
  // useEffect(() => { fetchUser() }, [])
  // const handleDelete = async (id) => {
  //   await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
  //   setUser(users.filter(item => item.id !== id))
  //   // fetchUser()
  // }
  // // console.log(edit)
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const updateUser = { ...form, id: edit?.id }
  //   // console.log(edit)
  //   if (edit && edit.id < 10) {
  //     await axios.put(`https://jsonplaceholder.typicode.com/users/${edit.id}`, updateUser)
  //     setUser(users.map(item => item.id === edit?.id ? { ...item, ...updateUser } : item))
  //     setEdit(null)
  //     setForm({ name: "", email: "" })
  //   } else {
  //     setUser(users.map(item => item.id === edit?.id ? { ...item, ...updateUser } : item))
  //     setEdit(null)
  //     setForm({ name: "", email: "" })
  //   }
  //   if (!edit) {
  //     await axios.post('https://jsonplaceholder.typicode.com/users/', form)
  //     setForm({ name: "", email: "" })
  //     setUser([...users, { ...form, id: users.length + 1 }])
  //   }
  //   // console.log(users)
  // }
  // const handleEdit = async (user) => {
  //   setEdit(user)
  //   setForm({ name: user.name, email: user.email })
  // }

  return (
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
    // <>
    //   <form onSubmit={handleSubmit} className="flex justify-center items-center p-4 gap-4">
    //     <div>
    //       <div>
    //         <label>Name : </label>
    //         <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
    //       </div>
    //       <div>
    //         <label>Email : </label>
    //         <input type="text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
    //       </div>
    //       <button className="cursor-pointer">Submit</button>
    //     </div>
    //   </form>
    //   <div>
    //     {users.map((user, index) => (
    //       <div key={user.id} className="flex justify-center items-center p-4 gap-4">
    //         <p >{index + 1}. {user.name}</p>
    //         <button className="cursor-pointer" onClick={() => handleDelete(user.id)}>Delete</button>
    //         <button className="cursor-pointer" onClick={() => handleEdit(user)}>Edit</button>
    //       </div>
    //     ))}
    //   </div>
    // </>
  );
};
export default Profile;