type DeleteRequestProps = {
  id: string;
};

async function delRequest({ id }: DeleteRequestProps) {
  if (!id) {
    return { status: "error", message: "ID is required" };
  }

  const data = {
    id
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/request/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    console.error("Failed to create request");
    console.error(res);
  }

  const out = await res.json();
  return out;
}

export default delRequest;
