import { useState } from "react";

export function AddComment({
  request_id,
  onClick,
}: {
  request_id: string;
  onClick: any;
}) {
  const [text, setText] = useState("");

  return (
    <div>
      <div>add new comment</div>
      <input
        className="text-black"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div onClick={() => onClick(text, setText, request_id)}>submit</div>
    </div>
  );
}
