const fetchAllRequest = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/request/read`);
  if (!res.ok) {
    console.error("Failed to fetch");
  }
  const data = await res.json();
  return data.data;
};

export default fetchAllRequest;
