import TabsVertical from "./TabsVertical";

export default function PreviewTabsVertical() {
  return (
    <div className="space-y-2 w-full not-prose">
      <TabsVertical
        className="w-full sm:w-auto"
        tabs={[
          { name: "Home", routePath: "/docs/components" },
          {
            name: "Components",
            routePath: "/docs/components/tabs",
          },
        ]}
      />
    </div>
  );
}
