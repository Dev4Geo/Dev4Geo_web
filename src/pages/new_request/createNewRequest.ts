type CreateNewRequestProps = {
  title: string;
  desc: string;
};

async function createNewRequest({ title, desc }: CreateNewRequestProps) {
  if (!title || !desc) {
    return { status: "error", message: "Title and description are required" };
  }
  const newRequest = {
    title,
    desc,
  };

  const res = await fetch("/api/request/create", {
    method: "POST",
    body: JSON.stringify(newRequest),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Failed to create request");
  }

  const data = await res.json();
  return data;
}

export default createNewRequest;
