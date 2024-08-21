import { useState } from "react";
import makeRequest from "@/utils/makeRequest";
import { useSession } from "next-auth/react";
import { RequestType } from "@/store/requestStore";
import { IComment } from "@/models/comment";
import { AddComment } from "@/components/requests/addComment";
import Comment from "@/components/requests/comment";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { id } = query;
  const [data, comments] = await Promise.all([
    makeRequest({
      endpoint: "/request/read?id=" + id,
      method: "GET",
    }),
    makeRequest({
      endpoint: "/comment/read?id=" + id,
      method: "GET",
    }),
  ]);

  return {
    props: {
      request: data?.data ?? null,
      id: id,
      comments: comments?.data ?? [],
    },
  };
}

export type RequestPageProps = {
  request: RequestType | null;
  id: string;
  comments: IComment[];
};

function RequestPage(props: RequestPageProps) {
  const request_id = props.id;
  const request = props.request;
  const session = useSession();
  const username = session.data?.user?.name;

  const [comments, setComments] = useState<IComment[]>(props.comments);
  if (!request) {
    return <div>not found request id: {request_id}</div>;
  }
  const handleAddComment = async (
    text: string,
    setText: any,
    request_id: string
  ) => {
    if (!text) {
      alert("Please enter text");
      return;
    }
    setText("");
    const newComment = {
      _id: "new",
      request_id: request_id,
      user_id: "new",
      user_name: username,
      text: text,
      n_votes: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const oldComment = comments;
    setComments([newComment, ...comments] as IComment[]);
    const res = await makeRequest({
      endpoint: "/comment/create",
      method: "POST",
      body: { text: text, request_id: request_id },
    });
    if (res == null) {
      alert("Failed to add comment");
      setComments(oldComment);
      return;
    }
  };
  const handleUpdateComment = async (
    id: string,
    text: string,
    setText: any,
    isEditing: boolean,
    setIsEditing: any,
    init: IComment,
    setInit: any
  ) => {
    if (isEditing) {
      setText(text);
      const res = await makeRequest({
        endpoint: "/comment/update",
        method: "PUT",
        body: { comment_id: id, text: text },
      });

      if (res == null) {
        alert("Failed to update comment");
        setText(init.text);
      } else {
        setInit(res);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteComment = async (id: string, setIsVisible: any) => {
    setIsVisible(false);

    const res = await makeRequest({
      endpoint: "/comment/delete",
      method: "DELETE",
      body: { comment_id: id },
    });

    if (res == null) {
      alert("Failed to delete comment");
      setIsVisible(true);
    }
  };
  const me = session.data?.user?.oid;
  request!;
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-start">
        <div>Request</div>
        <div>title: {request.title}</div>
        <div>desc: {request.desc}</div>
        <div>n_comments: {request.n_comments}</div>
        <div>n_votes: {request.n_votes}</div>
      </div>
      <div>
        Comments
        {comments.map((comment) => {
          return (
            <Comment
              comment={comment}
              me={me}
              key={comment._id as string}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          );
        })}
        <AddComment request_id={request._id} onClick={handleAddComment} />
      </div>
    </div>
  );
}

export default RequestPage;
