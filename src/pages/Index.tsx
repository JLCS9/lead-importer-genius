
import CSVImporter from '../components/CSVImporter/CSVImporter';

const Index = () => {
  const handleImportComplete = (mappedData: any[]) => {
    console.log('Datos mapeados:', mappedData);
    // Aquí puedes enviar los datos a tu backend
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <CSVImporter onComplete={handleImportComplete} />
    </div>
  );
};

export default Index;
