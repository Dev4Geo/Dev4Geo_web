import { IComment } from "@/models/comment";
import { useState } from "react";
import VoteBtn from "../shared/voteBtn";

function Comment({
  comment,
  me,
  onUpdate,
  onDelete,
  isVoted,
  onVote,
}: {
  comment: IComment;
  me: string;
  onUpdate: any;
  onDelete: any;
  isVoted: boolean;
  onVote: any;
}) {
  const [init, setInit] = useState(comment);
  const [text, setText] = useState(init.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isAuth = me === comment.user_id;
  return (
    <div
      className={`${isVisible ? "" : "hidden"} flex flex-row bg-slate-700 px-5`}
    >
      <div className="flex flex-col">
        {isEditing ? (
          <input
            className="text-black"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <div>{text}</div>
        )}
        <div>{comment.user_name}</div>
      </div>
      {isAuth && (
        <div>
          <div
            onClick={() =>
              onUpdate(
                comment._id,
                text,
                setText,
                isEditing,
                setIsEditing,
                init,
                setInit
              )
            }
            className="bg-yellow-500 w-fit p-1 m-1"
          >
            update
          </div>
          <div
            onClick={() => onDelete(comment._id, setIsVisible)}
            className="bg-red-700 w-fit p-1 m-1"
          >
            del
          </div>
        </div>
      )}
      <div>
        <VoteBtn
          isVoted={isVoted}
          onClick={() => onVote(comment._id, isVoted)}
          nVotes={comment.n_votes}
        />
      </div>
    </div>
  );
}
export default Comment;
