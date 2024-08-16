type RequestProps = {
  endpoint: string;
  method: "POST" | "DELETE" | "GET" | "PUT" | "PATCH";
  body?: object;
};

async function makeRequest({ endpoint, method, body }: RequestProps) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    console.error(`Failed to ${method} request to ${endpoint}`);
    console.error(res);
  }

  const data = await res.json();
  return data;
}

export default makeRequest;
