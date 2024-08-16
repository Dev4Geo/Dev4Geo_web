import useRequestStore, { RequestType } from "@/store/requestStore";
import delRequest from "../fetch/deleteRequest";
import fetchAllRequest from "../fetch/allRequest";
import router from "next/router";

type RequestCardProps = {
  request: RequestType;
  me: string;
};

function RequestCard({ request, me }: RequestCardProps) {
  const { setRequests } = useRequestStore();

  async function handleDelete(me: string) {
    const confirm = await window.confirm("Are you sure you want to delete this request?");
    if (!confirm) {
      return;
    }

    const res = await delRequest({ id: me });
    if (res.status === "error") {
      console.error(res.message);
    }

    const requests = await fetchAllRequest();
    setRequests(requests);

    router.push("/requests");
  }
  return (
    <div className="bg-blue-900 my-1">
      <div>title: {request.title}</div>
      <div>desc: {request.desc}</div>
      <div>owner: {request.user_id}</div>
      {me === request.user_id && (
        <div
          onClick={() => handleDelete(request._id)}
          className="bg-red-600 w-fit p-1 m-1 hover:cursor-pointer"
        >
          delete
        </div>
      )}
    </div>
  );
}

export default RequestCard;
