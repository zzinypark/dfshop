import { useState, useEffect } from 'react';
import { PriceEfficiency } from './types';
import { NeoPleAPI } from './services/api';
import { EfficiencyCalculator } from './services/calculator';
import { ItemEfficiencyCard } from './components/ItemEfficiencyCard';
import { POPULAR_ITEMS } from './data/items';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [results, setResults] = useState<
    Map<string, { single: PriceEfficiency; package10?: PriceEfficiency }>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // API 키 설정 시 자동으로 데이터 로드
  useEffect(() => {
    if (isApiKeySet && apiKey) {
      loadPopularItems();
    }
  }, [isApiKeySet]);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      alert('API 키를 입력해주세요.');
      return;
    }
    setIsApiKeySet(true);
    setError(null);
  };

  const loadPopularItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const api = new NeoPleAPI(apiKey);
      const calculator = new EfficiencyCalculator(api);

      const efficiencies = await calculator.calculateMultipleItems(POPULAR_ITEMS);

      setResults(efficiencies);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error calculating efficiencies:', err);
      setError(
        `효율 계산 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPopularItems();
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleString('ko-KR', {
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

      {!isApiKeySet ? (
        <div className="api-key-section">
          <h2>API 키 설정</h2>
          <p>
            Neople Open API 키가 필요합니다.{' '}
            <a
              href="https://developers.neople.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              여기
            </a>
            에서 발급받을 수 있습니다.
          </p>
          <div className="api-key-input">
            <input
              type="text"
              placeholder="API 키를 입력하세요"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetApiKey()}
            />
            <button onClick={handleSetApiKey}>시작하기</button>
          </div>
        </div>
      ) : (
        <>
          <div className="controls">
            <button onClick={handleRefresh} disabled={loading} className="refresh-button">
              {loading ? '계산 중...' : '시세 갱신'}
            </button>
            {lastUpdated && (
              <span className="last-updated">최종 업데이트: {formatLastUpdated()}</span>
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

          {results.size > 0 && !loading && (
            <div className="results">
              <h2>인기 아이템 효율</h2>

              <div className="results-grid">
                {Array.from(results.entries()).map(([itemName, efficiency]) => (
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

          {results.size === 0 && !loading && !error && (
            <div className="empty-state">
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          )}
        </>
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
