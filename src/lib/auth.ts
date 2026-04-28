import{checkout, polar, portal} from "@polar-sh/better-auth";
import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";

import prisma from "@/lib/db";
import { PrismaClient } from "@/generated/prisma/client";

import {polarClient} from "./polar";

export const auth = betterAuth({

        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),

        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        plugins:[
            polar({
                client: polarClient,
                createCustomerOnSignUp:true,
                use:[
                    checkout({
                        products: [
                            {
                                productId:"28b5966a-8448-4aa5-96b3-37ec741f230f",
                                slug:"pro"
                            }
                        ],
                        successUrl: process.env.POLAR_SUCCESS_URL,
                        authenticatedUsersOnly:true,
                    }),
                    portal(),                           
                ],
            }) 
        ],
});