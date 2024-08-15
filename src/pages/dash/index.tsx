import TextHeader from "@/components/textHeader";
import { useSession } from "next-auth/react";

function DashPage() {
  const { data: session } = useSession();
  return (
    <div>
      <TextHeader>Dashboard</TextHeader>
      {session && <div>name: {session?.user?.name}</div>}

      <div>dash</div>
    </div>
  );
}

export default DashPage;
