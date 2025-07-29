import type { FC } from 'hono/jsx'

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: FC<HeaderProps> = ({ 
  title = "💰 实时价格数据", 
  subtitle = "获取最新的黄金价格、汇率和股票指数信息"
}) => {
  return (
    <div class="page-header">
      <h2 class="header-title">{title}</h2>
      <p class="header-subtitle">{subtitle}</p>
    </div>
  );
};

export default Header;