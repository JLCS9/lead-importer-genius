
import { useState } from 'react';
import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import CSVMapper from './CSVMapper';
import { useCSVReader } from 'react-papaparse';

interface CSVImporterProps {
  onComplete: (mappedData: any[]) => void;
}

const CSVImporter = ({ onComplete }: CSVImporterProps) => {
  const { CSVReader } = useCSVReader();
  const [csvData, setCSVData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleUploadAccepted = (results: any) => {
    const { data } = results;
    if (data && data.length > 0) {
      setHeaders(data[0]);
      setCSVData(data.slice(1));
      setIsFileSelected(true);
      toast.success("Archivo CSV cargado correctamente");
    }
  };

  const handleUploadError = (error: any) => {
    toast.error("Error al cargar el archivo CSV");
    console.error('Error:', error);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Importar Leads</h2>
        <p className="text-muted-foreground">
          Sube un archivo CSV para importar leads al sistema
        </p>
      </div>

      {!isFileSelected ? (
        <CSVReader
          onUploadAccepted={handleUploadAccepted}
          onUploadRejected={handleUploadError}
        >
          {({ getRootProps, acceptedFile }: any) => (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-gray-300 transition-colors cursor-pointer bg-gray-50/50"
            >
              {acceptedFile ? (
                <div className="space-y-2">
                  <Check className="w-12 h-12 mx-auto text-green-500" />
                  <p className="text-sm text-gray-600">{acceptedFile.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileUp className="w-12 h-12 mx-auto text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Arrastra tu archivo CSV aquí o haz click para seleccionar
                    </p>
                    <p className="text-xs text-gray-500">
                      Archivos soportados: CSV
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CSVReader>
      ) : (
        <CSVMapper
          headers={headers}
          data={csvData}
          onComplete={onComplete}
        />
      )}
    </div>
  );
};

export default CSVImporter;
