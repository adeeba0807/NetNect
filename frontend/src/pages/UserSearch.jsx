import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { searchUsers, sendConnectionRequest } from "@/config/redux/action/authAction";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const results = useSelector((state) => state.auth.searchResults);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchUsers(query));
  };

  const handleViewProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
       {results.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email})
            <button onClick={() => handleViewProfile(user._id)}>
              View Profile
            </button>
            <button onClick={() => dispatch(sendConnectionRequest(user._id))}>
              Send Connection Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;