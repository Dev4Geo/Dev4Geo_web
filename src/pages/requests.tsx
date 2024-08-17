import TextHeader from "@/components/shared/textHeader";
import RequestCard from "@/components/requests/requestCard";
import { useEffect, useState } from "react";
import useRequestStore, { RequestType } from "@/store/requestStore";
import { useSession } from "next-auth/react";
import makeRequest from "@/utils/makeRequest";
import router from "next/router";

export async function getServerSideProps() {
  const data = await makeRequest({
    endpoint: "/request/read",
    method: "GET",
  });

  return {
    props: {
      requests: data.data,
      // votedRequestIds: voted_requests.data,
    },
  };
}

export type RequestPageProps = {
  requests: RequestType[];
};

function RequestPage(props: RequestPageProps) {
  const { requests, setRequests } = useRequestStore();
  const { votedRequestIds, setVotedRequestIds } = useRequestStore();
  const [isOnlyMyRequests, setIsOnlyMyRequests] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    setRequests(props.requests);
  }, [props.requests, setRequests]);

  useEffect(() => {
    const func = async () => {
      const voted_request_ids = await makeRequest({
        endpoint: "/vote/read",
        method: "GET",
      });
      setVotedRequestIds(voted_request_ids.data);
    };
    func();
  }, [setVotedRequestIds]);

  let data = requests.length > 0 ? requests : props.requests;

  const me = session?.user?.oid?.toString();

  if (isOnlyMyRequests) {
    data = data.filter((request) => request.user_id === me);
  }
  const isAuth = typeof me !== "undefined";

  const handleAddNewRequest = () => {
    if (!isAuth) {
      window.confirm("You need to login to add new request");
      return;
    }

    router.push("/new_request");
  };
  return (
    <div>
      <div className="flex flex-col mx-10 space-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            <TextHeader>Requests</TextHeader>
            {isAuth && (
              <div
                onClick={() => setIsOnlyMyRequests((p) => !p)}
                className="bg-green-600 p-1 rounded hover:cursor-pointer"
              >
                my requests
              </div>
            )}
          </div>
          <div onClick={handleAddNewRequest}>
            <div className="bg-green-600 text-white p-2 rounded-sm">+</div>
          </div>
        </div>

        {data.map((request, ind) =>
          request ? (
            <RequestCard
              key={request._id}
              request={request}
              me={me}
              isVote={votedRequestIds.includes(request?._id ?? "")}
            />
          ) : (
            <div key={ind}></div>
          )
        )}
      </div>
    </div>
  );
}

export default RequestPage;
