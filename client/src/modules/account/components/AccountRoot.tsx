import accountImage from "@/assets/images/account.jpg";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/Tabs";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { AddressBook } from "./AddressBook";
import { OrderHistory } from "./OrderHistory";

export function AccountRoot() {
  useDocumentTitle("My account");
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px]">
        <img src={accountImage} alt="" className="h-full w-full object-cover object-center" />
      </div>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold">My account</h1>
          {user && <p className="text-muted-foreground">Signed in as {user.email}</p>}
        </div>
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
          <TabsContent value="addresses">
            <AddressBook />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
