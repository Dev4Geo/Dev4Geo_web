import TextHeader from "@/components/shared/textHeader";
import RequestCard from "@/components/requests/requestCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import useRequestStore, { RequestType } from "@/store/requestStore";
import { useSession } from "next-auth/react";
import makeRequest from "@/utils/makeRequest";

export async function getServerSideProps() {
  const data = await makeRequest({
    endpoint: "/request/read",
    method: "GET",
  });

  return {
    props: {
      requests: data.data,
    },
  };
}

export type RequestPageProps = {
  requests: RequestType[];
};

function RequestPage(props: RequestPageProps) {
  const { requests, setRequests } = useRequestStore();
  const [isOnlyMyRequests, setIsOnlyMyRequests] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    setRequests(props.requests);
  }, [props.requests, setRequests]);

  let data = requests.length > 0 ? requests : props.requests;

  const me = session?.user?.oid?.toString();

  if (isOnlyMyRequests) {
    data = data.filter((request) => request.user_id === me);
  }
  return (
    <div>
      <div className="flex flex-col mx-10 space-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            <TextHeader>Requests</TextHeader>
            <div
              onClick={() => setIsOnlyMyRequests((p) => !p)}
              className="bg-green-600 p-1 rounded hover:cursor-pointer"
            >
              my requests
            </div>
          </div>
          {typeof me !== "undefined" && (
            <Link href="/new_request">
              <div className="bg-green-600 text-white p-2 rounded-sm">+</div>
            </Link>
          )}
        </div>
        {data.map((request) => (
          <RequestCard key={request._id} request={request} me={me} />
        ))}
      </div>
    </div>
  );
}

export default RequestPage;
