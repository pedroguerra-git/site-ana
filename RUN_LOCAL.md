# Rodar o site (mastigado)

## 1) Descompacte o ZIP
Você terá uma pasta `site_ana_paula_rocha_v4_clean/`.

## 2) Abra um servidor local (recomendado)
Isso evita problemas de caminho e permite carregar o `site.config.json`.

No Mac:
```bash
cd site_ana_paula_rocha_v4_clean
python3 -m http.server 8000
```

Depois abra no navegador:
- http://localhost:8000

## 3) Não precisa renomear nada
A imagem do header está em:
- `assets/hero_2560x900_clean.jpg` (fallback garantido)
- `assets/hero_2560x900_clean.webp` (se o navegador suportar)

O site já aponta para esses nomes.

## 4) Onde editar
- `site.config.json` (CRM, endereço, horários, Instagram, links de agendamento)
- `booking.mode` define se a página **/agendar** mostra Calendly/Doctoralia/form/link

Pronto.
