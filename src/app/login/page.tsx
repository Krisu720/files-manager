import { getServerSession } from "next-auth";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";



const Page = async ({}) => {
 
  const session = await getServerSession()


  return session ? redirect("/panel") : (
    <div className="container">
      <LoginForm/>
    </div>
  ) ;
};

export default Page;
