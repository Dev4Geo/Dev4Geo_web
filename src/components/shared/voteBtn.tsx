export default function VoteBtn({
  isVoted,
  onClick,
  nVotes,
}: {
  isVoted: boolean;
  onClick: any;
  nVotes: number;
}) {
  return (
    <div
      onClick={onClick}
      className={`${
        isVoted ? "bg-green-500 text-white" : "bg-white text-green-500"
      } w-fit p-1 m-1`}
    >
      {isVoted ? "voted" : "vote"} {nVotes}
    </div>
  );
}
