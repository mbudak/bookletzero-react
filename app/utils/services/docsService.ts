import { Command } from "~/application/dtos/layout/Command";
import { DocsSidebar } from "~/application/sidebar/DocsSidebar";
import { SideBarItem } from "~/application/sidebar/SidebarItem";

// export async function getDoc(fileName: string): Promise<string> {
//   const items: Doc[] = [];
//   const dir = path.join("./", "./app/routes/docs/" + fileName);
//   const filePath = "./app/routes/docs/" + fileName;
//   const content = fs.readFileSync(path.join(dir, filePath), "utf8");
//   return ``;
// }

export function getDocCommands(): Command[] {
  const commands: Command[] = [];
  DocsSidebar.forEach((item) => {
    commands.push(...getCommandsFromItem(item, [], []));
  });
  return commands;
}

function getCommandsFromItem(item: SideBarItem, commands: Command[], parent: string[]) {
  if (item.path && item.title) {
    let description = item.description ?? "";
    if (parent.length > 0) {
      description = parent.join(" / ");
    }
    commands.push({
      command: "",
      title: item.title,
      description,
      toPath: item.path,
    });
  }
  item.items?.forEach((subItem) => {
    return getCommandsFromItem(subItem, commands, [...parent, item.title]);
  });

  return commands;
}
