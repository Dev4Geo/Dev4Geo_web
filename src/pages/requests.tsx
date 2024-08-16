import TextHeader from "@/components/shared/textHeader";
import RequestCard from "@/components/requests/requestCard";
import Link from "next/link";
import { useEffect } from "react";
import fetchAllRequest from "@/components/fetch/allRequest";
import useRequestStore, { RequestType } from "@/store/requestStore";

export async function getServerSideProps() {
  const data = await fetchAllRequest();

  return {
    props: {
      requests: data,
    },
  };
}

export type RequestPageProps = {
  requests: RequestType[];
};

function RequestPage(props: RequestPageProps) {
  const { requests, setRequests } = useRequestStore();

  useEffect(() => {
    setRequests(props.requests);
  }, [props.requests, setRequests]);

  const data = requests.length > 0 ? requests : props.requests;
  return (
    <div>
      <div className="flex flex-col mx-10 space-y-2">
        <div className="flex flex-row justify-between">
          <TextHeader>Requests</TextHeader>
          <Link href="/new_request">
            <div className="bg-green-600 text-white p-2 rounded-sm">+</div>
          </Link>
        </div>
        {data.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
    </div>
  );
}

export default RequestPage;
