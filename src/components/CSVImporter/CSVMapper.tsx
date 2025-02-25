
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";

interface CSVMapperProps {
  headers: string[];
  data: string[][];
  onComplete: (mappedData: any[]) => void;
}

const LEAD_FIELDS = {
  'contact_details.first_name': 'Nombre',
  'contact_details.last_name': 'Apellido',
  'contact_details.phone_number': 'Teléfono',
  'contact_details.email': 'Email',
  'contact_details.postal_code': 'Código Postal',
  'contact_details.province': 'Provincia',
  'contact_details.country': 'País',
  'contact_details.channel_origin': 'Canal de Origen',
  'contact_details.channel_suborigin': 'Subcanal',
  'qualification_details.university_access': 'Acceso Universidad',
  'qualification_details.access': 'Tipo de Acceso',
  'qualification_details.current_course': 'Curso Actual',
  'qualification_details.experience': 'Experiencia',
};

const CSVMapper = ({ headers, data, onComplete }: CSVMapperProps) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleMapping = (csvHeader: string, leadField: string) => {
    setMapping(prev => ({
      ...prev,
      [csvHeader]: leadField
    }));
  };

  const handleImport = () => {
    const mappedData = data.map(row => {
      const lead: any = {
        contact_details: {},
        qualification_details: {},
        tenant: "chesterton",
        tags: [],
        contactType: "POTENTIAL",
        notes: ""
      };

      headers.forEach((header, index) => {
        const mappedField = mapping[header];
        if (mappedField) {
          const [section, field] = mappedField.split('.');
          if (section && field) {
            lead[section][field] = row[index];
          }
        }
      });

      return lead;
    });

    onComplete(mappedData);
    toast.success(`${mappedData.length} leads importados correctamente`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium mb-4">Mapear Campos</h3>
        <div className="grid gap-4">
          {headers.map((header, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 items-center">
              <div className="text-sm font-medium text-gray-700">{header}</div>
              <Select
                value={mapping[header]}
                onValueChange={(value) => handleMapping(header, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar campo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_FIELDS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium mb-4">Vista Previa</h3>
        <ScrollArea className="h-64 rounded-md border">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  {headers.map((header, index) => (
                    <th key={index} className="p-2 text-sm font-medium text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2 text-sm text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleImport}
          className="px-6"
        >
          Importar Datos
        </Button>
      </div>
    </div>
  );
};

export default CSVMapper;
