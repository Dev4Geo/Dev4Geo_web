import { useState } from "react";
import router from "next/router";
import useRequestStore from "@/store/requestStore";
import makeRequest from "@/utils/makeRequest";

const NewRequestPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { setRequests } = useRequestStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await makeRequest({
      endpoint: "/request/create",
      method: "POST",
      body: { title, desc: description}
    });

    // fetch all requests again
    const requests = await makeRequest({
      endpoint: "/request/read",
      method: "GET",
    })
    setRequests(requests)

    // Clear the form
    setTitle("");
    setDescription("");

    router.push("/requests");
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewRequestPage;
