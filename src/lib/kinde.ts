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
    subscription: {
        id: string;
        status: string;
        plan: {
            id: string;
            name: string;
            features: number;
        }
    } | null;
}


export async function getUserWithSubscription(): Promise<UserWithSubscription | null>{
    const kindeUser = await getUser();

    const user = await prisma.user.findUnique({
        where:{kindeId: kindeUser?.id},
        include:{
            subscription: {
                include:{
                    plan: true,
                }
            }
        }

    })

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