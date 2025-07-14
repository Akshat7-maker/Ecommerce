import useLoader from '@/customHooks/loader';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API } from '@/api/api';

function AdminUserTable() {
    const [users, setUsers] = useState([]);
    const { loading, error, withLoader } = useLoader()

    const fetchUsers = async () => {
        await withLoader(async () => {
            const {data} = await API.get('users/get-all-users');
            const {data:users} = data
            setUsers(users)
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
      console.log("loading.............", loading);
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
          {console.log("loding inside component", loading)}
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 p-6 border-b">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                      User Name
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                      User Email
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                      User Gender
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                      Join Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr
                      key={user?._id || Math.random()}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {user?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {user?.email || "N/A"}
                      </td>
                    
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {user?.gender || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {new Date(user?.createdAt).toLocaleDateString() || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      );
}

export default AdminUserTable
