import { Question } from "@prisma/client";
import { db } from "../db.server";

export type QuestionWithDetails = Question & {

}

export async function getQuestionsByClass(id: any) {
    const questionClassId = Number(id);
    return await db.question.findMany(
        {
            where: {
                questionClassId
            }
        }
    )
}

