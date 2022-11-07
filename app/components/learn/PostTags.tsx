import { LearnPostTag, LearnTag } from "@prisma/client";
import { getTailwindColor } from "~/utils/shared/ColorUtils";

interface Props {
  items: (LearnPostTag & { tag: LearnTag })[];
}
export default function LearnTags({ items }: Props) {
  return (
    <div className="flex space-x-1 text-xs items-center">
      {items.map((learnTag, idx) => {
        return (
          <div key={idx}>
            <span className={getTailwindColor(learnTag.tag.color)}> #</span>
            {learnTag.tag.name}
          </div>
        );
      })}
    </div>
  );
}
