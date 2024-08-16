import { RequestType } from "./index";
function RequestCard({request}: {request: RequestType}) {
  return (
    <div className="bg-blue-900 my-1">
      <h2>title: {request.title}</h2>
      <p>desc: {request.desc}</p>
    </div>
  );
}

export default RequestCard;
