(function () {
  let k = window.Kapa;
  if (!k) {
    let i = function () {
      i.c(arguments);
    };
    i.q = [];
    i.c = function (args) {
      i.q.push(args);
    };
    window.Kapa = i;
  }
})();

// keeps MkDocs from seeing the keydown
function stopMkdocsShortcuts(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const blocked = new Set(['/', 's', 'f', 'n', 'p', '.']);
  if (blocked.has(e.key.toLowerCase())) {
    e.stopImmediatePropagation();
  }
}

Kapa('onModalOpen', () => {
  window.addEventListener('keydown', stopMkdocsShortcuts, true);
});

Kapa('onModalClose', () => {
  window.removeEventListener('keydown', stopMkdocsShortcuts, true);
});

document.addEventListener('DOMContentLoaded', function () {
  var script = document.createElement('script');
  script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  script.setAttribute(
    'data-website-id',
    'bdc8d8d1-789f-4bc2-8dfe-8fc2dab23f3f'
  );
  script.setAttribute('data-project-name', 'Agglayer');
  script.setAttribute('data-project-color', '#ffffff');
  script.setAttribute(
    'data-project-logo',
    'https://docs.agglayer.dev/img/agglayer/agglayer-logo-mark-black-rgb.svg'
  );
  script.setAttribute('data-button-image-height', '1.7rem');
  script.setAttribute('data-button-image-width', '1.7rem');
  script.setAttribute('data-modal-open-by-default', 'false');
  script.setAttribute('data-modal-title', 'Agglayer Docs Chat Bot');
  script.setAttribute('data-modal-example-questions-title', 'Try asking me...');
  script.setAttribute('data-font-size-sm', '0.7rem');
  script.setAttribute('data-query-input-font-size', '0.70rem');
  script.setAttribute('data-modal-disclaimer-font-size', '0.6rem');
  script.setAttribute('data-modal-title-font-size', '1.1rem');
  script.setAttribute('data-button-position-top', '10px');
  script.setAttribute('data-button-position-right', '20px');
  script.setAttribute('data-button-text-font-size', '0.9rem');
  script.setAttribute("data-user-analytics-cookie-enabled","true");
  script.setAttribute('data-button-text-color', '#000000');
  script.setAttribute('data-button-height', '3.8rem');
  script.setAttribute('data-button-width', '3.6rem');
  script.setAttribute(
    'data-modal-disclaimer',
    'This AI chatbot is powered by kapa.ai. Responses are generated automatically and may be inaccurate or incomplete. Do not rely on this information as legal, financial or other professional advice. By using this assistant, you agree that your input may be processed in accordance with the kapa.ai privacy policy: https://www.kapa.ai/content/privacy-policy'
  );
  script.setAttribute(
    'data-modal-example-questions',
    'How does Agglayer work?, How does CDK work?, What is the pessimistic proof?'
  );

  script.setAttribute('data-modal-title-color', '#ffffff');
  script.setAttribute('data-modal-header-bg-color', '#0071F7');
  script.async = true;
  document.head.appendChild(script);
});