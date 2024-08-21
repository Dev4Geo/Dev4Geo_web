import useRequestStore, { RequestType } from "@/store/requestStore";
import router from "next/router";
import makeRequest from "@/utils/makeRequest";
import { useState } from "react";

type RequestCardProps = {
  request: RequestType;
  me: string;
  isVote: boolean;
};

function RequestCard({ request, me, isVote }: RequestCardProps) {
  const { setRequests } = useRequestStore();
  const { votedRequestIds, setVotedRequestIds } = useRequestStore();
  const [nVotes, setNVotes] = useState(request.n_votes);
  if (!request) {
    return <div></div>;
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirm) {
      return;
    }

    const res = await makeRequest({
      endpoint: "/request/delete",
      method: "DELETE",
      body: { id: id },
    });

    if (res.status === "error") {
      console.error(res.message);
    }

    const requests = await makeRequest({
      endpoint: "/request/read",
      method: "GET",
    });
    setRequests(requests);

    router.push("/requests");
  };

  const handleVote = () => {
    // check auth
    if (!me) {
      window.confirm("You need to login to vote");
      return;
    }
    if (typeof request === "undefined" || request === null) {
      return;
    }
    if (isVote) {
      makeRequest({
        endpoint: "/vote/delete",
        method: "DELETE",
        body: { request_id: request._id },
      });
      setVotedRequestIds(votedRequestIds.filter((a) => a !== request._id));
    } else {
      makeRequest({
        endpoint: "/vote/create",
        method: "POST",
        body: { request_id: request._id },
      });
      setVotedRequestIds([...votedRequestIds, request._id]);
    }
    const newNVotes = isVote ? nVotes - 1 : nVotes + 1;

    request.n_votes = newNVotes;
    setNVotes(newNVotes);
  };

  return (
    <div className="bg-blue-900 my-1">
      <div>title: {request.title}</div>
      <div>desc: {request.desc}</div>
      <div>owner: {request.user_id}</div>
      {me === request.user_id && (
        <div>
          <div
            onClick={() => handleDelete(request._id)}
            className="bg-red-600 w-fit p-1 m-1 hover:cursor-pointer"
          >
            delete
          </div>

          <div
            onClick={() => router.push(`/update_request/${request._id}`)}
            className="bg-yellow-600 w-fit p-1 m-1 hover:cursor-pointer"
          >
            update
          </div>
        </div>
      )}

      <div className="flex flex-row items-center">
        <div>n_vote: {nVotes}</div>
        <div
          onClick={handleVote}
          className={`${
            isVote ? "bg-blue-400" : "bg-white"
          } text-black w-fit p-1 m-1 hover:cursor-pointer`}
        >
          {isVote ? "voted" : "vote"}
        </div>

        <div
          onClick={() => router.push(`/request/${request._id}`)}
          className="bg-white text-black w-fit p-1 m-1"
        >
          comment
        </div>
      </div>
    </div>
  );
}

export default RequestCard;
