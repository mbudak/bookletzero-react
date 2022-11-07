import { QuestionClass } from "@prisma/client";
import { db } from "../db.server";

export type QuestionClassWithDetails = QuestionClass & {

}


export async function getRootQuestionClasses() {
    return await db.questionClass.findMany(
        {
            where: {                 
                successor: null
            }
        }
    )
} 

export async function getQuestionClassesByRoot(id: number) {    
    return await db.questionClass.findMany(
        {
            where: {                 
                successorId: id 
            }
        }
    )
} 
