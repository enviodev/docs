# Envio docs

## Cmd to generate the cli-commands file

Run from codegenerator dir and copy file over to docs/docs dir

{
  echo '---'
  echo 'id: cli-commands'
  echo 'title: Envio CLI'
  echo 'sidebar_label: Envio CLI'
  echo 'slug: /cli-commands'
  echo '---'
  cargo run -- print-all-help
} > cli-commands.md
