import React, { useEffect, useState } from 'react';
import { testDatabaseConnection, testAuthentication } from '../utils/databaseTest';

interface ConnectionStatus {
  database: { success: boolean; message?: string; error?: string; };
  auth: { success: boolean; message?: string; error?: string; };
}

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    database: { success: false },
    auth: { success: false }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      try {
        const [dbResult, authResult] = await Promise.all([
          testDatabaseConnection(),
          testAuthentication()
        ]);

        setStatus({
          database: {
            success: dbResult.success,
            message: dbResult.message,
            error: dbResult.error
          },
          auth: {
            success: authResult.success,
            message: authResult.message,
            error: authResult.error
          }
        });
      } catch (error) {
        console.error('Error running connection tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    runTests();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 p-4 rounded-lg shadow-lg z-50">
        <div className="text-blue-800">
          🔄 Testing database connection...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 p-4 rounded-lg shadow-lg z-50 min-w-[300px]">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Supabase Connection Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${status.database.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="font-medium text-gray-700">Database:</span>
          <span className={status.database.success ? 'text-green-600' : 'text-red-600'}>
            {status.database.success ? 'Connected ✅' : 'Failed ❌'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${status.auth.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="font-medium text-gray-700">Auth:</span>
          <span className={status.auth.success ? 'text-green-600' : 'text-red-600'}>
            {status.auth.success ? 'Available ✅' : 'Failed ❌'}
          </span>
        </div>
      </div>

      {(status.database.message || status.auth.message) && (
        <div className="mt-3 text-sm text-gray-600">
          {status.database.message && <div>📊 {status.database.message}</div>}
          {status.auth.message && <div>🔐 {status.auth.message}</div>}
        </div>
      )}

      {(status.database.error || status.auth.error) && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {status.database.error && <div>DB Error: {status.database.error}</div>}
          {status.auth.error && <div>Auth Error: {status.auth.error}</div>}
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;