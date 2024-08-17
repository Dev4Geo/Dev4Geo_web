import { create } from "zustand";

interface RequestStore {
  requests: RequestType[];
  votedRequestIds: string[];
  setRequests: (requests: RequestType[]) => void;
  setVotedRequestIds: (ids: string[]) => void;
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
const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  votedRequestIds: [],
  setRequests: (requests: RequestType[]) => set({ requests }),
  setVotedRequestIds: (ids) => set({ votedRequestIds: ids }),
}));

export default useRequestStore;
