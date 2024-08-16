import TextHeader from "@/components/shared/textHeader";
import { useSession } from "next-auth/react";

function DashPage() {
  const { data: session } = useSession();
  return (
    <div>
      <TextHeader>Dashboard</TextHeader>
      <div className="mt-2">
        {session && <div>id: {session?.user?.oid}</div>}
        {session && <div>name: {session?.user?.name}</div>}
        {session && <div>email: {session?.user?.email}</div>}
      </div>
    </div>
  );
}

export default DashPage;
