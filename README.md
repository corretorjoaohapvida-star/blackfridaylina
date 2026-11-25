# Lina Criativa — Aluninha e Coletiva Escolar2027

Página de vendas estática. Esta versão substitui a oferta anterior de oito coletivas Black Friday.

## Vercel

Importe `corretorjoaohapvida-star/blackfridaylina` com estas opções:

- Production Branch: `main`.
- Framework Preset: **Other**.
- Root Directory: raiz do repositório.
- Build Command: nenhum; `null` no `vercel.json`.
- Install Command: nenhum; não há dependências ou `package.json`.
- Output Directory: `.`; configurado no `vercel.json`.
- Nenhuma variável de ambiente é necessária para servir a página.

`index.html`, `config.js`, `vercel.json` e os assets públicos estão na raiz. O projeto não precisa de servidor Node nem de etapa de compilação. Um projeto Vercel já conectado à branchmain pode iniciar um deploy após o push; confira o status na plataforma. Este commit não comprova a conclusão desse deploy.

## Ofertas e destinos

| Caminho | Valor total | URL |
|---|---|---|
| Aluninha+Menino / recusa do pop-up | R$17,90 | https://pay.wiapy.com/8YM4jR-c4yfT |
| Coletiva completa diretamente na página | R$37,90 | https://pay.wiapy.com/6b0762983abee4176b743b65 |
| Coletiva completa aceita no pop-up | R$27,90 | https://pay.wiapy.com/8K61XNB0LF3 |

O clique no plano de entrada abre o pop-up. Aceitar leva ao checkout especial; recusar mantém o kit de entrada. Os três destinos têm chaves independentes em `config.js`. O valor de27,90 substitui o valor de17,90; não representa cobrança adicional automática.

## Conteúdo e pixel

Coletiva apresentada com92kits, mais de1.700artes, miolos2027 e quatro bônus. A quantidade é a base de modelos do catálogo; não uma nova auditoria recursiva de arquivos únicos. Os conteúdos e bônus precisam corresponder à entrega mantida pela produtora. A licença permite produzir/vender peças físicas e proíbe revenda ou compartilhamento dos arquivos.

Meta Pixel **1119672483929286**: script original no body, inicialização e PageView. Nenhum token de API está no projeto. Não há eventoPurchase configurado nesta página. A CSP usa hash do script inline; se alterar esse script, recalcule o hash.

O banner usa o contador diário já aprovado pelo proprietário. A meta de robôs `noindex,nofollow` foi preservada. Carrosséis automáticos respeitam redução de movimento. Mockups responsivos e imagens abaixo da abertura são carregados sob demanda.

## Verificação

Fluxos de saída, pop-up, pixel/CSP e layout mobile foram conferidos em Chrome local. Destinos de checkout foram respondidos localmente durante os testes: isso não comprova preço configurado na Wiapy, pagamento, entrega ou recebimento de eventos pela Meta em produção.

O repositório publica somente a página, seus arquivos de configuração e assets referenciados. A vitrine/app e a página de obrigado da oferta antiga foram retiradas desta versão, assim como os assets antigos sem uso. A versão anterior permanece no histórico Git. Arquivos privados de entrega, links do Drive, relatórios internos, prompts e credenciais não são publicados.
