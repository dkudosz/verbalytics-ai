import { Card, CardContent } from "@/components/ui/card";

type TeamMember = {
  name: string;
  role: string;
  initials: string;
};

export default function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {team.map((member, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="pt-6 text-center">
              <div className="h-24 w-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto text-primary-foreground text-2xl font-bold">
                {member.initials}
              </div>
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


