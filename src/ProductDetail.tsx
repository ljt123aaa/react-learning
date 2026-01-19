import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>商品详情</h2>
      
      <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>当前路由参数</h3>
        <p>商品ID: {id}</p>
        <p>完整路径: {window.location.pathname}</p>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>商品信息</h3>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>名称:</strong> 商品 {id}</p>
          <p><strong>价格:</strong> ¥{(parseInt(id ?? '0') * 1000).toLocaleString()}</p>
        <p><strong>描述:</strong> 这是商品 {id} 的详细描述信息...</p>
      </div>
    </div>
  );
}
