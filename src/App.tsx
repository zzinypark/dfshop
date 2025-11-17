import { useState, useEffect } from 'react';
import { ItemEfficiencyCard } from './components/ItemEfficiencyCard';
import './App.css';

interface PriceEfficiency {
  itemName: string;
  cashPrice: number;
  tradeableValue: number;
  boundValue: number;
  totalValue: number;
  efficiency: number;
  selectedBonusItems?: string[];
}

interface EfficiencyResponse {
  single: PriceEfficiency;
  package10?: PriceEfficiency;
}

interface ApiResponse {
  items: Record<string, EfficiencyResponse>;
  timestamp: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [results, setResults] = useState<Record<string, EfficiencyResponse>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // 컴포넌트 마운트 시 자동으로 데이터 로드
  useEffect(() => {
    loadItemsEfficiency();
  }, []);

  const loadItemsEfficiency = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/items/efficiency`);

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      setResults(data.items);
      setLastUpdated(data.timestamp);
    } catch (err) {
      console.error('Error fetching efficiency:', err);
      setError(
        `효율 계산 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadItemsEfficiency();
  };

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>던파 캐시 아이템 효율 계산기</h1>
        <p>인기 캐시 아이템의 경매장 기반 골드 효율을 확인하세요</p>
      </header>

      <div className="controls">
        <button onClick={handleRefresh} disabled={loading} className="refresh-button">
          {loading ? '계산 중...' : '시세 갱신'}
        </button>
        {lastUpdated && (
          <span className="last-updated">
            최종 업데이트: {formatLastUpdated(lastUpdated)}
          </span>
        )}
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>인기 아이템의 효율을 계산하고 있습니다...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRefresh}>다시 시도</button>
        </div>
      )}

      {Object.keys(results).length > 0 && !loading && (
        <div className="results">
          <h2>인기 아이템 효율</h2>

          <div className="results-grid">
            {Object.entries(results).map(([itemName, efficiency]) => (
              <div key={itemName} className="result-item">
                <ItemEfficiencyCard efficiency={efficiency.single} />
                {efficiency.package10 && (
                  <ItemEfficiencyCard efficiency={efficiency.package10} isPackage10 />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(results).length === 0 && !loading && !error && (
        <div className="empty-state">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      )}

      <footer className="app-footer">
        <p>
          데이터 출처: Neople Open API | 최근 10개 거래 내역의 평균 가격을 기반으로
          계산됩니다. | 실제 시세와 차이가 있을 수 있습니다.
        </p>
      </footer>
    </div>
  );
}

export default App;
