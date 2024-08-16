import { create } from "zustand";
import { RequestType } from "@/pages/requests";

interface RequestStore {
  requests: RequestType[];
  setRequests: (requests: RequestType[]) => void;
}

const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  setRequests: (requests: RequestType[]) => set({ requests }),
}));

export default useRequestStore;
