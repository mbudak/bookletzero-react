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

export async function getQuestionClassesByRoot(id: any) {    
    const param = Number(id);
    return await db.questionClass.findMany(
        {
            where: {                 
                successorId: param
            }
        }
    )
} 

export async function getQuestionClass(id: string) {
    const param = Number(id);
    return await db.questionClass.findUnique({where: { id: param }});
}

export async function questionClassUpdate(id: string, data: {
    title: string
}) : Promise<QuestionClass> {
    const param = Number(id);
    return await db.questionClass.update({
        where: { id: param },
        data: {
            title: data.title
        }
    });
}

export async function CreateQuestionClass(createdBy: string, title: string){
    const path = "ATPL";

    return await db.questionClass.create({
        data: {
            createdBy,
            title,
            isRoot: false,
            path
        }
    })

}
