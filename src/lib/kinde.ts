import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./prisma";



export interface KindeUser{
    id: string;
    email: string | null;
    given_name: string | null;
    family_name: string | null;
    picture: string | null;
}

export interface UserWithSubscription{
    id : string;
    kindeId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
    subscription: {
        id: string;
        status: string;
        billingCycle: string;
        plan: {
            id: string;
            name: string;
            description: string | null;
            priceMonthly: number;
            priceYearly: number;
            features: any;
        }
    } | null;
}


export async function getUserWithSubscription(): Promise<UserWithSubscription | null>{
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
        return null;
    }

    // Récupérer l'utilisateur de la base de données
    let user = await prisma.user.findUnique({
        where:{kindeId: kindeUser.id},
        include:{
            subscription: {
                include:{
                    plan: true,
                }
            }
        }
    });

    // Si l'utilisateur n'existe pas, le créer
    if (!user) {
        user = await prisma.user.create({
            data: {
                kindeId: kindeUser.id,
                email: kindeUser.email || '',
                firstName: kindeUser.given_name,
                lastName: kindeUser.family_name,
                profileImage: kindeUser.picture,
            },
            include: {
                subscription: {
                    include: {
                        plan: true,
                    }
                }
            }
        });
    } else {
        // Synchroniser la photo de profil si elle a changé
        if (user.profileImage !== kindeUser.picture) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    profileImage: kindeUser.picture,
                    firstName: kindeUser.given_name,
                    lastName: kindeUser.family_name,
                },
                include: {
                    subscription: {
                        include: {
                            plan: true,
                        }
                    }
                }
            });
        }
    }

    return user as UserWithSubscription;
}


export async function getUser(): Promise<KindeUser | null>{
    const { getUser, isAuthenticated} = getKindeServerSession();

    const authentification = await isAuthenticated();

    if(!authentification){
        return null;
    }

    const user = await getUser();
    return user as KindeUser | null;

}