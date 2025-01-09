import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { QueryInput } from './components/QueryInput';
import { ResultsView } from './components/ResultsView';
import { initializeDuckDB, loadCSV, queryDatabase } from './lib/duckdb';
import { generateSQLQuery } from './lib/gemini';
import { Database, BrainCog, LogOut } from 'lucide-react';

interface App1Props {
  userProfile: any;
  onLogout: () => void;
}

function App1({ userProfile, onLogout }: App1Props) {
  const [isDbReady, setIsDbReady] = useState(false);
  const [tableSchema, setTableSchema] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    initializeDuckDB().then(() => setIsDbReady(true));
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const { tableName, schema } = await loadCSV(file);
      setTableSchema({ tableName, schema });
    } catch (err) {
      setError('Error loading file: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySubmit = async (prompt: string) => {
    if (!tableSchema) {
      setError('Please upload a CSV file first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const columns = tableSchema.schema
        .map((col: any) => `${col.column_name} (${col.data_type})`)
        .join(', ');
      
      const generatedQuery = await generateSQLQuery(prompt, tableSchema);

      if (!generatedQuery) throw new Error('Generated SQL query is invalid');

      setSqlQuery(generatedQuery);

      const queryResults = await queryDatabase(generatedQuery);
      setResults(queryResults);
    } catch (err) {
      setError('Error executing query: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center relative">
          <div className="absolute right-0 top-0">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-8 h-8 text-blue-500" />
            <BrainCog className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">CSV Analytics with DuckDB</h1>
          <p className="text-gray-400">Upload your CSV and ask questions in natural language</p>
          <div className="mt-2 text-sm text-gray-400">
            Welcome, {userProfile?.name}!
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </header>

        <main className="max-w-4xl mx-auto space-y-8">
          {!isDbReady ? (
            <div className="text-center">Initializing database...</div>
          ) : (
            <>
              {!tableSchema && <FileUpload onFileSelect={handleFileSelect} />}

              {tableSchema && (
                <QueryInput 
                  onSubmit={handleQuerySubmit}
                  isLoading={isLoading}
                />
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {results.length > 0 && (
                <ResultsView 
                  data={results}
                  sqlQuery={sqlQuery}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App1;