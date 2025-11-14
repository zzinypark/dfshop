import { PriceEfficiency } from '../types';

interface Props {
  efficiency: PriceEfficiency;
  isPackage10?: boolean;
}

export function ItemEfficiencyCard({ efficiency, isPackage10 }: Props) {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const formatEfficiency = (eff: number) => {
    return eff.toFixed(2);
  };

  return (
    <div className={`efficiency-card ${isPackage10 ? 'package-10' : ''}`}>
      <h3>{efficiency.itemName}</h3>

      <div className="price-info">
        <div className="price-row">
          <span className="label">캐시 가격:</span>
          <span className="value">{formatNumber(efficiency.cashPrice)} 캐시</span>
        </div>

        <div className="price-row tradeable">
          <span className="label">거래 가능 가치:</span>
          <span className="value gold">{formatNumber(efficiency.tradeableValue)} 골드</span>
        </div>

        {efficiency.boundValue > 0 && (
          <div className="price-row bound">
            <span className="label">귀속 가치:</span>
            <span className="value gold">{formatNumber(efficiency.boundValue)} 골드</span>
          </div>
        )}

        <div className="price-row total">
          <span className="label">총 가치:</span>
          <span className="value gold total-value">
            {formatNumber(efficiency.totalValue)} 골드
          </span>
        </div>

        <div className="efficiency-row">
          <span className="label">효율:</span>
          <span className="value efficiency-value">
            {formatEfficiency(efficiency.efficiency)} 골드/캐시
          </span>
        </div>
      </div>
    </div>
  );
}
