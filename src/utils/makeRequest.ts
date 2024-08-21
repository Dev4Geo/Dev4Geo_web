type RequestProps = {
  endpoint: string;
  method: "POST" | "DELETE" | "GET" | "PUT" | "PATCH";
  body?: object;
  cookie?: object;
};

async function makeRequest({ endpoint, method, body, cookie }: RequestProps) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (cookie) {
    headers.append("cookie", JSON.stringify(cookie));
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/${endpoint}`, {
    method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    console.error(`Failed to ${method} request to ${endpoint}`);
    console.error(res);
  }

  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to parse JSON response");
    console.error(error);
    return null;
  }
}

export default makeRequest;
