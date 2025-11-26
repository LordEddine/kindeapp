import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';


const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main(){

    const testutilisateur = await prisma.user.create({
        data:{
            kindeId: "test123",
            email:"test@gmail.com",
            firstName : "Test",
            lastName : "Utilisateur"
        }
    })

    console.log("Utilisateur de test créé :", testutilisateur);

    // .findUnique pour recuperer un seul utilisateur  Select * from user where email = testutilisateur.email
    const retrouveruser = await prisma.user.findUnique({
        where:{email: testutilisateur.email},
        include:{subscription:true} // Equivalent a une jointure SQL
    })

    console.log("Utilisateur retrouvé :", retrouveruser);
    // .findMany pour recuperer plusieurs utilisateurs Select * from user 


}

main()
    .then(async() => {
        await prisma.$disconnect();
    })
    .catch(async(e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });