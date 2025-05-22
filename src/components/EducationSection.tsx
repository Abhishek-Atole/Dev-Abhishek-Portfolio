
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const educationData = [
  {
    institution: "Shri Sant Gajanan Maharaj College of Engineering",
    location: "Shegaon",
    degree: "B.E. in Electronics & Telecommunication",
    duration: "2020–2024",
    description: "Specialized in electronics & telecommunication engineering while focusing on programming and systems development."
  },
  {
    institution: "The New Era High School",
    location: "Jalgaon Jamod",
    degree: "12th, General Science",
    duration: "2019–2020",
    description: "Completed higher secondary education with focus on science subjects including Physics, Chemistry, and Mathematics."
  }
];

const EducationSection = () => {
  return (
    <section id="education" className="py-16">
      <div className="container mx-auto">
        <h2 className="section-heading">Education</h2>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          {educationData.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <GraduationCap className="text-primary" size={24} />
                  {item.institution}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{item.location}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-2">{item.degree}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
