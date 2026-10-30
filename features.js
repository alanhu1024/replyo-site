(() => {
  const button = document.getElementById('language-switch');
  const texts = [...document.querySelectorAll('[data-en]')].map(node => ({ node, zh: node.innerHTML, en: node.dataset.en }));
  const attributes = [['data-en-content', 'content'], ['data-en-aria', 'aria-label'], ['data-en-alt', 'alt']].flatMap(([source, target]) =>
    [...document.querySelectorAll('[' + source + ']')].map(node => ({ node, target, zh: node.getAttribute(target), en: node.getAttribute(source) }))
  );
  const key = 'replyo-site-language';
  let language = 'zh-CN';
  try { if (localStorage.getItem(key) === 'en') language = 'en'; } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'zh' || requested === 'zh-CN') {
    language = requested === 'en' ? 'en' : 'zh-CN';
    try { localStorage.setItem(key, language); } catch {}
  }
  function render() {
    const english = language === 'en';
    document.documentElement.lang = language;
    for (const item of texts) {
      if (english) item.node.textContent = item.en;
      else item.node.innerHTML = item.zh;
    }
    for (const item of attributes) item.node.setAttribute(item.target, english ? item.en : item.zh);
    button.textContent = english ? '中文' : 'English';
    button.lang = english ? 'zh-CN' : 'en';
    button.setAttribute('aria-label', english ? '切换为中文' : 'Switch to English');
  }
  button.hidden = false;
  button.addEventListener('click', () => {
    language = language === 'en' ? 'zh-CN' : 'en';
    render();
    try { localStorage.setItem(key, language); } catch {}
    const current = new URL(location.href);
    if (current.searchParams.has('lang')) {
      current.searchParams.set('lang', language);
      history.replaceState(null, '', current);
    }
  });
  render();
})();
