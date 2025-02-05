"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UsersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    setFilteredUsers(filtered);
  }, [searchTerm, sortBy, users]);

  const fetchPosts = async (userId) => {
    setLoadingPosts(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      setPosts(response.data);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchPosts(user.id);
  };

  return (
    <div className="container my-4">
      <h2 className="text-center pb-3 mb-4">Dashboard</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 position-relative">
              <div className="position-sticky top-0">
                <h3 className="text-secondary pb-3">Users List</h3>
                <input 
                  type="text" 
                  className="form-control mb-2" 
                  placeholder="Search users" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                {/* <select className="form-select mb-2" onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort by Name</option>
                  <option value="company.name">Sort by Company</option>
                </select> */}
                {loadingUsers ? <p className="text-block">Loading users...</p> : (
                  <ul className="list-group">
                    {filteredUsers.map(user => (
                      <li key={user.id} className="list-group-item list-group-item-action" onClick={() => handleUserClick(user)}>
                        <h5>{user.name}</h5>
                        <p>Email: {user.email}</p>
                        <p>Address: {user.address.street}, {user.address.city}</p>
                        <p>Company: {user.company.name}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="col-md-8">
              <h3 className="text-secondary pb-3">User Posts</h3>
              {loadingPosts ? <p className="text-block">Loading posts...</p> : (
                <ul className="list-group">
                  {posts.map(post => (
                    <li key={post.id} className="list-group-item">
                      <h5 className="fw-bold">{post.title}</h5>
                      <p>{post.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;