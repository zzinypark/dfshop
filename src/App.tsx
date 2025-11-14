import { useState } from 'react';
import { CashItem, PriceEfficiency } from './types';
import { NeoPleAPI } from './services/api';
import { EfficiencyCalculator } from './services/calculator';
import { ItemInput } from './components/ItemInput';
import { ItemEfficiencyCard } from './components/ItemEfficiencyCard';
import { SAMPLE_ITEMS } from './data/items';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [items, setItems] = useState<CashItem[]>([]);
  const [results, setResults] = useState<
    Map<string, { single: PriceEfficiency; package10?: PriceEfficiency }>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      alert('API 키를 입력해주세요.');
      return;
    }
    setIsApiKeySet(true);
    setError(null);
  };

  const handleAddItem = async (item: CashItem) => {
    if (!isApiKeySet) {
      alert('먼저 API 키를 설정해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = new NeoPleAPI(apiKey);
      const calculator = new EfficiencyCalculator(api);

      const efficiency = await calculator.calculateSingleItemEfficiency(item);

      setItems([...items, item]);
      setResults(new Map(results).set(item.name, efficiency));
    } catch (err) {
      console.error('Error calculating efficiency:', err);
      setError(
        `효율 계산 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleItems = async () => {
    if (!isApiKeySet) {
      alert('먼저 API 키를 설정해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = new NeoPleAPI(apiKey);
      const calculator = new EfficiencyCalculator(api);

      const efficiencies = await calculator.calculateMultipleItems(SAMPLE_ITEMS);

      setItems(SAMPLE_ITEMS);
      setResults(efficiencies);
    } catch (err) {
      console.error('Error calculating efficiencies:', err);
      setError(
        `효율 계산 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = () => {
    setItems([]);
    setResults(new Map());
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>던파 캐시 아이템 효율 계산기</h1>
        <p>캐시 아이템의 경매장 기반 골드 효율을 확인하세요</p>
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
            <button onClick={handleSetApiKey}>설정</button>
          </div>
        </div>
      ) : (
        <>
          <div className="controls">
            <button onClick={handleLoadSampleItems} disabled={loading}>
              예시 아이템 불러오기
            </button>
            <button onClick={handleClearResults} disabled={loading}>
              결과 초기화
            </button>
            <button onClick={() => setIsApiKeySet(false)}>API 키 변경</button>
          </div>

          <ItemInput onAddItem={handleAddItem} />

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>효율을 계산하고 있습니다...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          {results.size > 0 && (
            <div className="results">
              <h2>계산 결과</h2>

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

          {results.size === 0 && !loading && (
            <div className="empty-state">
              <p>아이템을 추가하거나 예시 아이템을 불러와 효율을 계산해보세요.</p>
            </div>
          )}
        </>
      )}

      <footer className="app-footer">
        <p>
          데이터 출처: Neople Open API | 최근 거래 내역을 기반으로 계산됩니다. | 실제 시세와
          차이가 있을 수 있습니다.
        </p>
      </footer>
    </div>
  );
}

export default App;
