import { NextResponse } from "next/server";
import { getUserWithSubscription } from "@/lib/kinde";

export async function GET() {
  try {
    const user = await getUserWithSubscription();
    
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}