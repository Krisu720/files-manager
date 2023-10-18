import Logout from "@/components/Logout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PanelDetails from "./PanelDetails";

const Page = async ({}) => {
  const session = await getServerSession();

  return session ? (
    <div className="container mt-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-2xl font-extrabold tracking-tighter">
            Logged as, {session.user.email}.
          </h1>
          <Logout />
        </div>
      </div>

      <PanelDetails />
    </div>
  ) : (
    redirect("/login")
  );
};

export default Page;
