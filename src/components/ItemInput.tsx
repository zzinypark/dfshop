import { useState } from 'react';
import { CashItem } from '../types';

interface Props {
  onAddItem: (item: CashItem) => void;
}

export function ItemInput({ onAddItem }: Props) {
  const [itemType, setItemType] = useState<'single' | 'package'>('single');
  const [name, setName] = useState('');
  const [cashPrice, setCashPrice] = useState('');
  const [itemId, setItemId] = useState('');

  // 패키지 아이템용 상태
  const [packageItems, setPackageItems] = useState<
    Array<{ itemId: string; name: string; count: string; isBound: boolean }>
  >([{ itemId: '', name: '', count: '1', isBound: false }]);

  const [bonusItems, setBonusItems] = useState<
    Array<{ itemId: string; name: string; count: string; isBound: boolean }>
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !cashPrice) {
      alert('아이템 이름과 캐시 가격을 입력해주세요.');
      return;
    }

    if (itemType === 'single') {
      if (!itemId) {
        alert('아이템 ID를 입력해주세요.');
        return;
      }

      const item: CashItem = {
        type: 'single',
        name,
        itemId,
        cashPrice: parseInt(cashPrice),
      };

      onAddItem(item);
    } else {
      // 패키지 아이템
      if (packageItems.length === 0 || !packageItems[0].itemId) {
        alert('최소 하나 이상의 패키지 아이템을 입력해주세요.');
        return;
      }

      const item: CashItem = {
        type: 'package',
        name,
        cashPrice: parseInt(cashPrice),
        items: packageItems
          .filter((i) => i.itemId && i.name)
          .map((i) => ({
            itemId: i.itemId,
            name: i.name,
            count: parseInt(i.count) || 1,
            isBound: i.isBound,
          })),
        bonusItems:
          bonusItems.length > 0
            ? bonusItems
                .filter((i) => i.itemId && i.name)
                .map((i) => ({
                  itemId: i.itemId,
                  name: i.name,
                  count: parseInt(i.count) || 1,
                  isBound: i.isBound,
                }))
            : undefined,
      };

      onAddItem(item);
    }

    // 폼 초기화
    setName('');
    setCashPrice('');
    setItemId('');
    setPackageItems([{ itemId: '', name: '', count: '1', isBound: false }]);
    setBonusItems([]);
  };

  const addPackageItem = () => {
    setPackageItems([...packageItems, { itemId: '', name: '', count: '1', isBound: false }]);
  };

  const removePackageItem = (index: number) => {
    setPackageItems(packageItems.filter((_, i) => i !== index));
  };

  const addBonusItem = () => {
    setBonusItems([...bonusItems, { itemId: '', name: '', count: '1', isBound: true }]);
  };

  const removeBonusItem = (index: number) => {
    setBonusItems(bonusItems.filter((_, i) => i !== index));
  };

  return (
    <div className="item-input">
      <h2>아이템 추가</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이템 종류:</label>
          <select value={itemType} onChange={(e) => setItemType(e.target.value as any)}>
            <option value="single">단일 아이템</option>
            <option value="package">패키지 아이템</option>
          </select>
        </div>

        <div className="form-group">
          <label>아이템 이름:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>캐시 가격:</label>
          <input
            type="number"
            value={cashPrice}
            onChange={(e) => setCashPrice(e.target.value)}
          />
        </div>

        {itemType === 'single' ? (
          <div className="form-group">
            <label>아이템 ID:</label>
            <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} />
          </div>
        ) : (
          <>
            <div className="package-items">
              <h3>패키지 구성 아이템</h3>
              {packageItems.map((item, index) => (
                <div key={index} className="package-item-row">
                  <input
                    type="text"
                    placeholder="아이템 ID"
                    value={item.itemId}
                    onChange={(e) => {
                      const newItems = [...packageItems];
                      newItems[index].itemId = e.target.value;
                      setPackageItems(newItems);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="아이템 이름"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...packageItems];
                      newItems[index].name = e.target.value;
                      setPackageItems(newItems);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="수량"
                    value={item.count}
                    onChange={(e) => {
                      const newItems = [...packageItems];
                      newItems[index].count = e.target.value;
                      setPackageItems(newItems);
                    }}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={item.isBound}
                      onChange={(e) => {
                        const newItems = [...packageItems];
                        newItems[index].isBound = e.target.checked;
                        setPackageItems(newItems);
                      }}
                    />
                    귀속
                  </label>
                  {packageItems.length > 1 && (
                    <button type="button" onClick={() => removePackageItem(index)}>
                      삭제
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPackageItem}>
                아이템 추가
              </button>
            </div>

            <div className="bonus-items">
              <h3>보너스 아이템 (10회 구매 시)</h3>
              {bonusItems.map((item, index) => (
                <div key={index} className="package-item-row">
                  <input
                    type="text"
                    placeholder="아이템 ID"
                    value={item.itemId}
                    onChange={(e) => {
                      const newItems = [...bonusItems];
                      newItems[index].itemId = e.target.value;
                      setBonusItems(newItems);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="아이템 이름"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...bonusItems];
                      newItems[index].name = e.target.value;
                      setBonusItems(newItems);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="수량"
                    value={item.count}
                    onChange={(e) => {
                      const newItems = [...bonusItems];
                      newItems[index].count = e.target.value;
                      setBonusItems(newItems);
                    }}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={item.isBound}
                      onChange={(e) => {
                        const newItems = [...bonusItems];
                        newItems[index].isBound = e.target.checked;
                        setBonusItems(newItems);
                      }}
                    />
                    귀속
                  </label>
                  <button type="button" onClick={() => removeBonusItem(index)}>
                    삭제
                  </button>
                </div>
              ))}
              <button type="button" onClick={addBonusItem}>
                보너스 아이템 추가
              </button>
            </div>
          </>
        )}

        <button type="submit" className="submit-button">
          효율 계산하기
        </button>
      </form>
    </div>
  );
}
