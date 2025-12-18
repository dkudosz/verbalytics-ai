import { Card, CardContent } from "@/components/ui/card";

type ValueItem = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

export default function ValuesGrid({ values }: { values: ValueItem[] }) {
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <Card key={index} className="shadow-card hover:shadow-glow transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <value.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


