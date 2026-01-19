import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ProductList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputKeyword, setInputKeyword] = useState('');

  const category = searchParams.get('category') || 'all';
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sort') || 'default';
  const q = searchParams.get('q') || '';

  function handleSearch() {
    if (inputKeyword.trim()) {
      setSearchParams({
        q: inputKeyword.trim(),
        category: 'all',
        page: '1',
        sort: 'default'
      });
    }
  }

  function handleCategoryChange(newCategory: string) {
    setSearchParams({
      q,
      category: newCategory,
      page: '1',
      sort
    });
  }

  function handleSortChange(newSort: string) {
    setSearchParams({
      q,
      category,
      page,
      sort: newSort
    });
  }

  function handlePageChange(newPage: string) {
    setSearchParams({
      q,
      category,
      page: newPage,
      sort
    });
  }

  function goToProductDetail(productId: string) {
    navigate(`/product/${productId}`);
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>商品列表</h2>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>筛选条件</h3>

        <div style={{ marginBottom: '10px' }}>
          <label>搜索关键词: </label>
          <input
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="输入商品名称"
            style={{ padding: '5px', marginLeft: '10px' }}
          />
          <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '5px 10px' }}>搜索</button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>分类: </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={{ padding: '5px', marginLeft: '10px' }}
          >
            <option value="all">全部</option>
            <option value="electronics">电子产品</option>
            <option value="clothing">服装</option>
            <option value="food">食品</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>排序: </label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ padding: '5px', marginLeft: '10px' }}
          >
            <option value="default">默认</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="date">最新上架</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h3>当前查询参数</h3>
        <p>关键词: {q || '无'}</p>
        <p>分类: {category}</p>
        <p>页码: {page}</p>
        <p>排序: {sort}</p>
        <p>完整URL: {window.location.search}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>商品列表</h3>
        <ul>
          <li style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', cursor: 'pointer' }} onClick={() => goToProductDetail('1')}>
            <strong>iPhone 15</strong> - 电子产品 - ¥6999
          </li>
          <li style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', cursor: 'pointer' }} onClick={() => goToProductDetail('2')}>
            <strong>MacBook Pro</strong> - 电子产品 - ¥12999
          </li>
          <li style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', cursor: 'pointer' }} onClick={() => goToProductDetail('3')}>
            <strong>T恤</strong> - 服装 - ¥99
          </li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => handlePageChange(Math.max(1, parseInt(page) - 1).toString())}
          disabled={page === '1'}
          style={{ padding: '5px 15px' }}
        >
          上一页
        </button>
        <span style={{ padding: '5px 15px' }}>第 {page} 页</span>
        <button
          onClick={() => handlePageChange((parseInt(page) + 1).toString())}
          style={{ padding: '5px 15px' }}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
