import type { FC } from 'hono/jsx'
import { navbarStyles } from './navbarStyles'

interface NavbarProps {
  title?: string;
  links?: Array<{
    href: string;
    label: string;
    active?: boolean;
  }>;
}

const Navbar: FC<NavbarProps> = ({ 
  title = "Price Demo",
  links = [
    { href: "/", label: "首页", active: true },
    { href: "/about", label: "关于" }
  ]
}) => {
  return (
    <header class="navbar">
      <style>{navbarStyles}</style>
      
      <div class="navbar-container">
        <div class="navbar-brand">
          <a href="/" class="brand-link">
            <i class="brand-icon fas fa-chart-bar"></i>
            <span class="brand-text">{title}</span>
          </a>
        </div>
        
        <nav class="navbar-nav">
          <ul class="nav-list">
            {links.map((link, index) => (
              <li class="nav-item" key={index}>
                <a 
                  href={link.href} 
                  class={`nav-link ${link.active ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div class="navbar-actions">
          <button class="theme-toggle" id="theme-toggle-btn" title="切换主题">
            <i class="theme-icon light-icon fas fa-sun"></i>
            <i class="theme-icon dark-icon fas fa-moon"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;