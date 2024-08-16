import { RequestType } from "@/store/requestStore";
function RequestCard({request}: {request: RequestType}) {
  return (
    <div className="bg-blue-900 my-1">
      <div>title: {request.title}</div>
      <div>desc: {request.desc}</div>
      <div>owner: {request.user_id}</div>
    </div>
  );
}

export default RequestCard;
