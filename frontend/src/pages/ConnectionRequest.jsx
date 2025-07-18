import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { respondConnectionRequest } from "@/config/redux/action/authAction";

const ConnectionRequests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.auth.connectionRequest);

  const handleRespond = (requestId, action) => {
    dispatch(respondConnectionRequest({ requestId, action }));
  };

  return (
    <div>
      <h3>Pending Connection Requests</h3>
      <ul>
  {requests && requests.length > 0 ? (
    requests.map((req) => (
      <li key={req._id}>
        {req.fromUser.name}
        <button onClick={() => handleRespond(req._id, "accept")}>Accept</button>
        <button onClick={() => handleRespond(req._id, "reject")}>Reject</button>
        <button onClick={() => handleRespond(req._id, "ignore")}>Ignore</button>
      </li>
    ))
  ) : (
    <li>No pending requests.</li>
  )}
</ul>
    </div>
  );
};

export default ConnectionRequests;