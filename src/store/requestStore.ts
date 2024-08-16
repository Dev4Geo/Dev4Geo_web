import { create } from "zustand";

interface RequestStore {
  requests: RequestType[];
  setRequests: (requests: RequestType[]) => void;
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
  setRequests: (requests: RequestType[]) => set({ requests }),
}));

export default useRequestStore;
