import { useSelector } from "react-redux";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  //const user = useSelector((store) => store.user);
  const user = [
    {
      "id": "v1",
      "name": "Rahul",
      "email": "vendor1@example.com"
    },
    {
      "id": "v2",
      "name": "Krishna",
      "email": "vendor2@example.com"
    },
    {
      "id": "v3",
      "name": "Deepak",
      "email": "vendor2@example.com"
    },
    {
      "id": "v4",
      "name": "Mani",
      "email": "vendor2@example.com"
    },
    {
      "id": "v5",
      "name": "Kumar",
      "email": "vendor2@example.com"
    },
    {
      "id": "v6",
      "name": "Kishore",
      "email": "vendor2@example.com"
    },
    {
      "id": "v7",
      "name": "RamKumar",
      "email": "vendor2@example.com"
    },
    {
      "id": "v8",
      "name": "Selva",
      "email": "vendor2@example.com"
    }
  ];  

  return (
    user && (
      <div>
        <EditProfile 
        user={user}
         />
      </div>
    )
  );
};
export default Profile;