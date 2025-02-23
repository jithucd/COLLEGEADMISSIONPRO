import { useEffect, useState } from "react";
import { getAllUsers, getAllColleges } from "../services/admin";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await getAllUsers();
      const collegesResponse = await getAllColleges();
      setUsers(usersResponse);
      setColleges(collegesResponse);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/superadmin-login");
  };

  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.role}
          </li>
        ))}
      </ul>

      <h2>Colleges</h2>
      <ul>
        {colleges.map((college) => (
          <li key={college._id}>
            {college.name} - {college.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdminDashboard;