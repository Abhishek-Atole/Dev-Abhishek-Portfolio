
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, ExternalLink } from "lucide-react";

interface CertificateFormData {
  title: string;
  issuer: string;
  verification_link: string;
  issue_date: string;
  description: string;
  image_url: string;
  certificate_id?: string;
  expiration_date?: string;
}

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<CertificateFormData>;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  onCancel
}) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    title: initialData.title || "",
    issuer: initialData.issuer || "",
    verification_link: initialData.verification_link || "",
    issue_date: initialData.issue_date || "",
    description: initialData.description || "",
    image_url: initialData.image_url || "",
    certificate_id: initialData.certificate_id || "",
    expiration_date: initialData.expiration_date || ""
  });

  const { toast } = useToast();

  const handleInputChange = (field: keyof CertificateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Certificate title is required.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.issuer.trim()) {
      toast({
        title: "Validation Error",
        description: "Issuing authority is required.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.verification_link && !isValidUrl(formData.verification_link)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid verification URL.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid image URL.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const predefinedCertificates = [
    {
      title: "C Programming",
      issuer: "LinkedIn Learning",
      verification_link: "https://www.linkedin.com/learning/certificates/8cbed9814a163b91f00feac525839739085741dd84c32f2e3e6565c290c2420e?trk=share_certificate",
      issue_date: "2025-03-24",
      description: "Complete Guide to C Programming Foundations",
      image_url: "https://media.licdn.com/dms/image/v2/D4D22AQHqW5Y5Z5Y5Z5/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1640000000000?e=1640000000&v=beta&t=1640000000"
    },
    {
      title: "Master C++ Programming From Beginner To Advance 2025 Edition",
      issuer: "Udemy",
      verification_link: "https://www.udemy.com/certificate/UC-5f7e3c2a-9296-46a2-af0f-d3e7b7b2ccc1/",
      issue_date: "2025-03-24",
      description: "Comprehensive C++ programming course covering advanced concepts",
      image_url: "https://udemy-certificate-image.com/c++certificate.jpg"
    },
    {
      title: "C Programming for Embedded Applications",
      issuer: "LinkedIn Learning",
      verification_link: "https://www.linkedin.com/learning/certificates/446728be8710513dd52a7b731e6152e99033d17d30cdd82f2330ccf7a1344b9c?trk=share_certificate",
      issue_date: "2025-03-24",
      description: "Specialized course for embedded systems programming",
      image_url: "https://media.licdn.com/dms/image/v2/D4D22AQHembedded/feedshare-shrink_2048_1536/0/1640000000000"
    },
    {
      title: "Getting Started with Linux",
      issuer: "LinkedIn Learning",
      verification_link: "https://www.linkedin.com/learning/paths/getting-started-with-linux",
      issue_date: "2025-03-16",
      description: "Learning Path for Linux System Administration",
      image_url: "https://media.licdn.com/dms/image/v2/D4D22AQHlinux/feedshare-shrink_2048_1536/0/1640000000000"
    },
    {
      title: "Heterogeneous Parallel Programming using CUDA and OpenCL",
      issuer: "AstroMediComp",
      verification_link: "https://astromedicomp.org/Certificate/StudentCertificate.php?cuid=HPP-2025-ILTOCF649M",
      issue_date: "2025-03-16",
      description: "Certificate of Attendance for parallel programming seminar",
      image_url: "https://astromedicomp.org/images/cuda-certificate.jpg"
    },
    {
      title: "Introduction to Cybersecurity",
      issuer: "Cisco Networking Academy",
      verification_link: "https://www.credly.com/badges/c7ee13ea-2f69-4cae-815e-dd15b6e068ad/public_url",
      issue_date: "2023-12-29",
      description: "Cybersecurity Foundation course through Cisco program",
      image_url: "https://images.credly.com/size/340x340/images/af8c6b4e-fc31-47c4-8dcb-eb7a2065dc5b/I2CS__1_.png"
    }
  ];

  const handleLoadPredefined = (cert: typeof predefinedCertificates[0]) => {
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      verification_link: cert.verification_link,
      issue_date: cert.issue_date,
      description: cert.description,
      image_url: cert.image_url,
      certificate_id: "",
      expiration_date: ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Load Demo Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {predefinedCertificates.map((cert, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleLoadPredefined(cert)}
                className="h-auto p-3 text-left justify-start"
              >
                <div className="truncate">
                  <div className="font-medium text-xs">{cert.title}</div>
                  <div className="text-xs text-muted-foreground">{cert.issuer}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Certificate Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Master C++ Programming"
                  required
                />
              </div>
              <div>
                <Label htmlFor="issuer">Issuing Authority *</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => handleInputChange("issuer", e.target.value)}
                  placeholder="e.g., Udemy, LinkedIn Learning"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => handleInputChange("issue_date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => handleInputChange("expiration_date", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="certificate_id">Certificate ID</Label>
              <Input
                id="certificate_id"
                value={formData.certificate_id}
                onChange={(e) => handleInputChange("certificate_id", e.target.value)}
                placeholder="e.g., UC-5f7e3c2a-9296-46a2-af0f"
              />
            </div>

            <div>
              <Label htmlFor="verification_link">Verification URL</Label>
              <div className="flex gap-2">
                <Input
                  id="verification_link"
                  type="url"
                  value={formData.verification_link}
                  onChange={(e) => handleInputChange("verification_link", e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                {formData.verification_link && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={formData.verification_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">Certificate Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://..."
              />
              {formData.image_url && (
                <div className="mt-2 p-2 border rounded-lg bg-muted/50">
                  <div className="text-sm font-medium mb-2">Image Preview:</div>
                  <img 
                    src={formData.image_url} 
                    alt="Certificate preview"
                    className="w-full max-w-sm h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the certificate..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Certificate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateForm;
