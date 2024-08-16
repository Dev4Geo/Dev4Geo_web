import TextHeader from "@/components/textHeader";
import RequestCard from "./requestCard";
import Link from "next/link";
import { useEffect } from "react";
import fetchAllRequest from "./fetch";
import useRequestStore from "@/store/requestStore";

export async function getServerSideProps() {
  const data = await fetchAllRequest();

  return {
    props: {
      requests: data,
    },
  };
}

export type RequestType = {
  _id: string;
  title: string;
  desc: string;
  created_at: Date;
  updated_at: Date;
  n_votes: number;
  n_comments: number;
  status: string;
  user_id: string;
  tags: string[]; // add this feature later
};

export type RequestPageProps = {
  requests: RequestType[];
};

function RequestPage(props: RequestPageProps) {
  const { requests, setRequests } = useRequestStore();

  useEffect(() => {
    setRequests(props.requests);
  }, []);

  const data = requests.length > 0 ? requests : props.requests;
  return (
    <div>
      <div className="flex flex-col mx-10 space-y-2">
        <div className="flex flex-row justify-between">
          <TextHeader>Requests</TextHeader>
          <div className="bg-green-600 text-white p-2 rounded-sm">
            <Link href="/new_request">+</Link>
          </div>
        </div>
        {data.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>
    </div>
  );
}

export default RequestPage;
