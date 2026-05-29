import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import 'antd/dist/reset.css';

interface CustomPaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
}

function CustomPagination({ 
  current, 
  total, 
  pageSize = 10, 
  onChange, 
  showSizeChanger = true,
  pageSizeOptions = ['10', '20', '50', '100']
}: CustomPaginationProps) {
  
  const handleChange: PaginationProps['onChange'] = (page, size) => {
    onChange(page, size);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem 0',
      marginTop: '2rem'
    }}>
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={handleChange}
        showSizeChanger={showSizeChanger}
        pageSizeOptions={pageSizeOptions}
        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
        locale={{
          items_per_page: '/ trang',
          jump_to: 'Đến',
          jump_to_confirm: 'xác nhận',
          page: 'Trang',
          prev_page: 'Trang trước',
          next_page: 'Trang sau',
          prev_5: '5 trang trước',
          next_5: '5 trang sau',
          prev_3: '3 trang trước',
          next_3: '3 trang sau',
        }}
      />
    </div>
  );
}

export default CustomPagination;
