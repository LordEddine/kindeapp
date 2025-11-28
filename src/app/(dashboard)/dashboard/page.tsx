import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserWithSubscription } from "@/lib/kinde";


export default async function DashboardPage() {
  
const user = await getUserWithSubscription();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Infos utilisateur */}
      <div className="rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Mon Profil</h2>
        <p><strong>Nom :</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email :</strong> {user?.email}</p>
      </div>

      {/* Infos abonnement */}
      <div className="rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Mon Abonnement</h2>
        <p><strong>Plan :</strong> {user?.subscription?.plan.name ?? "Aucun"}</p>
        <p><strong>Statut :</strong> {user?.subscription?.status ?? "N/A"}</p>
      </div>

      {/* Debug : voir tout l'objet */}
      <pre className="mt-6 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}