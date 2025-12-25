class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin-top: 4rem;
        }
        footer {
          background-color: #333;
          color: white;
          padding: 2rem 0;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .footer-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #fff;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        .footer-section li {
          margin-bottom: 0.5rem;
        }
        .footer-section a {
          color: #bbb;
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-section a:hover {
          color: white;
        }
        .social-links {
          display: flex;
          gap: 1rem;
        }
        .social-links a {
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transition: all 0.3s;
        }
        .social-links a:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .copyright {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #444;
          color: #bbb;
          font-size: 0.9rem;
        }
      </style>
      <footer>
        <div class="footer-container">
          <div class="footer-section">
            <h3>О нас</h3>
            <p>Добро пожаловать в Pixel Perfect Gallery!</br> Здесь объединяется искусство и юмор: яркие постеры, созданные в Photoshop, и лёгкая лента мемов для вдохновения и улыбок.</br></br>
            Мой сайт — это место, где креатив встречается с весельем. Я верю, что визуальное искусство должно быть не только красивым, но и доступным, а мемы — не только смешными, но и частью современной культуры.</br>
            Каждый постер, который вы видите здесь, создаётся с вниманием к деталям и любовью к пикселям. А моя мем-лента — это лёгкий способ поднять настроение в любой день.</br>
            Присоединяйтесь, вдохновляйтесь и делитесь своим настроением вместе с нами!</p>
          </div>
          <div class="footer-section">
            <h3>Навигация</h3>
            <ul>
              <li><a href="#">Главная</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Соц. сети и связь</h3>
            <div class="social-links">
              <a href="https://www.instagram.com/andayleee/" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37a4 4 0 1 1-7.9 1.63 4 4 0 0 1 7.9-1.63z"></path>
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
                </a>
              <a href="https://www.instagram.com/anaxxee/" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37a4 4 0 1 1-7.9 1.63 4 4 0 0 1 7.9-1.63z"></path>
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
                </a>
              <a href="mailto:aksenovaks25@gmail.com" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                </a>
              <a href="https://t.me/andayleee_exe" aria-label="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <paper-plane stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M22 2L2 12l6 2 2 6 12-18z"></path>
                </svg>
                </a>
            </div>
          </div>
        </div>
        <div class="copyright">
          &copy; ${new Date().getFullYear()} Pixel Perfect Gallery. Все права защищиены.
        </div>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);