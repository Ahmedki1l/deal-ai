import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/lib/dictionaries";
import { LocaleProps } from "@/types/locale";
import { AppearanceForm } from "../../../../../components/appearance-form";

type AppearanceProps = Readonly<{
  params: LocaleProps;
}>;
export default async function Appearance({
  params: { lang },
}: AppearanceProps) {
  const dic = await getDictionary(lang);
  const c = dic?.["dashboard"]?.["user"]?.["settings"]?.["appearance"];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{c?.["appearance"]}</h3>
        <p className="text-sm text-muted-foreground">
          {c?.["customize your appearance settings and preferences."]}
        </p>
      </div>
      <Separator />
      <AppearanceForm dic={dic} />
    </div>
  );
}
