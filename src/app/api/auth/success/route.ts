import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(){
    try{
        const { getUser, isAuthenticated } = getKindeServerSession();

        const authentification = await isAuthenticated();

        if(!authentification){
            console.log("Utilisateur non authentifié");
            return NextResponse.redirect(
                new URL("/api/auth/login",process.env.KINDE_SITE_URL)
            )
        }


        const kindeUser = await getUser();
        if(!kindeUser || !kindeUser.id){
            console.log("Impossible de récupérer les informations de l'utilisateur Kinde");
            return NextResponse.redirect(
                new URL("/api/auth/login",process.env.KINDE_SITE_URL)
            )
        }

        console.log("Utilisateur Kinde récupéré:",{
            id: kindeUser.id,
            email: kindeUser.email,
            name: `${kindeUser.given_name} ${kindeUser.family_name}`
        })

        // synchronisation avec BDD
        const user = await prisma.user.upsert({
            where: { kindeId: kindeUser.id},
            // En cas ou l'utilisateur existe, on met à jour ses infos
            update:{
                email: kindeUser.email ?? undefined,
                firstName: kindeUser.given_name ?? undefined,
                lastName: kindeUser.family_name ?? undefined,
                profileImage : kindeUser.picture ?? undefined,
            },
            // En cas ou l'utilisateur n'existe pas, on le crée
            create:{
                kindeId: kindeUser.id,
                email: kindeUser.email!,
                firstName: kindeUser.given_name,
                lastName: kindeUser.family_name,
                profileImage : kindeUser.picture,
            },
            // puisqu'on va creer un utilisateur avec une subscription liée, on l'inclut dans le retour
            include: { // Include = Jointure
                subscription: true,
            }
        })

        console.log("Utilisateur synchronise avec la BDD:", user.firstName);

        // Creation d'un abonnement
        if(!user.subscription){
            console.log("Aucun abonnement trouvé pour l'utilisateur. Création d'un abonnement par défaut.");
            const freePlan = await prisma.plan.findFirst({where : { name: "Free"}})

            if(freePlan){
                const subscription = await prisma.subscription.create({
                    data: {
                        userId: user.id,
                        planId: freePlan.id,
                        status: "ACTIVE",
                        billingCycle: "MONTHLY"
                    }
                })
                console.log("Abonnement créé pour l'utilisateur:", subscription.id);
            }
        }

        return NextResponse.redirect(
            new URL("/dashboard", process.env.KINDE_SITE_URL)
        )


    }catch (error){
        console.error("Erreur lors du traitement de la réussite de l'authentification:", error);
        return NextResponse.redirect(
            new URL("/api/auth/login",process.env.KINDE_SITE_URL)
        )
    }

}