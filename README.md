# Sparta Gym — Landing Page

Projeto estático (HTML/CSS/JS puro, sem dependências externas de build).

## Estrutura
```
sparta-gym/
├── index.html
├── css/style.css
├── js/script.js
└── assets/img/   (fotos reais da academia + logo, já otimizadas em .jpg/.webp)
```

Basta abrir `index.html` num navegador ou subir a pasta inteira no Vercel/GitHub Pages.

## Decisões de identidade
- Nome da marca padronizado como **SPARTA GYM** (conforme o logo real enviado), e não
  "Spartan Gym" — ajuste fácil de reverter caso prefira o outro nome.
- Paleta: preto `#090909`, cinza `#181818`, vermelho `#C30010`, branco — exatamente como pedido.
- Tipografia: **Anton** (títulos de impacto), **Barlow Condensed** (rótulos/menu/botões),
  **Inter** (corpo de texto) — carregadas via Google Fonts.
- Elemento de assinatura: o "spear separator" (divisor em forma de lança) usado no hero e
  como referência visual ao tema espartano, no lugar de numeração genérica (01/02/03).
- Sem GSAP/bibliotecas externas de animação: scroll reveal, parallax do hero e carrossel de
  depoimentos foram feitos em JS puro com `IntersectionObserver`, pensando em manter o
  Lighthouse alto. Se quiser trocar por GSAP depois, a estrutura de classes `.reveal` já
  facilita a substituição.

## Pontos que precisam da sua confirmação
1. **Instagram**: não recebi o @ oficial da academia, então os botões de Instagram apontam
   para `instagram.com` genérico. Troque pelo link real em `index.html` (4 ocorrências).
2. **Telefone/WhatsApp**: usei `(75) 99221-6514` → `https://wa.me/5575992216514`. Confirme se
   o número está correto para WhatsApp Business.
3. **Mapa**: o iframe usa uma busca por endereço (sem necessidade de API key). Se quiser o
   pino exato do Google Maps, me passe o link do local no Google Maps que eu troco pelo
   embed com coordenadas exatas.
4. **Avaliações do Google**: os 4 depoimentos e a nota 4,8/5 (25 avaliações) foram os que
   você enviou no briefing — troque quando tiver novos.

## Performance
- Todas as fotos reais foram redimensionadas e comprimidas (JPEG + WebP com `<picture>`),
  com `loading="lazy"` nas imagens fora da hero.
- CSS e JS em arquivos únicos, sem frameworks, para carregamento rápido.
