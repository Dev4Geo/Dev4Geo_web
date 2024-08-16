import TextHeader from "@/components/textHeader";
import RequestCard from "./requestCard";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.HOST}/api/request/read`);
  if (!res.ok) {
    console.error("Failed to fetch");
  }
  const data = await res.json();

  return {
    props: {
      requests: data.data,
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
  return (
    <div>
      <div className="flex flex-col mx-10 space-y-2">
        <div className="flex flex-row justify-between">
          <TextHeader>Requests</TextHeader>
          <div className="bg-green-600 text-white p-2 rounded-sm">
            <Link href="/new_request">+</Link>
          </div>
        </div>
        {props.requests.map((request) => (
          <RequestCard request={request} />
        ))}
      </div>
    </div>
  );
}

export default RequestPage;
